"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { logAffiliateClick } from '@/app/admin/actions';

export default function ProductCard({ product }: { product: any }) {
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const displayName = product.shortName || product.name;

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 hover:border-orange-500/20 hover:shadow-[0_30px_70px_rgba(0,0,0,0.07)] transition-all duration-500 flex flex-col h-full relative group overflow-hidden">
      {/* Discount Badge */}
      <div className="absolute top-5 left-5 z-10">
        {product.discountPercent && (
          <div className="bg-red-600 text-white text-[10px] font-black px-3.5 py-2 rounded-2xl shadow-xl">-{product.discountPercent}%</div>
        )}
      </div>

      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-slate-50/50 m-2.5 rounded-[32px] overflow-hidden">
        <Image src={product.imageUrls[0]} alt={displayName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
      </Link>

      <div className="p-8 pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="fill-orange-500 text-orange-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.rating || '5.0'} User Rating</span>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[17px] font-black text-slate-800 line-clamp-2 h-12 leading-tight tracking-tight group-hover:text-orange-600 transition-colors uppercase">
            {displayName}
          </h3>
        </Link>

        <div className="mt-auto space-y-7">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Rs. {price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-[11px] text-slate-400 line-through font-bold mt-1.5 opacity-60">Rs. {originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* VIEW DEAL Button as requested */}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logAffiliateClick(product.id)}
            className="w-full bg-slate-900 hover:bg-orange-600 text-white text-[11px] font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:shadow-orange-200"
          >
            VIEW DEAL <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
