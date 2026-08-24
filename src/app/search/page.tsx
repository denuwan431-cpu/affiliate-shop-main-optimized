import React from 'react';
import { db } from '@/db';
import { products } from '@/db/schema';
import { and, asc, desc, gte, ilike, lte, or, sql } from 'drizzle-orm';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const sort = typeof params.sort === 'string' ? params.sort : 'relevance';
  const min = typeof params.min === 'string' && params.min ? Number(params.min) : undefined;
  const max = typeof params.max === 'string' && params.max ? Number(params.max) : undefined;
  const flash = params.flash === '1';

  const conditions = [];
  if (query) conditions.push(or(ilike(products.name, `%${query}%`), ilike(products.description, `%${query}%`)));
  if (Number.isFinite(min)) conditions.push(gte(products.price, String(min)));
  if (Number.isFinite(max)) conditions.push(lte(products.price, String(max)));
  if (flash) conditions.push(sql`${products.isFlashSale} = true`);

  let orderBy;
  if (sort === 'price_asc') orderBy = [asc(products.price)];
  else if (sort === 'price_desc') orderBy = [desc(products.price)];
  else if (sort === 'rating') orderBy = [desc(products.rating)];
  else orderBy = [desc(products.createdAt)];

  const results = await db.query.products.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy,
    limit: 100,
  });

  const buildUrl = (extra: Record<string, string>) => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    if (typeof params.min === 'string' && params.min) next.set('min', params.min);
    if (typeof params.max === 'string' && params.max) next.set('max', params.max);
    if (flash) next.set('flash', '1');
    Object.entries(extra).forEach(([k, v]) => next.set(k, v));
    return `/search?${next.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <form action="/search" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b">
              <SlidersHorizontal size={20} />
              <h2 className="font-bold">Filters</h2>
            </div>
            {query && <input type="hidden" name="q" value={query} />}
            {flash && <input type="hidden" name="flash" value="1" />}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <input name="min" type="number" min="0" placeholder="Min" defaultValue={typeof params.min === 'string' ? params.min : ''} className="w-full p-2 border rounded-lg text-sm" />
                <input name="max" type="number" min="0" placeholder="Max" defaultValue={typeof params.max === 'string' ? params.max : ''} className="w-full p-2 border rounded-lg text-sm" />
              </div>
            </div>
            <button className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition">Apply Filters</button>
            <a href={query ? `/search?q=${encodeURIComponent(query)}` : '/search'} className="block text-center text-xs font-bold text-gray-500 hover:text-orange-500">Clear filters</a>
          </form>
        </aside>

        <section className="flex-1 min-w-0">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="font-bold text-gray-900">{flash ? 'Featured Deals' : query ? `Search results for “${query}”` : 'All Products'}</h1>
              <p className="text-xs text-gray-500 mt-1">{results.length} products found</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort:</span>
              <div className="flex gap-1 flex-wrap">
                <a href={buildUrl({ sort: 'relevance' })} className={`px-3 py-1.5 rounded-lg ${sort === 'relevance' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-gray-50 text-gray-600'}`}>Relevance</a>
                <a href={buildUrl({ sort: 'price_asc' })} className={`px-3 py-1.5 rounded-lg ${sort === 'price_asc' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-gray-50 text-gray-600'}`}>Low → High</a>
                <a href={buildUrl({ sort: 'price_desc' })} className={`px-3 py-1.5 rounded-lg ${sort === 'price_desc' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-gray-50 text-gray-600'}`}>High → Low</a>
                <a href={buildUrl({ sort: 'rating' })} className={`px-3 py-1.5 rounded-lg ${sort === 'rating' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-gray-50 text-gray-600'}`}>Rating</a>
              </div>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {results.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="bg-white p-20 text-center rounded-2xl shadow-sm border border-gray-100">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-gray-500">Try another search or remove some filters.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
