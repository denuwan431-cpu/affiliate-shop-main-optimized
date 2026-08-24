import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string | number;
    originalPrice?: string | number | null;
    discountPercent?: number | null;
    imageUrls: string[];
    rating: string | number | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = product.originalPrice ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice) : null;

  return (
    <Link href={`/product/${product.id}`} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all duration-500 group overflow-hidden flex flex-col border border-gray-100/50">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={product.imageUrls[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 22vw, 15vw"
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {product.discountPercent && (
          <div className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-lg shadow-orange-200">
            -{product.discountPercent}% OFF
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-transparent to-gray-50/50">
        <h3 className="text-[13px] font-semibold text-gray-700 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors leading-snug h-9">
          {product.name}
        </h3>
        <div className="mt-auto space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-orange-600 font-black text-lg">
              Rs. {price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            {originalPrice && originalPrice > price ? (
              <span className="text-[11px] text-gray-400 line-through decoration-red-400/50">Rs. {originalPrice.toLocaleString()}</span>
            ) : <div />}
            <div className="flex items-center gap-1 text-[10px] bg-yellow-100/50 px-1.5 py-0.5 rounded-md">
              <Star size={10} className="fill-yellow-500 text-yellow-500" />
              <span className="text-yellow-700 font-bold">{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
