"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000); // තත්පර 6කට වරක් ස්වයංක්‍රීයව මාරු වේ
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <section className="relative h-[450px] md:h-[650px] w-full bg-slate-900 overflow-hidden mb-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
          }`}
        >
          {/* Banner Image */}
          <img src={banner.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 max-w-6xl mx-auto">
            <span className="bg-orange-600 text-white text-[10px] md:text-[12px] font-[1000] px-6 py-2 rounded-full uppercase tracking-[0.4em] mb-8 shadow-2xl animate-pulse">
              Official Selection
            </span>
            <h1 className="text-4xl md:text-8xl font-[1000] mb-6 uppercase tracking-tighter leading-[0.85] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] italic">
              {banner.title}
            </h1>
            <p className="text-lg md:text-2xl opacity-90 mb-12 max-w-3xl font-bold leading-relaxed tracking-tight text-slate-200">
              {banner.subtitle}
            </p>
            <Link 
              href={banner.buttonUrl || '/'} 
              className="bg-white text-black hover:bg-orange-600 hover:text-white px-16 py-6 rounded-full font-[1000] text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all hover:scale-110 active:scale-95 border-none"
            >
              {banner.buttonText || 'Discover More'}
            </Link>
          </div>
        </div>
      ))}

      {/* Manual Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft className="text-white" size={30} />
          </button>
          <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight className="text-white" size={30} />
          </button>
          
          {/* Slider Dots */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)} 
                className={`h-1.5 transition-all duration-500 rounded-full ${i === current ? 'bg-orange-600 w-16' : 'bg-white/20 w-8 hover:bg-white/40'}`} 
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
