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
    <div className="space-y-12 mb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-slate-100 pb-10">
        <h2 className="text-5xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none">Featured Deals</h2>
        <div className="relative" ref={dropRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-6 bg-white border-2 border-slate-900 px-8 py-5 rounded-[24px] shadow-[8px_8px_0px_#0f172a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none min-w-[320px]">
            <ListFilter size={20} className="text-orange-600" />
            <div className="flex flex-col items-start flex-1">
              <span className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Sort Results</span>
              <span className="text-[16px] font-[1000] text-slate-900 uppercase tracking-tight">{options.find(o => o.v === sortOrder)?.l}</span>
            </div>
            <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute top-[115%] right-0 w-full bg-white border-2 border-slate-900 rounded-[28px] shadow-2xl z-[100] p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
              {options.map(o => (
                <button key={o.v} onClick={() => updateSort(o.v)} className={`w-full flex items-center justify-between px-6 py-5 rounded-[20px] font-[1000] text-[13px] uppercase tracking-[0.1em] ${sortOrder === o.v ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'}`}>
                  {o.l} {sortOrder === o.v && <Check size={18} className="text-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-2">
        <Link href="/" className={`group flex items-center gap-2 px-12 py-5 rounded-full text-[12px] font-[1000] uppercase tracking-[0.2em] border-2 transition-all whitespace-nowrap ${selectedCat === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-110' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500 hover:text-slate-900'}`}>
          <LayoutGrid size={16} className={`${selectedCat === 'all' ? 'text-orange-500' : 'text-slate-300'}`} />
          All deals
        </Link>
        {categories.map(c => (
          <Link key={c.id} href={`/?category=${c.slug}`} className={`px-12 py-5 rounded-full text-[12px] font-[1000] uppercase tracking-[0.2em] border-2 whitespace-nowrap transition-all ${selectedCat === c.slug ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-900/20 scale-110' : 'bg-white text-slate-400 border-slate-100 hover:border-orange-500 hover:text-slate-900'}`}>{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
