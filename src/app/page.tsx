import { db } from "@/db";
import { products, categories, banners } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function HomePage({ searchParams }: any) {
  const selectedCat = searchParams.category || 'all';

  const [heroBanners, activeCats, allProducts] = await Promise.all([
    db.query.banners.findMany({ where: eq(banners.isEnabled, true), orderBy: [asc(banners.order)] }),
    db.query.categories.findMany({ where: eq(categories.isEnabled, true), orderBy: [asc(categories.order)] }),
    db.query.products.findMany({ orderBy: [desc(products.createdAt)] })
  ]);

  const filteredProducts = selectedCat === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.categoryId === activeCats.find(c => c.slug === selectedCat)?.id);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      {heroBanners.length > 0 && (
        <section className="relative h-[350px] md:h-[450px] w-full bg-blue-900">
          <img src={heroBanners[0].imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase">{heroBanners[0].title}</h1>
            <p className="text-lg opacity-90 mb-6 max-w-xl">{heroBanners[0].subtitle}</p>
            <Link href={heroBanners[0].buttonUrl} className="bg-orange-500 hover:bg-orange-600 px-10 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
              {heroBanners[0].buttonText}
            </Link>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          <Link href="/" className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${selectedCat === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>All</Link>
          {activeCats.map(cat => (
            <Link key={cat.id} href={`/?category=${cat.slug}`} className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${selectedCat === cat.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-8">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </main>
  );
}
