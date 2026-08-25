"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Zap } from 'lucide-react';
import { logAffiliateClick } from '@/app/admin/actions';

export default function ProductCard({ product }: { product: any }) {
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const displayName = product.shortName || product.name;

  return (
    <div className="bg-white rounded-[45px] border border-slate-100 hover:border-orange-500/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full relative group overflow-hidden">
      {product.discountPercent && (
        <div className="absolute top-6 left-6 z-10 bg-red-600 text-white text-[10px] font-[1000] px-4 py-2 rounded-[18px] shadow-2xl flex items-center gap-1 uppercase tracking-widest animate-pulse">
          <Zap size={10} /> {product.discountPercent}% OFF
        </div>
      )}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-[#fcfcfc] m-3 rounded-[38px] overflow-hidden">
        <Image src={product.imageUrls[0]} alt={displayName} fill className="object-contain p-10 group-hover:scale-110 transition-transform duration-1000" />
      </Link>
      <div className="p-8 pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                <Star size={10} className="fill-orange-500 text-orange-500" />
                <span className="text-[10px] font-[1000] text-orange-700">{product.rating || '5.0'}</span>
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Verified Deal</span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[17px] font-[1000] text-slate-800 line-clamp-2 h-12 leading-[1.2] tracking-tight group-hover:text-orange-600 transition-colors uppercase">{displayName}</h3>
        </Link>
        <div className="mt-auto pt-8 space-y-6">
          <div className="flex flex-col"><span className="text-3xl font-[1000] text-slate-900 tracking-tighter">Rs. {price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && <span className="text-[12px] text-slate-300 line-through font-bold mt-1 opacity-80 uppercase italic">Was Rs. {originalPrice.toLocaleString()}</span>}
          </div>
          <a href={product.affiliateUrl} target="_blank" onClick={() => logAffiliateClick(product.id)} className="w-full bg-slate-900 hover:bg-orange-600 text-white text-[11px] font-[1000] py-5 rounded-[22px] flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-2xl">CHECK DEAL <ArrowRight size={16} /></a>
        </div>
      </div>
    </div>
  );
}
