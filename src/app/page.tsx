import { db } from "@/db";
import { products, categories, banners } from "@/db/schema";
import { eq, asc, desc, ilike, or } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import HomeFilters from "@/components/HomeFilters"; // Import the new client component
import Link from "next/link";

export default async function HomePage({ searchParams }: { searchParams: { category?: string, q?: string, sort?: string } }) {
  const params = await searchParams; // Next.js 15+ needs await for params
  const selectedCat = params.category || 'all';
  const searchQuery = params.q || '';
  const sortOrder = params.sort || 'newest';

  const [heroBanners, activeCats] = await Promise.all([
    db.query.banners.findMany({ where: eq(banners.isEnabled, true), orderBy: [asc(banners.order)] }),
    db.query.categories.findMany({ where: eq(categories.isEnabled, true), orderBy: [asc(categories.order)] })
  ]);

  // Filtering Logic
  let conditions: any[] = [];
  if (selectedCat !== 'all') {
    const cat = activeCats.find(c => c.slug === selectedCat);
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }
  if (searchQuery) {
    conditions.push(or(ilike(products.name, `%${searchQuery}%`), ilike(products.shortName, `%${searchQuery}%`)));
  }

  // Sorting Logic
  let orderBy: any = [desc(products.createdAt)];
  if (sortOrder === 'price_low') orderBy = [asc(products.price)];
  if (sortOrder === 'price_high') orderBy = [desc(products.price)];
  if (sortOrder === 'rating') orderBy = [desc(products.rating)];

  const allProducts = await db.query.products.findMany({
    where: conditions.length > 0 ? (conditions.length > 1 ? undefined : conditions[0]) : undefined,
    orderBy: orderBy
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {heroBanners.length > 0 && (
        <section className="relative h-[350px] md:h-[450px] w-full bg-blue-900 overflow-hidden">
          <img src={heroBanners[0].imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase">{heroBanners[0].title}</h1>
            <p className="text-lg opacity-90 mb-8 max-w-xl">{heroBanners[0].subtitle}</p>
            <Link href={heroBanners[0].buttonUrl || '/'} className="bg-orange-600 px-10 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
              {heroBanners[0].buttonText}
            </Link>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-10">
        {/* Use the new Client Component for Filters */}
        <HomeFilters categories={activeCats} />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-10">
          {allProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {allProducts.length === 0 && (
          <div className="py-20 text-center text-gray-500 font-bold">No products found for this search.</div>
        )}
      </div>
    </main>
  );
}
