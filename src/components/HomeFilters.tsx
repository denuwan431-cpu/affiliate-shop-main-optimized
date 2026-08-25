"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ListFilter, LayoutGrid } from 'lucide-react';
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
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
          <input 
            onChange={(e) => updateFilters('q', e.target.value)}
            defaultValue={searchQuery}
            placeholder="Search deals..." 
            className="w-full pl-16 pr-8 py-5 rounded-[30px] bg-white border border-slate-100 shadow-sm outline-none font-black text-slate-800 placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20"
          />
        </div>

        {/* BOLD Text Sorting Menu */}
        <div className="flex items-center gap-3 w-full lg:w-auto bg-white p-2 rounded-[30px] border border-slate-100 shadow-sm pr-6">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-orange-600 ml-1">
             <ListFilter size={20} />
          </div>
          <select 
            onChange={(e) => updateFilters('sort', e.target.value)}
            value={sortOrder}
            className="flex-1 lg:w-64 bg-transparent border-none outline-none text-sm font-black text-slate-800 cursor-pointer py-2 uppercase tracking-tighter"
          >
            <option value="newest" className="font-black text-slate-900">🔥 LATEST ARRIVALS</option>
            <option value="price_low" className="font-black text-slate-900">💰 PRICE: LOW TO HIGH</option>
            <option value="price_high" className="font-black text-slate-900">💸 PRICE: HIGH TO LOW</option>
            <option value="rating" className="font-black text-slate-900">⭐ TOP RATED DEALS</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        <Link href="/" className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${selectedCat === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-200'}`}>All</Link>
        {categories.map(cat => (
          <Link key={cat.id} href={`/?category=${cat.slug}`} className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest border whitespace-nowrap transition-all ${selectedCat === cat.slug ? 'bg-orange-600 text-white border-orange-600 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-200'}`}>{cat.name}</Link>
        ))}
      </div>
    </div>
  );
}
