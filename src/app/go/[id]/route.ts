import { db } from '@/db';
import { products, clickLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Track click asynchronously
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'unknown';
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  // We don't await this to keep redirection fast
  db.insert(clickLogs).values({
    productId,
    userAgent,
    ip,
  }).catch(err => console.error('Click log error:', err));

  return NextResponse.redirect(product.affiliateUrl);
}
