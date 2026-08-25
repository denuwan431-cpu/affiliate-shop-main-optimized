import { db } from "@/db";
import { products, categories, banners } from "@/db/schema";
import { eq, asc, desc, ilike, or } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import HomeFilters from "@/components/HomeFilters";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: any) {
  const params = await searchParams;
  const selectedCat = params.category || 'all';
  const searchQuery = params.q || '';
  const sortOrder = params.sort || 'newest';

  // Fetch all enabled banners for the slider
  const [heroBanners, activeCats] = await Promise.all([
    db.query.banners.findMany({ 
      where: eq(banners.isEnabled, true), 
      orderBy: [asc(banners.order)] 
    }),
    db.query.categories.findMany({ 
      where: eq(categories.isEnabled, true), 
      orderBy: [asc(categories.order)] 
    })
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
    <main className="min-h-screen bg-[#fafafa] pb-32">
      {/* Auto-sliding multiple banners */}
      <HeroSlider banners={heroBanners} />

      <div className="max-w-7xl mx-auto px-8">
        <HomeFilters categories={activeCats} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {allProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {allProducts.length === 0 && (
          <div className="py-40 text-center bg-white rounded-[60px] border-4 border-slate-900/5 shadow-inner mt-10">
            <h3 className="text-2xl font-[1000] text-slate-900 uppercase tracking-widest italic">No match found</h3>
            <p className="text-slate-400 font-bold mt-4">Try refining your search or category selection.</p>
          </div>
        )}
      </div>
    </main>
  );
}
