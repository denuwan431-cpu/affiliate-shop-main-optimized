'use client';

import React, { useState } from 'react';
import { addProduct, updateProduct } from './actions';
import { useRouter } from 'next/navigation';

export default function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    shortName: initialData?.shortName || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    discountPercent: initialData?.discountPercent || 0,
    imageUrls: initialData?.imageUrls?.join(', ') || '',
    categoryId: initialData?.categoryId || categories[0]?.id,
    brand: initialData?.brand || '',
    affiliateUrl: initialData?.affiliateUrl || '',
    isFeatured: initialData?.isFeatured || false,
    isHot: initialData?.isHot || false,
    rating: initialData?.rating || '5.0',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      imageUrls: formData.imageUrls.split(',').map((url: string) => url.trim()),
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      discountPercent: parseInt(formData.discountPercent.toString()),
      categoryId: parseInt(formData.categoryId.toString()),
    };

    if (initialData) await updateProduct(initialData.id, data);
    else await addProduct(data);
    
    router.push('/admin');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-black text-slate-800">{initialData ? 'Update Product' : 'Add New Product'}</h2>
      
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Product Name</label>
        <input required className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-none font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Short Name (For Card Display)</label>
        <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-none font-bold" value={formData.shortName} onChange={(e) => setFormData({...formData, shortName: e.target.value})} placeholder="e.g. iPhone 15 Pro" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Price (Rs.)</label>
          <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Discount %</label>
          <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})} />
        </div>
      </div>

      <div className="flex gap-6 p-4 bg-slate-50 rounded-2xl">
         <label className="flex items-center gap-2 font-bold text-xs uppercase cursor-pointer"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 accent-orange-600" /> Featured</label>
         <label className="flex items-center gap-2 font-bold text-xs uppercase cursor-pointer"><input type="checkbox" checked={formData.isHot} onChange={(e) => setFormData({...formData, isHot: e.target.checked})} className="w-4 h-4 accent-orange-600" /> Hot Deal</label>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
        <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-none font-bold" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Affiliate Link</label>
        <input required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={formData.affiliateUrl} onChange={(e) => setFormData({...formData, affiliateUrl: e.target.value})} />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Image URL (Direct Link)</label>
        <textarea required className="w-full p-4 bg-slate-50 rounded-2xl outline-none h-24 font-bold" value={formData.imageUrls} onChange={(e) => setFormData({...formData, imageUrls: e.target.value})} />
      </div>

      <button type="submit" className="w-full bg-slate-900 hover:bg-orange-600 text-white py-5 rounded-[24px] font-[1000] uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]">
        {initialData ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
      </button>
    </form>
  );
}
