'use client';

import React, { useState } from 'react';
import { Package, Tag, Image as ImageIcon, LogOut, Plus, Trash2, Settings, Users, BarChart3, MousePointer2, Search, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, addCategory, deleteCategory, addBanner, deleteBanner, updateSetting, logout, clearAnalytics, deleteUser, clearAllUsers } from './actions';

export default function AdminUI({ products, categories, banners, initialSettings, clickStats, users }: { products: any[], categories: any[], banners: any[], initialSettings: any, clickStats: any[], users: any[] }) {
  const [activeTab, setActiveTab] = useState('products');
  const [isProcessing, setIsProcessing] = useState(false);
  const [siteSettings, setSiteSettings] = useState(initialSettings || {});
  
  // Banner Form States
  const [bTitle, setBTitle] = useState('');
  const [bSub, setBSub] = useState('');
  const [bImg, setBImg] = useState('');
  const [bBtn, setBBtn] = useState('Explore Deals');
  const [bUrl, setBUrl] = useState('/');

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await addBanner({ title: bTitle, subtitle: bSub, imageUrl: bImg, buttonText: bBtn, buttonUrl: bUrl });
    setIsProcessing(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shrink-0 flex flex-col">
        <div className="text-xl font-black mb-10 text-orange-500">ADMIN PANEL</div>
        <nav className="space-y-1 flex-1">
          {[{ id: 'products', icon: Package, label: 'Products' }, { id: 'categories', icon: Tag, label: 'Categories' }, { id: 'banners', icon: ImageIcon, label: 'Banners' }, { id: 'users', icon: Users, label: 'Users Admin' }, { id: 'analytics', icon: BarChart3, label: 'Analytics' }, { id: 'settings', icon: Settings, label: 'Settings' }].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-orange-600' : 'hover:bg-gray-800 text-gray-400'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={async () => { await logout(); window.location.href = '/'; }} className="mt-10 flex items-center gap-3 p-4 text-gray-500 hover:text-red-400"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <h1 className="text-3xl font-black mb-10 capitalize">{activeTab} Management</h1>

        {activeTab === 'banners' && (
          <div className="space-y-10">
            <form onSubmit={handleAddBanner} className="bg-white p-8 rounded-[32px] border shadow-sm space-y-4 max-w-2xl">
              <h3 className="font-bold text-gray-700">Add New Hero Banner</h3>
              <input value={bTitle} onChange={(e) => setBTitle(e.target.value)} placeholder="Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border" required />
              <input value={bSub} onChange={(e) => setBSub(e.target.value)} placeholder="Subtitle" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border" required />
              <input value={bImg} onChange={(e) => setBImg(e.target.value)} placeholder="Image URL (Link)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border" required />
              <div className="flex gap-4">
                <input value={bBtn} onChange={(e) => setBBtn(e.target.value)} placeholder="Button Text" className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none border" />
                <input value={bUrl} onChange={(e) => setBUrl(e.target.value)} placeholder="Button Link" className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none border" />
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black">PUBLISH BANNER</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map(b => (
                <div key={b.id} className="relative aspect-video rounded-[32px] overflow-hidden shadow-lg group">
                  <img src={b.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button onClick={async () => { await deleteBanner(b.id); window.location.reload(); }} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold">Delete Banner</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between bg-red-50">
              <span className="font-bold text-red-800">Total Registered Users: {users.length}</span>
              <button onClick={async () => confirm('Clear all?') && await clearAllUsers()} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black">CLEAR ALL USERS</button>
            </div>
            <div className="divide-y">
              {users.map(u => (
                <div key={u.id} className="p-5 flex justify-between items-center hover:bg-gray-50">
                  <div><div className="font-bold">{u.name || 'User'}</div><div className="text-xs text-gray-400">{u.email}</div></div>
                  <button onClick={async () => await deleteUser(u.id)} className="text-red-400"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-[32px] border shadow-sm space-y-6 max-w-xl">
            <h3 className="font-bold">Social Media & Contact</h3>
            {['facebook', 'instagram', 'tiktok', 'email'].map(k => (
              <div key={k} className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{k}</label>
                <input 
                  defaultValue={siteSettings[k]} 
                  onBlur={async (e) => await updateSetting(k, e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-orange-500" 
                  placeholder={`Enter ${k} URL...`} 
                />
              </div>
            ))}
            <p className="text-[10px] text-orange-600 font-bold italic">* Settings save automatically when you click outside the box.</p>
          </div>
        )}

        {/* ... (Categories, Products, Analytics UI ලැයිස්තුව එලෙසම තබන්න) */}
      </main>
    </div>
  );
}
