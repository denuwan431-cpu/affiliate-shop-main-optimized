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
        {/* Search Bar */}
        <div className="relative w-full lg:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input 
            onChange={(e) => updateFilters('q', e.target.value)}
            defaultValue={searchQuery}
            placeholder="Search for products, brands..." 
            className="w-full pl-14 pr-6 py-4 rounded-[22px] bg-white border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all text-sm font-medium"
          />
        </div>

        {/* Improved Sorting Menu */}
        <div className="flex items-center gap-3 w-full lg:w-auto bg-white p-1.5 rounded-[22px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 text-gray-400 border-r border-gray-50">
            <ListFilter size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sort By</span>
          </div>
          <select 
            onChange={(e) => updateFilters('sort', e.target.value)}
            value={sortOrder}
            className="flex-1 lg:w-48 bg-transparent border-none outline-none text-sm font-bold text-gray-700 cursor-pointer pr-4"
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Link 
          href="/" 
          className={`flex items-center gap-2 px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${selectedCat === 'all' ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200' : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200'}`}
        >
          <LayoutGrid size={14} /> All
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/?category=${cat.slug}`}
            className={`px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCat === cat.slug ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-100' : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
