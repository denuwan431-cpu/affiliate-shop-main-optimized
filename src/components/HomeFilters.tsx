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
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            onChange={(e) => updateFilters('q', e.target.value)}
            defaultValue={searchQuery}
            placeholder="Search deals..." 
            className="w-full pl-14 pr-6 py-4 rounded-[22px] bg-white border border-gray-100 shadow-sm outline-none font-bold"
          />
        </div>

        {/* BOLD Text Sorting Menu */}
        <div className="flex items-center gap-3 w-full lg:w-auto bg-white p-2 rounded-[22px] border border-gray-100 shadow-sm">
          <ListFilter size={18} className="text-orange-500 ml-3" />
          <select 
            onChange={(e) => updateFilters('sort', e.target.value)}
            value={sortOrder}
            className="flex-1 lg:w-56 bg-transparent border-none outline-none text-sm font-black text-gray-900 cursor-pointer py-2 pr-4 uppercase tracking-tighter"
          >
            <option value="newest" className="font-black text-gray-900">🔥 Latest Arrivals</option>
            <option value="price_low" className="font-black text-gray-900">💰 Price: Low to High</option>
            <option value="price_high" className="font-black text-gray-900">💸 Price: High to Low</option>
            <option value="rating" className="font-black text-gray-900">⭐ Top Rated Deals</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Link href="/" className={`px-7 py-3 rounded-full text-xs font-black uppercase border ${selectedCat === 'all' ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>All</Link>
        {categories.map(cat => (
          <Link key={cat.id} href={`/?category=${cat.slug}`} className={`px-7 py-3 rounded-full text-xs font-black uppercase border whitespace-nowrap ${selectedCat === cat.slug ? 'bg-orange-600 text-white' : 'bg-white text-gray-500'}`}>{cat.name}</Link>
        ))}
      </div>
    </div>
  );
}
