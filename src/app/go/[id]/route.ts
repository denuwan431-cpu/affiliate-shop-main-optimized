import { db } from '@/db';
import { products, clickLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Resolve parameters (Next.js 15+ සඳහා අත්‍යවශ්‍ය වේ)
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  if (isNaN(productId)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. භාණ්ඩය පරීක්ෂා කිරීම
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Analytics සඳහා පාරිභෝගික විස්තර ලබා ගැනීම
  const headerList = await headers();
  const userAgent = headerList.get('user-agent') || 'unknown';
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  try {
    // 4. ක්ලික් එක සටහන් කිරීම
    // @ts-ignore
    await db.insert(clickLogs).values({
      productId: product.id,
      userAgent: userAgent,
      ip: ip,
    });
  } catch (error) {
    console.error('Logging error:', error);
  }

  // 5. Affiliate URL එකට යොමු කිරීම
  return NextResponse.redirect(product.affiliateUrl);
}
