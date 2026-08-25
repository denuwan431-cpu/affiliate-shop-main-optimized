import { db } from "@/db";
import { products, categories, banners } from "@/db/schema";
import { eq, asc, desc, ilike, or } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import HomeFilters from "@/components/HomeFilters";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: any) {
  const p = await searchParams;
  const cat = p.category || 'all';
  const q = p.q || '';
  const sort = p.sort || 'newest';

  const [heroBanners, activeCats] = await Promise.all([
    db.query.banners.findMany({ where: eq(banners.isEnabled, true), orderBy: [asc(banners.order)] }),
    db.query.categories.findMany({ where: eq(categories.isEnabled, true), orderBy: [asc(categories.order)] })
  ]);

  let cond: any[] = [];
  if (cat !== 'all') {
    const c = activeCats.find(x => x.slug === cat);
    if (c) cond.push(eq(products.categoryId, c.id));
  }
  if (q) cond.push(or(ilike(products.name, `%${q}%`), ilike(products.shortName, `%${q}%`)));

  let order: any = [desc(products.createdAt)];
  if (sort === 'price_low') order = [asc(products.price)];
  if (sort === 'price_high') order = [desc(products.price)];
  if (sort === 'rating') order = [desc(products.rating)];

  const all = await db.query.products.findMany({ where: cond.length ? (cond.length > 1 ? undefined : cond[0]) : undefined, orderBy: order });

  return (
    <main className="min-h-screen pb-20 overflow-hidden">
      <div className="animate-in fade-in duration-1000">
        <HeroSlider banners={heroBanners} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-both">
          <HomeFilters categories={activeCats} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            {all.map(x => <ProductCard key={x.id} product={x} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
