{/* Price Section */}
<div className="mt-4 flex flex-wrap items-baseline gap-2">
  <span className="text-2xl font-black text-slate-900">
    Rs. {Number(product.price).toLocaleString()}
  </span>
  
  {product.originalPrice && (
    <span className="text-sm text-slate-400 line-through decoration-red-400/50">
      Rs. {Number(product.originalPrice).toLocaleString()}
    </span>
  )}
</div>

{/* Discount Tag */}
{product.discountLabel && (
  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow-lg z-20">
    {product.discountLabel}
  </div>
)}
