"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowUpRight, Flame } from 'lucide-react';
import { logAffiliateClick } from '@/app/admin/actions';

export default function ProductCard({ product }: { product: any }) {
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const displayName = product.shortName || product.name;

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 hover:border-orange-200/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 flex flex-col h-full relative group">
      {/* Labels */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.discountPercent && (
          <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">-{product.discountPercent}%</div>
        )}
        {product.isHot && (
          <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"><Flame size={12} /> HOT</div>
        )}
      </div>

      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-50/30 m-3 rounded-[24px] overflow-hidden">
        <Image src={product.imageUrls[0]} alt={displayName} fill className="object-contain p-6 group-hover:scale-110 transition-transform duration-700" />
      </Link>

      <div className="p-6 pt-2 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-black text-gray-400">{product.rating || '5.0'}</span>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[15px] font-bold text-gray-800 line-clamp-2 h-11 leading-snug group-hover:text-orange-600 transition-colors">
            {displayName}
          </h3>
        </Link>

        <div className="mt-auto space-y-5">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900 tracking-tighter">Rs. {price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through font-medium">Rs. {originalPrice.toLocaleString()}</span>
            )}
          </div>

          <a
            href={product.affiliateUrl}
            target="_blank"
            onClick={() => logAffiliateClick(product.id)}
            className="w-full bg-gray-900 hover:bg-orange-600 text-white text-xs font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-widest shadow-xl shadow-gray-100 hover:shadow-orange-100"
          >
            View Deal <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
