"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Zap } from 'lucide-react';

export default function ProductCard({ product }: { product: any }) {
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const displayName = product.shortName || product.name;

  return (
    <div className="bg-white rounded-[35px] border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col h-full group overflow-hidden">
      <div className="relative aspect-square bg-[#f8f9fa] m-2 rounded-[30px] overflow-hidden">
        {product.discountPercent && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase">
            <Zap size={10} fill="currentColor" /> {product.discountPercent}% OFF
          </div>
        )}
        <Link href={`/product/${product.id}`}>
          <Image src={product.imageUrls[0]} alt={displayName} fill className="object-contain p-8 group-hover:scale-105 transition-transform duration-700" />
        </Link>
      </div>

      <div className="p-6 pt-2 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5 bg-orange-50 px-2 py-0.5 rounded-lg">
                <Star size={10} className="fill-orange-500 text-orange-500" />
                <span className="text-[10px] font-black text-orange-700">{product.rating || '5.0'}</span>
            </div>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Verified Deal</span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors uppercase tracking-tight">{displayName}</h3>
        </Link>
        <div className="mt-auto pt-6">
          <div className="flex flex-col mb-4 leading-none">
            <span className="text-2xl font-black text-slate-900">Rs. {price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && <span className="text-[11px] text-slate-400 line-through font-bold mt-1">Rs. {originalPrice.toLocaleString()}</span>}
          </div>
          <a href={product.affiliateUrl} target="_blank" className="w-full bg-slate-900 hover:bg-orange-600 text-white text-[10px] font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest">BUY NOW <ArrowRight size={14} /></a>
        </div>
      </div>
    </div>
  );
}
