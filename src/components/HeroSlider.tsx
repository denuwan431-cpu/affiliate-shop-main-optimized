"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative h-[480px] md:h-[650px] w-full bg-slate-950 overflow-hidden mb-16 group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
        >
          <img src={banner.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 max-w-5xl mx-auto">
            <span className="bg-orange-600 text-white text-[11px] font-[1000] px-6 py-2 rounded-full uppercase tracking-[0.4em] mb-8 shadow-2xl shadow-orange-900/40">Premium Offer</span>
            <h1 className="text-4xl md:text-8xl font-[1000] mb-8 uppercase tracking-tighter leading-[0.85] italic drop-shadow-2xl">
              {banner.title}
            </h1>
            <p className="text-lg md:text-2xl opacity-80 mb-12 max-w-2xl font-bold leading-relaxed text-slate-200">
              {banner.subtitle}
            </p>
            <Link 
              href={banner.buttonUrl || '/'} 
              className="bg-white text-black hover:bg-orange-600 hover:text-white px-16 py-6 rounded-full font-[1000] text-sm uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-110 active:scale-95"
            >
              {banner.buttonText || 'Discover More'}
            </Link>
          </div>
        </div>
      ))}

      {/* Progress Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'bg-orange-600 w-16' : 'bg-white/20 w-8 hover:bg-white/40'}`} />
          ))}
        </div>
      )}
    </section>
  );
}
