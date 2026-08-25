'use client';

import React, { useState } from 'react';
import { Package, Tag, Image as ImageIcon, LogOut, Plus, Trash2, Settings, Users, BarChart3, MousePointer2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, upsertCategory, deleteCategory, upsertBanner, deleteBanner, updateSetting, logout, clearAnalytics, deleteUser, clearAllUsers } from './actions';

export default function AdminUI({ products, categories, banners, initialSettings, clickStats, users }: { products: any[], categories: any[], banners: any[], initialSettings: any, clickStats: any[], users: any[] }) {
  const [activeTab, setActiveTab] = useState('products');
  const [isProcessing, setIsProcessing] = useState(false);
  const [catName, setCatName] = useState('');
  
  // Banner states
  const [bT, setBT] = useState('');
  const [bS, setBS] = useState('');
  const [bI, setBI] = useState('');

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bI) {
      alert("Please provide an Image URL");
      return;
    }
    setIsProcessing(true);
    await upsertBanner({ 
      title: bT || null, 
      subtitle: bS || null, 
      imageUrl: bI, 
      isEnabled: true 
    });
    setBT(''); setBS(''); setBI('');
    setIsProcessing(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row">
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex flex-col items-center justify-center text-white font-black tracking-widest backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          PROCESSING...
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0f172a] text-white p-8 shrink-0 flex flex-col shadow-2xl relative z-20">
        <div className="mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">ADMIN<span className="text-orange-500">PANEL</span></h2>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Management Console</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'categories', icon: Tag, label: 'Categories' },
            { id: 'banners', icon: ImageIcon, label: 'Hero Banners' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[13px] uppercase tracking-wider transition-all ${
                    activeTab === item.id 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        
        <button onClick={async () => { await logout(); window.location.href = '/'; }} className="mt-10 flex items-center gap-3 p-4 text-slate-500 hover:text-red-400 font-bold transition border-t border-white/5 pt-8">
            <LogOut size={20} /> LOGOUT SYSTEM
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">{activeTab}</h1>
            <div className="h-1.5 w-20 bg-orange-500 mt-2 rounded-full"></div>
          </header>

          {activeTab === 'products' && (
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                 <span className="font-bold text-slate-500 text-xs uppercase tracking-widest">Active Inventory ({products.length})</span>
                 <Link href="/admin/products/new" className="bg-slate-900 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg">+ New Product</Link>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 flex items-center gap-4">
                        <img src={p.imageUrls[0]} className="w-12 h-12 object-contain rounded-xl border bg-white p-1" />
                        <div>
                          <div className="font-bold text-slate-800 text-sm tracking-tight">{p.shortName || p.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">{p.category?.name || 'Uncategorized'}</div>
                        </div>
                      </td>
                      <td className="p-4 font-black text-slate-900 text-sm">Rs. {parseFloat(p.price).toLocaleString()}</td>
                      <td className="p-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/admin/products/${p.id}/edit`} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition"><Edit2 size={14} /></Link>
                              <button onClick={async () => confirm('Delete?') && await deleteProduct(p.id)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition"><Trash2 size={14} /></button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="max-w-2xl space-y-6">
              <form onSubmit={async (e) => { e.preventDefault(); setIsProcessing(true); await upsertCategory({ name: catName }); setCatName(''); setIsProcessing(false); window.location.reload(); }} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex gap-3">
                <input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="New Category Name..." className="flex-1 p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" required />
                <button className="bg-orange-600 text-white px-8 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20">Create</button>
              </form>
              <div className="grid gap-2">
                {categories.map(c => (
                  <div key={c.id} className="bg-white p-5 rounded-[20px] border border-slate-100 flex justify-between items-center px-6 hover:border-orange-200 transition">
                    <span className="font-bold text-slate-700 tracking-tight">{c.name}</span>
                    <button onClick={async () => confirm('Delete?') && await deleteCategory(c.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-10">
              <form onSubmit={handleBannerSubmit} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 space-y-5 max-w-2xl">
                <div className="mb-4">
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Add New Hero Banner</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Only Image URL is required. Title & Subtitle are optional.</p>
                </div>
                <input value={bT} onChange={(e) => setBT(e.target.value)} placeholder="Main Heading (Optional)" className="w-full p-4 bg-slate-50 rounded-xl outline-none border-none font-bold text-sm" />
                <input value={bS} onChange={(e) => setBS(e.target.value)} placeholder="Short Description (Optional)" className="w-full p-4 bg-slate-50 rounded-xl outline-none border-none font-bold text-sm" />
                <input value={bI} onChange={(e) => setBI(e.target.value)} placeholder="Image URL (Required)" className="w-full p-4 bg-orange-50/50 rounded-xl outline-none border-2 border-dashed border-orange-200 font-bold text-sm" required />
                <button type="submit" className="w-full bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all">SAVE & PUBLISH BANNER</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map(b => (
                  <div key={b.id} className="relative aspect-[21/9] rounded-[24px] overflow-hidden group shadow-lg border-2 border-white">
                    <img src={b.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 text-center text-white backdrop-blur-[2px]">
                      {b.title && <p className="font-black mb-1 uppercase text-[10px] tracking-widest text-orange-400">{b.title}</p>}
                      <button onClick={async () => await deleteBanner(b.id)} className="bg-red-500 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase mt-4 shadow-lg">Remove Banner</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] p-10 rounded-[32px] text-white shadow-2xl">
                  <MousePointer2 className="text-orange-500 mb-4" size={32} />
                  <div className="text-5xl font-black tracking-tighter">{clickStats.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Total Clicks Tracked</div>
                </div>
                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
                  <Package className="text-orange-600 mb-4" size={32} />
                  <div className="text-5xl font-black tracking-tighter text-slate-800">{products.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Active Products</div>
                </div>
              </div>
              
              <div className="bg-red-50 p-8 rounded-[32px] border border-red-100">
                 <h3 className="text-xs font-black text-red-700 uppercase tracking-widest mb-6">Database Cleanup</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['today', '7days', '30days', 'all'].map(p => (
                      <button key={p} onClick={async () => confirm(`Clear ${p}?`) && await clearAnalytics(p)} className="bg-white border border-red-200 text-red-600 py-3 rounded-xl text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all">Clear {p}</button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <span className="font-bold text-slate-800 uppercase text-xs tracking-widest">Registered Members ({users.length})</span>
                <button onClick={async () => confirm('Delete ALL?') && await clearAllUsers()} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Clear All</button>
              </div>
              <div className="divide-y divide-slate-100">
                {users.map(u => (
                  <div key={u.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{u.name || 'Anonymous'}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{u.email}</div>
                    </div>
                    <button onClick={async () => confirm('Delete user?') && await deleteUser(u.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                  </div>
                ))}
                {users.length === 0 && <div className="p-16 text-center text-slate-400 font-bold uppercase text-xs italic">No users found.</div>}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200 space-y-6 max-w-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Social Media & Contact</h3>
              <div className="space-y-4">
                {['facebook', 'instagram', 'tiktok', 'email'].map(field => (
                  <div key={field} className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{field}</label>
                    <input 
                      defaultValue={initialSettings[field] || ''} 
                      onBlur={async (e) => await updateSetting(field, e.target.value)} 
                      className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-transparent focus:border-orange-500 font-bold text-slate-700 text-sm transition-all" 
                      placeholder={`Enter ${field} link...`} 
                    />
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
