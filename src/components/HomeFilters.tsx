"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListFilter, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function HomeFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCat = searchParams.get('category') || 'all';
  const sortOrder = searchParams.get('sort') || 'newest';

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('sort', value); else params.delete('sort');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-16 mb-24">
      {/* Premium Bold Header & Sorting */}
      <div className="flex flex-col lg:flex-row gap-10 justify-between items-end border-b-4 border-slate-900 pb-12">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4 text-orange-600">
             <div className="w-12 h-1.5 bg-orange-600 rounded-full"></div>
             <span className="text-[12px] font-[1000] uppercase tracking-[0.4em]">Premium Selection</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-[1000] text-slate-900 tracking-[-0.05em] uppercase italic leading-none">
            Curated Deals
          </h2>
        </div>

        {/* BOLD Dropdown Menu */}
        <div className="flex items-center gap-5 bg-slate-900 p-3 rounded-[35px] shadow-[15px_15px_60px_-15px_rgba(0,0,0,0.3)] pr-12 pl-5 transition-transform hover:-translate-y-2 border-none">
          <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-900/20">
            <ListFilter size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 ml-1">Sort Results</span>
            <select 
              onChange={(e) => updateSort(e.target.value)}
              value={sortOrder}
              className="bg-transparent border-none outline-none text-[18px] font-[1000] text-white cursor-pointer uppercase tracking-tighter appearance-none min-w-[220px]"
            >
              <option value="newest" className="bg-slate-900 text-white font-black">Latest Arrivals</option>
              <option value="price_low" className="bg-slate-900 text-white font-black">Price: Low to High</option>
              <option value="price_high" className="bg-slate-900 text-white font-black">Price: High to Low</option>
              <option value="rating" className="bg-slate-900 text-white font-black">Top Rated Selection</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bold Category Navbar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
        <Link 
          href="/" 
          className={`px-14 py-6 rounded-full text-[13px] font-[1000] uppercase tracking-[0.25em] border-4 transition-all whitespace-nowrap ${selectedCat === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-110' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500 hover:text-slate-900 hover:scale-105'}`}
        >
          All Categories
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/?category=${cat.slug}`} 
            className={`px-14 py-6 rounded-full text-[13px] font-[1000] uppercase tracking-[0.25em] border-4 whitespace-nowrap transition-all ${selectedCat === cat.slug ? 'bg-orange-600 text-white border-orange-600 shadow-[0_20px_50px_rgba(234,88,12,0.3)] scale-110' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500 hover:text-slate-900 hover:scale-105'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
