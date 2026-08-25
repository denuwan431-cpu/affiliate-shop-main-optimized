import { db } from "@/db";
import { products, categories, banners } from "@/db/schema";
import { eq, asc, desc, ilike, or } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import HomeFilters from "@/components/HomeFilters";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: any) {
  const params = await searchParams;
  const selectedCat = params.category || 'all';
  const searchQuery = params.q || '';
  const sortOrder = params.sort || 'newest';

  const [heroBanners, activeCats] = await Promise.all([
    db.query.banners.findMany({ where: eq(banners.isEnabled, true), orderBy: [asc(banners.order)] }),
    db.query.categories.findMany({ where: eq(categories.isEnabled, true), orderBy: [asc(categories.order)] })
  ]);

  let conditions: any[] = [];
  if (selectedCat !== 'all') {
    const cat = activeCats.find(c => c.slug === selectedCat);
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }
  if (searchQuery) {
    conditions.push(or(ilike(products.name, `%${searchQuery}%`), ilike(products.shortName, `%${searchQuery}%`)));
  }

  let orderBy: any = [desc(products.createdAt)];
  if (sortOrder === 'price_low') orderBy = [asc(products.price)];
  if (sortOrder === 'price_high') orderBy = [desc(products.price)];
  if (sortOrder === 'rating') orderBy = [desc(products.rating)];

  const allProducts = await db.query.products.findMany({
    where: conditions.length > 0 ? (conditions.length > 1 ? undefined : conditions[0]) : undefined,
    orderBy: orderBy
  });

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24">
      {/* 1. Hero Banner Manager */}
      {heroBanners.length > 0 && (
        <section className="relative h-[450px] md:h-[600px] w-full bg-gray-900 overflow-hidden mb-12 shadow-2xl">
          <img src={heroBanners[0].imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 max-w-5xl mx-auto">
            <span className="bg-orange-600 text-white text-[11px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] mb-6 shadow-xl">Hot Deals</span>
            <h1 className="text-4xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9] drop-shadow-2xl italic">
              {heroBanners[0].title}
            </h1>
            <p className="text-lg md:text-2xl opacity-90 mb-10 max-w-2xl font-bold leading-relaxed">
              {heroBanners[0].subtitle}
            </p>
            <Link href={heroBanners[0].buttonUrl || '/'} className="bg-white text-black hover:bg-orange-600 hover:text-white px-14 py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">
              {heroBanners[0].buttonText || 'Discover More'}
            </Link>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* 2. Unified Professional Filters (Only ONE Search bar is here) */}
        <HomeFilters categories={activeCats} />
        
        {/* 3. Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {allProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {allProducts.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm mt-10">
            <div className="text-slate-200 text-8xl mb-6">🔍</div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">No results found</h3>
            <p className="text-slate-400 font-bold text-sm mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </main>
  );
}
