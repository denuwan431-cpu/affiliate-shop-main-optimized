"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Flame } from 'lucide-react';
import { logAffiliateClick } from '@/app/admin/actions';

export default function ProductCard({ product }: { product: any }) {
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const displayName = product.shortName || product.name;

  return (
    <div className="bg-white rounded-[35px] border border-slate-100 hover:border-orange-500/20 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col h-full relative group overflow-hidden">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.discountPercent && (
          <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">-{product.discountPercent}%</div>
        )}
      </div>

      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-slate-50/50 m-2 rounded-[30px] overflow-hidden">
        <Image src={product.imageUrls[0]} alt={displayName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
      </Link>

      <div className="p-6 pt-3 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="fill-orange-500 text-orange-500" />
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{product.rating || '5.0'} Rating</span>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[16px] font-black text-slate-800 line-clamp-2 h-12 leading-tight tracking-tight group-hover:text-orange-600 transition-colors uppercase">
            {displayName}
          </h3>
        </Link>

        <div className="mt-auto space-y-6">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">Rs. {price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-[11px] text-slate-400 line-through font-bold">Rs. {originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* VIEW DEAL Button as requested */}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logAffiliateClick(product.id)}
            className="w-full bg-slate-900 hover:bg-orange-600 text-white text-[11px] font-black py-4.5 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-[0.15em] shadow-xl"
          >
            VIEW DEAL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
