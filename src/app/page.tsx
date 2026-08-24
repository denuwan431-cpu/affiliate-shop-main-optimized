import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import { getFlashSaleProducts, getCategories, getFeaturedProducts, getActiveBanners } from "@/lib/data";
import { ShoppingBag, Zap } from "lucide-react";

// ✅ Vercel build වෙලාවේ prerender කරලා DB query run වෙන්න නවත්තන්න.
// (query fresh-ම run කරන්නේ නෑ දැන් — src/lib/data.ts වල unstable_cache
// එකෙන් result cache වෙනවා, ඒක නිසා traffic වැඩි උනත් DB එකට hit වෙන්නේ
// revalidate window එකකට එකයි, request හැම එකකටම නෙවෙයි)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const [flashSaleProducts, categoryList, allProducts, bannerSlides] = await Promise.all([
    getFlashSaleProducts(),
    getCategories(),
    getFeaturedProducts(),
    getActiveBanners(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <HeroBanner initialSlides={bannerSlides} />

      {/* Flash Sale */}
      <section className="mt-16">
        <div className="bg-orange-600 rounded-3xl p-6 md:p-8 shadow-2xl shadow-orange-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <Zap className="text-orange-600 fill-orange-600 w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">
                  FEATURED DEALS
                </h2>
                <span className="text-orange-100 text-xs font-bold uppercase tracking-widest">
                  Selected offers • Check latest price on Daraz
                </span>
              </div>
            </div>
            <a
              href="/search?flash=1"
              className="bg-white/20 hover:bg-white text-white hover:text-orange-600 px-6 py-2.5 rounded-2xl font-black transition-all duration-300 text-sm backdrop-blur-md"
            >
              VIEW ALL DEALS
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid (Optional) */}
      <section className="mt-12 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          {categoryList.map((cat) => (
            <a key={cat.id} href={`/category/${cat.slug}`} className="group cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:bg-orange-100 transition">
                <ShoppingBag className="text-gray-400 group-hover:text-orange-500" />
              </div>
              <span className="text-sm text-gray-700">{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Just For You */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Just For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="/search"
            className="inline-block px-12 py-3 border-2 border-orange-500 text-orange-500 font-bold rounded hover:bg-orange-500 hover:text-white transition"
          >
            View All Products
          </a>
        </div>
      </section>
    </div>
  );
}