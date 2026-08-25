"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListFilter, LayoutGrid, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';

export default function HomeFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  
  const selectedCat = searchParams.get('category') || 'all';
  const sortOrder = searchParams.get('sort') || 'newest';

  const options = [
    { v: 'newest', l: 'Latest Arrivals' },
    { v: 'price_low', l: 'Price: Low to High' },
    { v: 'price_high', l: 'Price: High to Low' },
    { v: 'rating', l: 'Top Rated Deals' }
  ];

  const updateSort = (v: string) => {
    const p = new URLSearchParams(searchParams.toString());
    v === 'newest' ? p.delete('sort') : p.set('sort', v);
    router.push(`/?${p.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Featured <span className="text-orange-600">Deals</span>
          </h2>
          <div className="h-1 w-20 bg-orange-500 mt-2 rounded-full"></div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={dropRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center gap-4 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:border-orange-500 transition-all min-w-[240px]"
          >
            <ListFilter size={18} className="text-slate-500" />
            <div className="flex flex-col items-start flex-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 leading-none mb-1">Sort By</span>
              <span className="text-sm font-bold text-slate-800 tracking-tight">
                {options.find(o => o.v === sortOrder)?.l}
              </span>
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-[110%] right-0 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-[100] p-2 animate-in fade-in slide-in-from-top-2">
              {options.map(o => (
                <button 
                  key={o.v} 
                  onClick={() => updateSort(o.v)} 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm ${
                    sortOrder === o.v ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {o.l} {sortOrder === o.v && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Link 
          href="/" 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
            selectedCat === 'all' 
            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
            : 'bg-white text-slate-500 border-slate-200 hover:border-orange-500 hover:text-orange-600'
          }`}
        >
          <LayoutGrid size={14} />
          All Deals
        </Link>
        {categories.map(c => (
          <Link 
            key={c.id} 
            href={`/?category=${c.slug}`} 
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
              selectedCat === c.slug 
              ? 'bg-orange-600 text-white border-orange-600 shadow-md' 
              : 'bg-white text-slate-500 border-slate-200 hover:border-orange-500 hover:text-orange-600'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
