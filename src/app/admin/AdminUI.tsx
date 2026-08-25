'use client';

import React, { useState } from 'react';
import { Package, Tag, Image as ImageIcon, LogOut, LayoutDashboard, Plus, Trash2, Settings, Users, BarChart3, Star, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, addCategory, deleteCategory, addBanner, deleteBanner, updateSetting, logout, clearAnalytics, deleteUser, clearAllUsers } from './actions';
import { useRouter } from 'next/navigation';

export default function AdminUI({ products, categories, banners, initialSettings, clickStats, users }: { products: any[], categories: any[], banners: any[], initialSettings: any, clickStats: any[], users: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [siteSettings, setSiteSettings] = useState(initialSettings || {});
  const [isProcessing, setIsProcessing] = useState(false);
  const [catName, setCatName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (catName.trim()) { setIsProcessing(true); await addCategory({ name: catName }); setCatName(''); window.location.reload(); }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bannerUrl.trim()) { setIsProcessing(true); await addBanner({ imageUrl: bannerUrl, title: bannerTitle }); setBannerUrl(''); window.location.reload(); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {isProcessing && <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center text-white font-bold">Processing...</div>}
      
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shrink-0 flex flex-col">
        <div className="text-xl font-black mb-10 text-orange-500">ADMIN DASHBOARD</div>
        <nav className="space-y-1 flex-1">
          {[
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'categories', icon: Tag, label: 'Categories' },
            { id: 'banners', icon: ImageIcon, label: 'Banners' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-orange-500' : 'hover:bg-gray-800 text-gray-400'}`}>
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={async () => { await logout(); router.push('/'); }} className="mt-auto flex items-center gap-3 p-4 text-gray-400 hover:text-red-400"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <h1 className="text-3xl font-bold mb-10 capitalize">{activeTab}</h1>

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <span className="font-bold">Items: {products.length}</span>
               <Link href="/admin/products/new" className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold">+ New Product</Link>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3"><img src={p.imageUrls[0]} className="w-10 h-10 object-cover rounded-lg" /><span className="font-bold line-clamp-1">{p.name}</span></td>
                    <td className="p-4 text-orange-600 font-bold text-sm">Rs.{parseFloat(p.price).toLocaleString()}</td>
                    <td className="p-4 text-right"><button onClick={async () => { if(confirm('Delete?')){ setIsProcessing(true); await deleteProduct(p.id); window.location.reload(); }}} className="text-red-500"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="bg-blue-600 p-8 rounded-3xl shadow-lg flex flex-col items-center">
                <MousePointer2 size={32} className="mb-2" />
                <span className="text-4xl font-black">{clickStats.length}</span>
                <span className="opacity-80 font-bold uppercase text-[10px]">Total Clicks</span>
              </div>
              <div className="bg-orange-600 p-8 rounded-3xl shadow-lg flex flex-col items-center">
                <BarChart3 size={32} className="mb-2" />
                <span className="text-4xl font-black">{products.length}</span>
                <span className="opacity-80 font-bold uppercase text-[10px]">Active Products</span>
              </div>
            </div>
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
               <h3 className="font-bold mb-4 flex justify-between items-center">Recent Click History <button onClick={() => clearAnalytics('all')} className="text-red-500 text-xs hover:underline">Clear Analytics</button></h3>
               <div className="space-y-3">
                  {clickStats.slice(0, 10).map((c: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm font-medium">
                      <span>{c.product?.name}</span>
                      <span className="text-gray-400 text-xs">{new Date(c.clickedAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border overflow-hidden">
            <div className="p-4 border-b flex justify-between bg-red-50">
               <span className="font-bold text-red-700 uppercase text-xs tracking-widest flex items-center gap-2">Danger Zone</span>
               <button onClick={() => clearAllUsers()} className="bg-red-600 text-white px-4 py-1 rounded-lg text-[10px] font-bold">CLEAR ALL USERS</button>
            </div>
            <div className="divide-y">
              {users?.map((u: any) => (
                <div key={u.id} className="p-4 flex justify-between items-center">
                   <div><div className="font-bold">{u.name}</div><div className="text-xs text-gray-400">{u.email}</div></div>
                   <button onClick={() => deleteUser(u.id)} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Categories & Banners UI ලැයිස්තුව එලෙසම තබන්න */}
      </main>
    </div>
  );
}
