'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
}

// Categories now come from the server (fetched once, cached — see
// src/lib/data.ts + layout.tsx) instead of every page load doing its own
// client-side `fetch('/api/categories')` after mount.
export default function Header({ categories }: { categories: Category[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isItemsOpen, setIsItemsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load search history
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => setSuggestions(data))
          .catch(err => console.error(err));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = overrideQuery || searchQuery;
    if (finalQuery.trim()) {
      // Update history
      const newHistory = [finalQuery, ...history.filter(h => h !== finalQuery)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('search_history', JSON.stringify(newHistory));
      
      router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
      setShowDropdown(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 gap-4 border-b border-gray-50">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <Image src="/logo.png" alt="Affiliate Shop" width={40} height={40} priority className="h-10 w-auto object-contain group-hover:scale-105 transition duration-300" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-orange-600 tracking-tighter uppercase">Affiliate</span>
                <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Shop.lk</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 ml-4">
              <Link href="/" className="font-bold text-gray-700 hover:text-orange-500 transition">
                Home
              </Link>
              
              <div className="relative group">
                <button 
                  onMouseEnter={() => setIsItemsOpen(true)}
                  className="flex items-center gap-1 font-bold text-gray-700 hover:text-orange-500 transition py-2"
                >
                  Items <ChevronDown size={16} />
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  onMouseLeave={() => setIsItemsOpen(false)}
                  className={`absolute left-0 top-full w-64 bg-white border border-gray-100 shadow-2xl rounded-b-2xl py-3 transition-all duration-300 origin-top ${isItemsOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-5 py-3 text-[13px] font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all group/item"
                      onClick={() => setIsItemsOpen(false)}
                    >
                      {cat.name}
                      <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                    </Link>
                  ))}
                  {categories.length === 0 && (
                    <div className="px-4 py-2 text-xs text-gray-400">No categories found</div>
                  )}
                </div>
              </div>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-6 focus:ring-2 focus:ring-orange-500 outline-none transition"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-7 w-7 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition"
              >
                <Search size={14} />
              </button>
            </form>

            {/* Search Dropdown */}
            {showDropdown && (searchQuery.length > 0 || history.length > 0) && (
              <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]">
                {searchQuery.length > 0 ? (
                  <div>
                    {suggestions.length > 0 ? (
                      suggestions.map((s) => (
                        <Link
                          key={s.id}
                          href={`/product/${s.id}`}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Image src={s.imageUrls[0]} alt="" width={40} height={40} className="w-10 h-10 object-contain rounded" />
                          <div>
                            <div className="text-sm font-bold text-gray-800 line-clamp-1">{s.name}</div>
                            <div className="text-xs text-orange-600 font-bold">Rs. {parseFloat(s.price).toLocaleString()}</div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400 text-sm italic">No products found</div>
                    )}
                  </div>
                ) : (
                  history.length > 0 && (
                    <div className="p-2">
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Searches</div>
                        <button 
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setHistory([]);
                            localStorage.removeItem('search_history');
                          }}
                          className="text-[10px] text-orange-500 font-bold hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                      {history.map((h, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSearch(null as any, h);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition text-sm text-gray-600 font-medium text-left"
                        >
                          <Search size={14} className="text-gray-400" /> {h}
                        </button>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-gray-600">
            <button className="sm:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div className="sm:hidden pb-3 relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-5 pr-12 focus:ring-2 focus:ring-orange-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search" className="absolute right-1.5 top-1.5 h-9 w-9 bg-orange-500 text-white rounded-full flex items-center justify-center">
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-lg font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <div className="font-bold text-orange-500 pt-2 border-t">Categories</div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
