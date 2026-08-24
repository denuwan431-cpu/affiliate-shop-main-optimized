import { db } from '@/db';
import { products } from '@/db/schema';
import { ilike, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const suggestions = await db.query.products.findMany({
      where: ilike(products.name, `%${query}%`),
      columns: {
        id: true,
        name: true,
        price: true,
        imageUrls: true,
      },
      limit: 5,
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
