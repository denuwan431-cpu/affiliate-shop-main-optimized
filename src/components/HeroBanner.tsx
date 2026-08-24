'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// framer-motion needs a component that forwards refs to animate — next/image
// supports that, so we wrap it once instead of using a raw <img>.
const MotionImage = motion(Image);

interface Slide {
  id: number;
  imageUrl: string;
  title?: string | null;
}

// Banners are fetched server-side (cached, see src/lib/data.ts) and passed
// in as `initialSlides` — no more client-side '/api/banners' fetch + the
// flash of the fallback slide while that request was in flight.
export default function HeroBanner({ initialSlides = [] }: { initialSlides?: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const slides = initialSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  
  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const displaySlides = slides.length > 0 ? slides : [
    { id: 0, imageUrl: '/banner.jpg', title: 'Welcome' }
  ];

  return (
    <div className="relative aspect-[21/9] md:aspect-[3/1] w-full overflow-hidden rounded-xl bg-gray-200 shadow-inner">
      <AnimatePresence mode="wait">
        <MotionImage
          key={current}
          src={displaySlides[current % displaySlides.length]?.imageUrl}
          alt={displaySlides[current % displaySlides.length]?.title || 'Banner'}
          fill
          sizes="100vw"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover"
          // This is the largest above-the-fold image (usually the LCP
          // element), so it loads eagerly and with high fetch priority
          // instead of being lazy-loaded like the rest of the page images.
          priority
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4">
        <button 
          onClick={prev} 
          className="p-1 md:p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
        </button>
        <button 
          onClick={next} 
          className="p-1 md:p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
        </button>
      </div>

      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${i === current ? 'bg-orange-500 w-4 md:w-6' : 'bg-white/60 hover:bg-white'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
