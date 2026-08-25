"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';

export default function HomeFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const selectedCat = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const sortOrder = searchParams.get('sort') || 'newest';

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q');
    router.push(`/?q=${q}${selectedCat !== 'all' ? `&category=${selectedCat}` : ''}&sort=${sortOrder}`);
  };

  const handleSort = (val: string) => {
    router.push(`/?sort=${val}${selectedCat !== 'all' ? `&category=${selectedCat}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input 
            name="q" 
            defaultValue={searchQuery}
            placeholder="Search deals..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={20} className="text-gray-400" />
          <select 
            onChange={(e) => handleSort(e.target.value)}
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

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        <Link 
          href="/" 
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border shadow-sm ${selectedCat === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-100'}`}
        >
          All
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/?category=${cat.slug}${searchQuery ? `&q=${searchQuery}` : ''}&sort=${sortOrder}`}
            className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border shadow-sm ${selectedCat === cat.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-100'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
