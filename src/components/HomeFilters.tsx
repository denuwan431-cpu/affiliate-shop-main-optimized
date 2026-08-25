"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListFilter, LayoutGrid, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomeFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCat = searchParams.get('category') || 'all';
  const sortOrder = searchParams.get('sort') || 'newest';

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('sort', value); else params.delete('sort');
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-12 mb-20">
      {/* Premium Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-slate-100 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-600">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-[11px] font-[1000] uppercase tracking-[0.3em]">Handpicked Selection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none">
            Featured Deals
          </h2>
        </div>

        {/* Ultra-Clean Sort Menu */}
        <div className="relative group">
          <div className="flex items-center gap-4 bg-white border-2 border-slate-900 px-6 py-4 rounded-[20px] shadow-[6px_6px_0px_#0f172a] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
            <ListFilter size={20} className="text-orange-600" />
            <div className="flex flex-col min-w-[180px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Sort By</span>
              <select 
                onChange={(e) => updateSort(e.target.value)}
                value={sortOrder}
                className="bg-transparent border-none outline-none text-[15px] font-[1000] text-slate-900 cursor-pointer uppercase tracking-tight appearance-none w-full"
              >
                <option value="newest">Latest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated Deals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Pill-Style Category Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-2">
        <Link 
          href="/" 
          className={`group flex items-center gap-2 px-10 py-5 rounded-full text-[12px] font-[1000] uppercase tracking-[0.15em] border-2 transition-all whitespace-nowrap ${selectedCat === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500 hover:text-slate-900'}`}
        >
          <LayoutGrid size={16} className={`${selectedCat === 'all' ? 'text-orange-500' : 'text-slate-300'}`} />
          All Products
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/?category=${cat.slug}`} 
            className={`px-10 py-5 rounded-full text-[12px] font-[1000] uppercase tracking-[0.15em] border-2 whitespace-nowrap transition-all ${selectedCat === cat.slug ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-900/20 scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500 hover:text-slate-900'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
