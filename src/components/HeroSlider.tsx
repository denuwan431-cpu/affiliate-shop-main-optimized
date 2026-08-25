"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const itv = setInterval(() => setCurrent(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(itv);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <section className="relative h-[480px] md:h-[650px] w-full bg-slate-950 overflow-hidden mb-16">
      {banners.map((b, i) => (
        <div key={b.id} className={`absolute inset-0 transition-all duration-1000 ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
          <img src={b.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 max-w-5xl mx-auto">
            <span className="bg-orange-600 text-white text-[11px] font-black px-6 py-2 rounded-full uppercase tracking-[0.4em] mb-8 shadow-2xl">Premium Deals</span>
            <h1 className="text-4xl md:text-8xl font-[1000] mb-8 uppercase tracking-tighter italic leading-[0.85]">{b.title}</h1>
            <p className="text-lg md:text-2xl opacity-80 mb-12 font-bold max-w-2xl">{b.subtitle}</p>
            <Link href={b.buttonUrl || '/'} className="bg-white text-black hover:bg-orange-600 hover:text-white px-16 py-6 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-110 active:scale-95 shadow-2xl">
              {b.buttonText || 'Discover More'}
            </Link>
          </div>
        </div>
      ))}
      {banners.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'bg-orange-600 w-16' : 'bg-white/20 w-8'}`} />
          ))}
        </div>
      )}
    </section>
  );
}
