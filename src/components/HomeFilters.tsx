"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListFilter } from 'lucide-react';
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
    <div className="space-y-10 mb-16">
      {/* 1. Professional Sorting Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center border-b border-slate-100 pb-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Curated Deals</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Discover the best value for your money</p>
        </div>

        {/* Clean Sorting Dropdown */}
        <div className="flex items-center gap-3 w-full lg:w-auto bg-white p-2 rounded-[22px] border border-slate-100 shadow-sm pr-8 pl-2">
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-orange-600">
            <ListFilter size={18} />
          </div>
          <select 
            onChange={(e) => updateSort(e.target.value)}
            value={sortOrder}
            className="flex-1 lg:w-60 bg-transparent border-none outline-none text-[13px] font-black text-slate-900 cursor-pointer py-2 uppercase tracking-widest appearance-none"
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated Only</option>
          </select>
        </div>
      </div>

      {/* 2. Bold Category Navbar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
        <Link 
          href="/" 
          className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border transition-all ${selectedCat === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500/30 hover:text-slate-800'}`}
        >
          All Deals
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/?category=${cat.slug}`} 
            className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border whitespace-nowrap transition-all ${selectedCat === cat.slug ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-900/20 scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500/30 hover:text-slate-800'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
