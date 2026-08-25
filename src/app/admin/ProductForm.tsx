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
    isFlashSale: initialData?.isFlashSale || false,
    isHot: initialData?.isHot || false,
    isFeatured: initialData?.isFeatured || false,
    isNew: initialData?.isNew || false,
    rating: initialData?.rating || '4.5',
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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-black text-gray-800">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Original Full Name</label>
        <input required className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Short Display Name (Recommended)</label>
        <input className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500" value={formData.shortName} onChange={(e) => setFormData({...formData, shortName: e.target.value})} placeholder="e.g. iPhone 15 Pro Max" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Price (Rs.)</label>
          <input required type="number" className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Discount %</label>
          <input type="number" className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})} />
        </div>
      </div>

      <div className="space-y-2 text-sm font-bold text-gray-700 uppercase tracking-tighter">Product Status Tags</div>
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} /> Featured</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isHot} onChange={(e) => setFormData({...formData, isHot: e.target.checked})} /> 🔥 Hot Deal</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({...formData, isNew: e.target.checked})} /> New Arrival</label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Category</label>
        <select className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Affiliate / Daraz URL</label>
        <input required className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500" value={formData.affiliateUrl} onChange={(e) => setFormData({...formData, affiliateUrl: e.target.value})} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Image URLs (Comma separated)</label>
        <textarea required className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 h-24" value={formData.imageUrls} onChange={(e) => setFormData({...formData, imageUrls: e.target.value})} />
      </div>

      <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold shadow-xl transition hover:scale-[1.01]">Save Product</button>
    </form>
  );
}
