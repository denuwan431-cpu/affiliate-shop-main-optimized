"use client";
import React, { useState, useEffect } from 'react';

export default function HeroSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const itv = setInterval(() => setCurrent(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(itv);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <section className="relative h-[400px] md:h-[550px] w-full bg-slate-100 overflow-hidden mb-12">
      {banners.map((b, i) => (
        <div 
          key={b.id} 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Banner Image */}
          <img src={b.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt={b.title || "Banner"} />
          
          {/* Overlay Gradient - පේන්නේ Text එකක් තිබුණොත් පමණයි */}
          {(b.title || b.subtitle) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          )}

          {/* Text Content - තිබුණොත් පමණක් පෙන්වයි */}
          {(b.title || b.subtitle) && (
            <div className="relative z-10 flex flex-col items-center justify-end h-full text-white text-center pb-20 px-6 max-w-5xl mx-auto">
              {b.title && (
                <h1 className="text-3xl md:text-6xl font-black mb-4 uppercase tracking-tighter drop-shadow-lg">
                  {b.title}
                </h1>
              )}
              {b.subtitle && (
                <p className="text-sm md:text-xl opacity-90 font-medium max-w-2xl drop-shadow-md">
                  {b.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? 'bg-orange-500 w-8' : 'bg-white/50 w-2'
              }`} 
            />
          ))}
        </div>
      )}
    </section>
  );
}
