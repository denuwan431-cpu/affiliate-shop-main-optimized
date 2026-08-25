'use client';

import React, { useState } from 'react';
import { 
  Package, Tag, Image as ImageIcon, LogOut, LayoutDashboard, 
  Plus, Trash2, Settings, Users, BarChart3, Star, MousePointer2 
} from 'lucide-react';
import Link from 'next/link';
import { 
  deleteProduct, addCategory, deleteCategory, addBanner, deleteBanner, 
  updateSetting, logout, clearAnalytics, deleteUser, clearAllUsers 
} from './actions';
import { useRouter } from 'next/navigation';

export default function AdminUI({ 
  products, categories, banners, initialSettings, clickStats, users 
}: { 
  products: any[], categories: any[], banners: any[], 
  initialSettings: any, clickStats: any[], users: any[] 
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [siteSettings, setSiteSettings] = useState(initialSettings || {});
  const [isProcessing, setIsProcessing] = useState(false);
  const [catName, setCatName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');

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
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-gray-900 font-bold">
            Processing...
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-black tracking-tighter uppercase">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'products' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Package size={20} /> Products</button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'categories' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Tag size={20} /> Categories</button>
          <button onClick={() => setActiveTab('banners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'banners' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><ImageIcon size={20} /> Banners</button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'users' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Users size={20} /> Users Admin</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><BarChart3 size={20} /> Analytics</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Settings size={20} /> Settings</button>
        </nav>

        <button onClick={async () => { await logout(); router.push('/'); }} className="mt-auto flex items-center gap-3 p-4 text-gray-400 hover:text-red-400"><LogOut size={20} /> Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-10 capitalize">{activeTab} Management</h1>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <span className="font-bold text-gray-500 text-sm">Total: {products.length}</span>
                <Link href="/admin/products/new" className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-100">+ Add Product</Link>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-4 flex items-center gap-4">
                        <img src={p.imageUrls[0]} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <span className="font-bold text-gray-800 line-clamp-1">{p.name}</span>
                      </td>
                      <td className="p-4 text-orange-600 font-black text-sm">Rs. {parseFloat(p.price).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Link href={`/admin/products/${p.id}/edit`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">Edit</Link>
                           <button onClick={async () => { if(confirm('Delete product?')){ await deleteProduct(p.id); window.location.reload(); }}} className="p-2 text-red-500"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl">
                  <MousePointer2 size={32} className="mb-2" />
                  <div className="text-4xl font-black">{clickStats.length}</div>
                  <div className="text-sm font-bold uppercase opacity-80">Total Affiliate Clicks</div>
                </div>
              </div>
              <div className="bg-white border rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold">Recent Click History</h3>
                  <button onClick={() => confirm('Clear all stats?') && clearAnalytics('all')} className="text-red-500 text-xs font-bold">Clear All</button>
                </div>
                <div className="divide-y">
                  {clickStats.slice(0, 10).map((c: any, i: number) => (
                    <div key={i} className="py-3 flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700">{c.product?.name || 'Deleted Product'}</span>
                      <span className="text-gray-400">{new Date(c.clickedAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b flex justify-between items-center bg-red-50/50">
                <h3 className="font-bold text-red-800 text-sm">Users Admin ({users?.length || 0})</h3>
                <button onClick={() => confirm('Delete ALL users?') && clearAllUsers()} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold">CLEAR ALL USERS</button>
              </div>
              <div className="divide-y divide-gray-100">
                {users?.map((u: any) => (
                  <div key={u.id} className="p-5 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <div className="font-bold text-gray-800">{u.name || 'User'}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </div>
                    <button onClick={() => confirm('Delete this user?') && deleteUser(u.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4">
                <input placeholder="New Category..." className="flex-1 px-5 py-3 bg-gray-50 rounded-2xl outline-none" value={catName} onChange={(e) => setCatName(e.target.value)} />
                <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold">Add</button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-3xl border flex justify-between items-center group">
                    <span className="font-bold">{c.name}</span>
                    <button onClick={() => confirm('Delete category?') && deleteCategory(c.id)} className="text-red-400"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
