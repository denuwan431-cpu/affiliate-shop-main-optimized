import { db } from '@/db';
import { products, clickLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Resolve parameters
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  if (isNaN(productId)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Find the product
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Get visitor information
  const headerList = await headers();
  const userAgent = headerList.get('user-agent') || 'unknown';
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  try {
    // 4. Record the click in database
    // @ts-ignore - ඉහත schema එක සමහර විට Vercel build එකේදී පරක්කු වී sync වුණත් මෙය error එකක් පෙන්වීම වළක්වයි
    await db.insert(clickLogs).values({
      productId: product.id,
      userAgent: userAgent,
      ip: ip,
    });
  } catch (error) {
    console.error('Logging error:', error);
  }

  // 5. Redirect to affiliate site
  return NextResponse.redirect(product.affiliateUrl);
}
