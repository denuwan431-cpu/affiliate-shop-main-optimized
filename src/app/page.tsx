import { db } from "@/db";
import { products, categories, banners } from "@/db/schema";
import { eq, asc, desc, ilike, or } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

export default async function HomePage({ searchParams }: { searchParams: { category?: string, q?: string, sort?: string } }) {
  const selectedCat = searchParams.category || 'all';
  const searchQuery = searchParams.q || '';
  const sortOrder = searchParams.sort || 'newest';

  // 1. Fetch Dynamic Content from Database
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

  // 2. Build Product Filter Logic (Requirement 4)
  let whereConditions: any[] = [];
  
  // Category Filter
  if (selectedCat !== 'all') {
    const cat = activeCats.find(c => c.slug === selectedCat);
    if (cat) whereConditions.push(eq(products.categoryId, cat.id));
  }

  // Search Filter (Requirement 4)
  if (searchQuery) {
    whereConditions.push(
      or(
        ilike(products.name, `%${searchQuery}%`),
        ilike(products.shortName, `%${searchQuery}%`)
      )
    );
  }

  // 3. Sorting Logic (Requirement 4)
  let orderBy: any = [desc(products.createdAt)];
  if (sortOrder === 'price_low') orderBy = [asc(products.price)];
  if (sortOrder === 'price_high') orderBy = [desc(products.price)];
  if (sortOrder === 'rating') orderBy = [desc(products.rating)];

  const allProducts = await db.query.products.findMany({
    where: whereConditions.length > 0 ? (whereConditions.length > 1 ? undefined : whereConditions[0]) : undefined,
    orderBy: orderBy
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 5. Hero Banner Manager Section */}
      {heroBanners.length > 0 && (
        <section className="relative h-[400px] md:h-[500px] w-full bg-blue-900 overflow-hidden">
          <img 
            src={heroBanners[0].imageUrl} 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
            alt="Hero Banner" 
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <h1 className="text-3xl md:text-6xl font-black mb-4 uppercase tracking-tighter drop-shadow-2xl">
              {heroBanners[0].title}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl font-medium">
              {heroBanners[0].subtitle}
            </p>
            <Link 
              href={heroBanners[0].buttonUrl || '/'} 
              className="bg-orange-600 hover:bg-orange-700 px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              {heroBanners[0].buttonText}
            </Link>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-10">
        {/* 4. Search and Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <form action="/" className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input 
              name="q" 
              defaultValue={searchQuery}
              placeholder="Search trending deals..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter size={20} className="text-gray-400 hidden md:block" />
            <select 
              onChange={(e) => window.location.href = `/?sort=${e.target.value}${selectedCat !== 'all' ? `&category=${selectedCat}` : ''}`}
              value={sortOrder}
              className="w-full md:w-48 p-3 rounded-2xl bg-white border-none shadow-sm outline-none text-sm font-bold text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* 1. Dynamic Category Navigation */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          <Link 
            href="/" 
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border shadow-sm ${selectedCat === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'}`}
          >
            All Products
          </Link>
          {activeCats.map(cat => (
            <Link 
              key={cat.id} 
              href={`/?category=${cat.slug}`} 
              className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border shadow-sm ${selectedCat === cat.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* 3. Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-10">
          {allProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {allProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="text-gray-300 text-6xl">📦</div>
            <h3 className="text-xl font-bold text-gray-800">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            <Link href="/" className="text-blue-600 font-bold underline">Clear all filters</Link>
          </div>
        )}
      </div>
    </main>
  );
}
