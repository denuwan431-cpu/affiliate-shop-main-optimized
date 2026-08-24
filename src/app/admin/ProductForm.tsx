'use client';

import React, { useState } from 'react';
import { addProduct, updateProduct } from './actions';
import { useRouter } from 'next/navigation';

export default function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    discountPercent: initialData?.discountPercent || 0,
    imageUrls: initialData?.imageUrls?.join(', ') || '',
    categoryId: initialData?.categoryId || categories[0]?.id,
    brand: initialData?.brand || '',
    affiliateUrl: initialData?.affiliateUrl || '',
    isFlashSale: initialData?.isFlashSale || false,
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

    if (initialData) {
      await updateProduct(initialData.id, data);
    } else {
      await addProduct(data);
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Product Name</label>
        <input
          required
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Current Price (Rs.)</label>
          <input
            required
            type="number"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Original Price (Slashed Rs.)</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.originalPrice}
            onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Discount Percentage (%)</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.discountPercent}
            onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Rating (0 - 5.0)</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Category</label>
        <select
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.categoryId}
          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Affiliate Link (Daraz Link)</label>
        <input
          required
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.affiliateUrl}
          onChange={(e) => setFormData({...formData, affiliateUrl: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Image URLs (separated by comma)</label>
        <textarea
          required
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 h-24"
          placeholder="/phone.jpg, https://example.com/img2.jpg"
          value={formData.imageUrls}
          onChange={(e) => setFormData({...formData, imageUrls: e.target.value})}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="flash-sale"
          checked={formData.isFlashSale}
          onChange={(e) => setFormData({...formData, isFlashSale: e.target.checked})}
          className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
        />
        <label htmlFor="flash-sale" className="text-sm font-bold text-gray-700 cursor-pointer">Mark as Flash Sale</label>
      </div>

      <div className="pt-4 flex gap-4">
        <button type="submit" className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
          {initialData ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
          Cancel
        </button>
      </div>
    </form>
  );
}
