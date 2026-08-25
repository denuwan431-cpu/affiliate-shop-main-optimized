'use client';

import React, { useState } from 'react';
import { 
  Package, Tag, Image as ImageIcon, LogOut, 
  Plus, Trash2, Settings, Users, BarChart3, 
  MousePointer2, AlertTriangle, ExternalLink, Edit2 
} from 'lucide-react';
import Link from 'next/link';
import { 
  deleteProduct, upsertCategory, deleteCategory, 
  upsertBanner, deleteBanner, updateSetting, 
  logout, clearAnalytics, deleteUser, clearAllUsers 
} from './actions';

export default function AdminUI({ 
  products, categories, banners, initialSettings, clickStats, users 
}: { 
  products: any[], categories: any[], banners: any[], 
  initialSettings: any, clickStats: any[], users: any[] 
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [isProcessing, setIsProcessing] = useState(false);
  const [siteSettings, setSiteSettings] = useState(initialSettings || {});
  
  // States for Category and Banner Forms
  const [catName, setCatName] = useState('');
  const [bTitle, setBTitle] = useState('');
  const [bSub, setBSub] = useState('');
  const [bImg, setBImg] = useState('');

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center text-white font-black tracking-widest animate-pulse uppercase">
          Processing...
        </div>
      )}
      
      {/* Sidebar Section */}
      <aside className="w-full md:w-72 bg-[#0f172a] text-white p-8 shrink-0 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12 border-b border-white/5 pb-6">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black shadow-lg">A</div>
            <span className="text-xl font-black tracking-tighter uppercase">Admin Panel</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'products', icon: Package, label: 'Inventory / Products' },
            { id: 'categories', icon: Tag, label: 'Categories' },
            { id: 'banners', icon: ImageIcon, label: 'Hero Banners' },
            { id: 'users', icon: Users, label: 'User Management' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'settings', icon: Settings, label: 'Site Settings' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        
        <button onClick={async () => { await logout(); window.location.href = '/'; }} className="mt-10 flex items-center gap-3 p-4 text-slate-500 hover:text-red-400 font-bold transition">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Dashboard Section */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto max-h-screen">
        <h1 className="text-4xl font-black mb-12 capitalize text-slate-800 tracking-tight">{activeTab.replace('-', ' ')}</h1>

        {/* --- 1. PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
               <span className="font-black text-slate-500 text-xs uppercase tracking-widest">Live Inventory ({products.length})</span>
               <Link href="/admin/products/new" className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 transition hover:scale-105">+ Add Product</Link>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition group">
                    <td className="p-6 flex items-center gap-5">
                      <img src={p.imageUrls[0]} className="w-16 h-16 object-cover rounded-2xl border bg-white p-1" />
                      <div>
                        <div className="font-black text-slate-800 text-sm tracking-tight leading-none mb-2">{p.shortName || p.name}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Tag size={10} className="text-orange-500" /> {p.category?.name || 'Uncategorized'}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-black text-orange-600 text-lg tracking-tighter whitespace-nowrap">Rs. {parseFloat(p.price).toLocaleString()}</td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${p.id}/edit`} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition"><Edit2 size={16} /></Link>
                        <button onClick={async () => confirm('Delete product?') && await deleteProduct(p.id)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 2. CATEGORIES TAB --- */}
        {activeTab === 'categories' && (
          <div className="max-w-2xl space-y-8">
            <form onSubmit={async (e) => { e.preventDefault(); setIsProcessing(true); await upsertCategory({ name: catName }); setCatName(''); setIsProcessing(false); window.location.reload(); }} className="bg-white p-8 rounded-[32px] border shadow-sm flex gap-4">
              <input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Enter Category Name..." className="flex-1 p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border-none focus:ring-2 focus:ring-orange-500" required />
              <button className="bg-orange-600 text-white px-10 rounded-2xl font-black shadow-lg shadow-orange-100 transition hover:scale-105 uppercase text-xs tracking-widest">Create</button>
            </form>
            <div className="grid gap-3">
              {categories.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex justify-between items-center px-8 shadow-sm hover:shadow-md transition">
                  <span className="font-black text-slate-700 tracking-tight text-lg">{c.name}</span>
                  <button onClick={async () => confirm('Delete category?') && await deleteCategory(c.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={22} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. BANNERS TAB --- */}
        {activeTab === 'banners' && (
          <div className="space-y-12">
            <form onSubmit={async (e) => { e.preventDefault(); setIsProcessing(true); await upsertBanner({ title: bTitle, subtitle: bSub, imageUrl: bImg, isEnabled: true }); setIsProcessing(false); window.location.reload(); }} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-6 max-w-3xl">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">Add New Hero Banner</h3>
              <input value={bTitle} onChange={(e) => setBTitle(e.target.value)} placeholder="Banner Title" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" required />
              <input value={bSub} onChange={(e) => setBSub(e.target.value)} placeholder="Subtitle / Description" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" required />
              <input value={bImg} onChange={(e) => setBImg(e.target.value)} placeholder="Image URL (Link)" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" required />
              <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black shadow-lg">PUBLISH BANNER</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {banners.map(b => (
                <div key={b.id} className="relative aspect-video rounded-[40px] overflow-hidden group shadow-xl border-4 border-white">
                  <img src={b.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 text-center text-white">
                    <p className="font-bold mb-4">{b.title}</p>
                    <button onClick={async () => await deleteBanner(b.id)} className="bg-red-500 text-white px-8 py-3 rounded-full font-black text-xs uppercase shadow-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 4. USERS TAB --- */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
               <span className="font-black text-slate-800 uppercase text-xs tracking-widest">Members ({users.length})</span>
               <button onClick={async () => confirm('Clear all users?') && await clearAllUsers()} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Clear All Users</button>
            </div>
            <div className="divide-y divide-slate-50">
              {users.map(u => (
                <div key={u.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black border border-slate-200 uppercase">{u.name?.charAt(0) || 'U'}</div>
                    <div><div className="font-black text-slate-800 text-sm tracking-tight">{u.name || 'Anonymous'}</div><div className="text-xs text-slate-400 font-bold">{u.email}</div></div>
                  </div>
                  <button onClick={async () => await deleteUser(u.id)} className="text-slate-200 group-hover:text-red-500 transition"><Trash2 size={20} /></button>
                </div>
              ))}
              {users.length === 0 && <div className="p-24 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic">No members found.</div>}
            </div>
          </div>
        )}

        {/* --- 5. ANALYTICS TAB --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0f172a] p-12 rounded-[40px] text-white shadow-2xl flex flex-col gap-2">
                <MousePointer2 className="text-orange-500 mb-2" size={32} />
                <div className="text-6xl font-black tracking-tighter">{clickStats.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Total Clicks Tracked</div>
              </div>
              <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm flex flex-col gap-2">
                <BarChart3 className="text-orange-600 mb-2" size={32} />
                <div className="text-6xl font-black tracking-tighter text-slate-800">{products.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Live Items</div>
              </div>
            </div>
            
            <div className="bg-red-50 p-10 rounded-[40px] border border-red-100">
               <h3 className="text-xl font-black text-red-700 flex items-center gap-3 lowercase tracking-tighter italic mb-8">danger zone: clear records</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['today', '7days', '30days', 'all'].map(p => (
                    <button key={p} onClick={async () => confirm(`Clear ${p}?`) && await clearAnalytics(p)} className="bg-white border border-red-200 text-red-600 py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition shadow-sm">Clear {p}</button>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* --- 6. SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 space-y-8 max-w-xl">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 lowercase tracking-tighter italic">site configuration</h3>
            <div className="space-y-6">
              {['facebook', 'instagram', 'tiktok', 'email'].map(field => (
                <div key={field} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">{field}</label>
                  <input 
                    defaultValue={initialSettings[field] || ''} 
                    onBlur={async (e) => await updateSetting(field, e.target.value)} 
                    className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 shadow-inner" 
                    placeholder={`Enter ${field} link...`} 
                  />
                </div>
              ))}
            </div>
            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-start gap-4">
              <AlertTriangle className="text-orange-600 shrink-0" size={20} />
              <p className="text-orange-800 text-[11px] font-bold leading-relaxed uppercase tracking-tight italic">Security Note: Information is synchronized automatically with the main database upon exiting the field.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
