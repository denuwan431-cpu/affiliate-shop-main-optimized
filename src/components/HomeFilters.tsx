"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ListFilter } from 'lucide-react';
import Link from 'next/link';

export default function HomeFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCat = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const sortOrder = searchParams.get('sort') || 'newest';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
        {/* Professional Search Input */}
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            onChange={(e) => updateFilters('q', e.target.value)} 
            defaultValue={searchQuery} 
            placeholder="Search products..." 
            className="w-full pl-16 pr-8 py-5 rounded-[24px] bg-white border border-slate-100 shadow-sm outline-none font-bold text-slate-800 placeholder:text-slate-300 transition-all focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5" 
          />
        </div>

        {/* Clean & Professional Sorting Dropdown */}
        <div className="flex items-center gap-3 w-full lg:w-auto bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm pr-6">
          <div className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 ml-1">
            <ListFilter size={18} />
          </div>
          <select 
            onChange={(e) => updateFilters('sort', e.target.value)}
            value={sortOrder}
            className="flex-1 lg:w-64 bg-transparent border-none outline-none text-[13px] font-black text-slate-800 cursor-pointer py-2 uppercase tracking-widest"
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated Deals</option>
          </select>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
        <Link 
          href="/" 
          className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.1em] border transition-all ${selectedCat === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-200'}`}
        >
          All Deals
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/?category=${cat.slug}`} 
            className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.1em] border whitespace-nowrap transition-all ${selectedCat === cat.slug ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-900/10' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-200'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
