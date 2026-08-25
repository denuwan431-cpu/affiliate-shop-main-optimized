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
    <div className="mb-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase italic">Featured <span className="text-orange-600">Deals</span></h2>
          <div className="h-1.5 w-16 bg-orange-600 mt-2 rounded-full" />
        </div>

        <div className="relative" ref={dropRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="w-full md:w-64 flex items-center justify-between bg-white border border-slate-200 px-6 py-3.5 rounded-2xl shadow-sm hover:border-orange-500 transition-all">
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Sort Results</span>
              <span className="text-sm font-bold text-slate-800">{options.find(o => o.v === sortOrder)?.l}</span>
            </div>
            <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute top-[110%] right-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-2">
              {options.map(o => (
                <button key={o.v} onClick={() => updateSort(o.v)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider ${sortOrder === o.v ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {o.l} {sortOrder === o.v && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Link href="/" className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCat === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-200 hover:border-orange-500'}`}><LayoutGrid size={14} /> All Deals</Link>
        {categories.map(c => (
          <Link key={c.id} href={`/?category=${c.slug}`} className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${selectedCat === c.slug ? 'bg-orange-600 text-white border-orange-600 shadow-xl' : 'bg-white text-slate-500 border-slate-200 hover:border-orange-500 hover:text-orange-600'}`}>{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
