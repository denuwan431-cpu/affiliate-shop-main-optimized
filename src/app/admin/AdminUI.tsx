'use client';

import React, { useState } from 'react';
import { Package, Tag, Image as ImageIcon, LogOut, ChevronRight, LayoutDashboard, Plus, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, addCategory, deleteCategory, addBanner, deleteBanner, updateSetting, logout } from './actions';
import { useRouter } from 'next/navigation';

export default function AdminUI({ products, categories, banners, initialSettings, clickStats }: { products: any[], categories: any[], banners: any[], initialSettings: any, clickStats: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [siteSettings, setSiteSettings] = useState(initialSettings || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateSetting = async (key: string, value: string) => {
    setIsSaving(true);
    await updateSetting(key, value);
    setSiteSettings({ ...siteSettings, [key]: value });
    setIsSaving(false);
  };
  const [catName, setCatName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (catName.trim()) {
      setIsProcessing(true);
      await addCategory({ name: catName });
      setCatName('');
      window.location.reload();
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bannerUrl.trim()) {
      setIsProcessing(true);
      await addBanner({ imageUrl: bannerUrl, title: bannerTitle });
      setBannerUrl('');
      setBannerTitle('');
      window.location.reload();
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsProcessing(true);
      await deleteProduct(id);
      window.location.reload();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Delete this category? (Products in this category will become uncategorized)')) {
      setIsProcessing(true);
      await deleteCategory(id);
      window.location.reload();
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (confirm('Delete this banner?')) {
      setIsProcessing(true);
      await deleteBanner(id);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
            <div className="font-bold text-gray-900">Processing...</div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-black tracking-tighter">ADMIN PANEL</span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'products' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Package size={20} /> Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'categories' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Tag size={20} /> Categories
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'banners' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <ImageIcon size={20} /> Banners
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Settings size={20} /> Settings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <LayoutDashboard size={20} /> Analytics
          </button>
        </nav>

        <div className="mt-auto pt-10 border-t border-gray-800 mt-20 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition">
            <LayoutDashboard size={20} /> Back to Site
          </Link>
          <button 
            onClick={async () => {
              await logout();
              router.push('/');
              router.refresh();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold capitalize">{activeTab} Management</h1>
            {activeTab === 'products' && (
              <Link href="/admin/products/new" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition">
                <Plus size={20} /> Add New Product
              </Link>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.imageUrls[0]} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                          <div className="font-bold text-gray-900 group-hover:text-orange-500 transition line-clamp-1">{p.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.category?.name}</td>
                      <td className="px-6 py-4 font-black text-orange-500">Rs. {parseFloat(p.price).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/products/${p.id}/edit`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                               <Plus size={18} className="rotate-45" /> {/* Use as edit icon workaround */}
                            </Link>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8">
              <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4">
                <input
                  placeholder="New Category Name (e.g. Electronics)"
                  className="flex-1 px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                />
                <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100">
                  Add Category
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group">
                    <span className="font-bold text-gray-800">{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-8">
              <form onSubmit={handleAddBanner} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input
                    placeholder="Banner Image URL"
                    className="px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                  />
                  <input
                    placeholder="Banner Title (Optional)"
                    className="px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100">
                  Add Hero Banner
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((b) => (
                  <div key={b.id} className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border-4 border-white group">
                    <img src={b.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <button onClick={() => handleDeleteBanner(b.id)} className="bg-white text-red-600 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                        <Trash2 size={18} /> Delete Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">Social Media Links</h3>
                {isSaving && <span className="text-xs text-orange-500 animate-pulse">Saving...</span>}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Facebook URL</label>
                  <input
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={siteSettings.facebook || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, facebook: e.target.value })}
                    onBlur={(e) => handleUpdateSetting('facebook', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Instagram URL</label>
                  <input
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={siteSettings.instagram || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                    onBlur={(e) => handleUpdateSetting('instagram', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">YouTube URL</label>
                  <input
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={siteSettings.youtube || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, youtube: e.target.value })}
                    onBlur={(e) => handleUpdateSetting('youtube', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t">
                 <div className="text-xs text-gray-400">Settings are automatically saved when you click outside the input field.</div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Recent Affiliate Clicks</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Product</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Time</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Platform</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {clickStats.map((log) => (
                        <tr key={log.id} className="text-sm">
                          <td className="px-6 py-4 font-bold text-gray-800">{log.product?.name || 'Deleted Product'}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(log.clickedAt).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold truncate block max-w-[150px]">
                              {log.userAgent?.split(' ')[0] || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {clickStats.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">No clicks recorded yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
