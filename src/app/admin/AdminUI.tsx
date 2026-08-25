'use client';
import React, { useState } from 'react';
import { Package, Tag, Image as ImageIcon, LogOut, Plus, Trash2, Settings, Users, BarChart3, MousePointer2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, upsertCategory, deleteCategory, upsertBanner, deleteBanner, updateSetting, logout, clearAnalytics, deleteUser, clearAllUsers } from './actions';

export default function AdminUI({ products, categories, banners, initialSettings, clickStats, users }: { products: any[], categories: any[], banners: any[], initialSettings: any, clickStats: any[], users: any[] }) {
  const [activeTab, setActiveTab] = useState('products');
  const [isProcessing, setIsProcessing] = useState(false);
  const [catName, setCatName] = useState('');
  const [bT, setBT] = useState('');
  const [bS, setBS] = useState('');
  const [bI, setBI] = useState('');

  const handleBannerSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bI) return alert("Image URL is required!");
    setIsProcessing(true);
    await upsertBanner({ title: bT || null, subtitle: bS || null, imageUrl: bI, isEnabled: true });
    setIsProcessing(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row">
      {isProcessing && <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center text-white font-black animate-pulse">SAVING...</div>}
      <aside className="w-full md:w-72 bg-[#0f172a] text-white p-8 flex flex-col">
        <h2 className="text-xl font-black mb-10 text-orange-500 uppercase tracking-tighter">Admin Dashboard</h2>
        <nav className="space-y-2 flex-1">
          {[{ id: 'products', icon: Package, label: 'Products' }, { id: 'categories', icon: Tag, label: 'Categories' }, { id: 'banners', icon: ImageIcon, label: 'Hero Banners' }, { id: 'analytics', icon: BarChart3, label: 'Analytics' }, { id: 'settings', icon: Settings, label: 'Settings' }].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={async () => { await logout(); window.location.href = '/'; }} className="mt-10 flex items-center gap-3 p-4 text-slate-500 hover:text-red-400 font-bold transition"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <h1 className="text-4xl font-black mb-10 capitalize text-slate-800 tracking-tight italic">{activeTab}</h1>

        {activeTab === 'banners' && (
          <div className="max-w-2xl space-y-8">
            <form onSubmit={handleBannerSave} className="bg-white p-8 rounded-[32px] border shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">New Hero Banner</h3>
              <input value={bT} onChange={e => setBT(e.target.value)} placeholder="Main Heading (Optional)" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input value={bS} onChange={e => setBS(e.target.value)} placeholder="Subtitle (Optional)" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input value={bI} onChange={e => setBI(e.target.value)} placeholder="Image Direct URL (Required)" className="w-full p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-xl outline-none font-bold text-sm" required />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl">PUBLISH BANNER</button>
            </form>
            <div className="grid grid-cols-1 gap-4">
              {banners.map(b => (
                <div key={b.id} className="relative aspect-[21/9] rounded-2xl overflow-hidden group shadow-lg">
                  <img src={b.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button onClick={async () => confirm('Delete?') && await deleteBanner(b.id)} className="bg-red-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase shadow-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories, Products sections go here similarly to your original file but with matching design... */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-[32px] shadow-sm border overflow-hidden">
             <div className="p-6 border-b flex justify-between items-center"><span className="text-xs font-black uppercase text-slate-400 tracking-widest">Inventory</span><Link href="/admin/products/new" className="bg-orange-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-lg">+ Add New</Link></div>
             <div className="divide-y divide-slate-100">
               {products.map(p => (
                 <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <img src={p.imageUrls[0]} className="w-12 h-12 rounded-xl object-contain border bg-white" />
                      <div><div className="text-sm font-bold text-slate-800">{p.shortName || p.name}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{p.category?.name}</div></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-black text-slate-900">Rs. {parseFloat(p.price).toLocaleString()}</div>
                      <button onClick={async () => confirm('Delete?') && await deleteProduct(p.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
