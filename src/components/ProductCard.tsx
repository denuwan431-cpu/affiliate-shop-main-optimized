"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ExternalLink, Flame } from 'lucide-react';
import { logAffiliateClick } from '@/app/admin/actions';

export default function ProductCard({ product }: { product: any }) {
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const displayName = product.shortName || product.name; // Use shortName if exists

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.discountPercent && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{product.discountPercent}% OFF</span>
        )}
        {product.isHot && (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><Flame size={10} /> HOT</span>
        )}
      </div>
      
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-white p-4 overflow-hidden">
        <Image src={product.imageUrls[0]} alt={displayName} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
      </Link>

      <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-transparent to-gray-50/30">
        <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 mb-2 h-9 leading-snug group-hover:text-blue-600 transition-colors">
          {displayName}
        </h3>
        
        <div className="mt-auto space-y-3">
          <div className="flex flex-col">
            <span className="text-lg font-black text-blue-600">Rs. {price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-[11px] text-gray-400 line-through">Rs. {originalPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded text-yellow-700 text-[10px] font-bold">
              <Star size={10} className="fill-yellow-500 text-yellow-500" />
              {product.rating || '0.0'}
            </div>
          </div>

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logAffiliateClick(product.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
          >
            View Deal <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
