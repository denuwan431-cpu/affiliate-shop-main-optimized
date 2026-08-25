'use client';

import React, { useState } from 'react';
import { Package, Tag, Image as ImageIcon, LogOut, Plus, Trash2, Settings, Users, BarChart3, MousePointer2, AlertTriangle, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, upsertCategory, deleteCategory, upsertBanner, deleteBanner, updateSetting, logout, clearAnalytics, deleteUser, clearAllUsers } from './actions';

export default function AdminUI({ products, categories, banners, initialSettings, clickStats, users }: { products: any[], categories: any[], banners: any[], initialSettings: any, clickStats: any[], users: any[] }) {
  const [activeTab, setActiveTab] = useState('products');
  const [isProcessing, setIsProcessing] = useState(false);
  const [siteSettings, setSiteSettings] = useState(initialSettings || {});
  const [catName, setCatName] = useState('');
  const [bT, setBT] = useState('');
  const [bS, setBS] = useState('');
  const [bI, setBI] = useState('');

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row">
      {isProcessing && <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center text-white font-black tracking-widest animate-pulse">PROCESSING...</div>}
      <aside className="w-full md:w-72 bg-[#0f172a] text-white p-8 shrink-0 flex flex-col shadow-2xl">
        <div className="text-xl font-black mb-12 text-orange-500 uppercase tracking-tighter border-b border-white/5 pb-6 text-center">Admin Panel</div>
        <nav className="space-y-2 flex-1">
          {[{ id: 'products', icon: Package, label: 'Products' }, { id: 'categories', icon: Tag, label: 'Categories' }, { id: 'banners', icon: ImageIcon, label: 'Hero Banners' }, { id: 'users', icon: Users, label: 'Users Admin' }, { id: 'analytics', icon: BarChart3, label: 'Analytics' }, { id: 'settings', icon: Settings, label: 'Site Settings' }].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={async () => { await logout(); window.location.href = '/'; }} className="mt-10 flex items-center gap-3 p-4 text-slate-500 hover:text-red-400 font-bold transition"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 md:p-16 overflow-y-auto max-h-screen">
        <h1 className="text-4xl font-black mb-12 capitalize text-slate-800 tracking-tight">{activeTab.replace('-', ' ')}</h1>

        {activeTab === 'products' && (
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
               <span className="font-black text-slate-500 text-xs uppercase tracking-widest">Inventory ({products.length})</span>
               <Link href="/admin/products/new" className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">+ Add Item</Link>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition group">
                    <td className="p-6 flex items-center gap-5">
                      <img src={p.imageUrls[0]} className="w-16 h-16 object-cover rounded-2xl border bg-white p-1" />
                      <div>
                        <div className="font-black text-slate-800 text-sm tracking-tight mb-2">{p.shortName || p.name}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.category?.name || 'Uncategorized'}</div>
                      </div>
                    </td>
                    <td className="p-6 font-black text-orange-600 text-lg tracking-tighter">Rs. {parseFloat(p.price).toLocaleString()}</td>
                    <td className="p-6 text-right">
                        <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/products/${p.id}/edit`} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition"><Edit2 size={16} /></Link>
                            <button onClick={async () => confirm('Delete?') && await deleteProduct(p.id)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-2xl space-y-8">
            <form onSubmit={async (e) => { e.preventDefault(); setIsProcessing(true); await upsertCategory({ name: catName }); setCatName(''); setIsProcessing(false); window.location.reload(); }} className="bg-white p-8 rounded-[32px] border shadow-sm flex gap-4">
              <input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Category Name..." className="flex-1 p-5 bg-slate-50 rounded-2xl outline-none font-bold" required />
              <button className="bg-orange-600 text-white px-10 rounded-2xl font-black uppercase text-xs">Create</button>
            </form>
            <div className="grid gap-3">
              {categories.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex justify-between items-center px-8 shadow-sm hover:shadow-md transition">
                  <span className="font-black text-slate-700 tracking-tight text-lg">{c.name}</span>
                  <button onClick={async () => confirm('Delete?') && await deleteCategory(c.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={22} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-12">
            <form onSubmit={async (e) => { e.preventDefault(); setIsProcessing(true); await upsertBanner({ title: bT, subtitle: bS, imageUrl: bI, isEnabled: true }); setIsProcessing(false); window.location.reload(); }} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-6 max-w-2xl">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">Add New Hero Banner</h3>
              <input value={bT} onChange={(e) => setBT(e.target.value)} placeholder="Main Heading" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" required />
              <input value={bS} onChange={(e) => setBS(e.target.value)} placeholder="Short Description" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" required />
              <input value={bI} onChange={(e) => setBI(e.target.value)} placeholder="Image URL (Link)" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" required />
              <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black shadow-lg">SAVE & PUBLISH</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {banners.map(b => (
                <div key={b.id} className="relative aspect-video rounded-[40px] overflow-hidden group shadow-xl border-4 border-white"><img src={b.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 text-center text-white">
                    <p className="font-bold mb-4 uppercase text-xs tracking-widest">{b.title}</p>
                    <button onClick={async () => await deleteBanner(b.id)} className="bg-red-500 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase shadow-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0f172a] p-12 rounded-[40px] text-white shadow-2xl flex flex-col gap-2">
                <MousePointer2 className="text-orange-500 mb-2" size={32} />
                <div className="text-6xl font-black tracking-tighter">{clickStats.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Total Clicks Tracked</div>
              </div>
              <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm flex flex-col gap-2 text-slate-800"><BarChart3 className="text-orange-600 mb-2" size={32} /><div className="text-6xl font-black tracking-tighter">{products.length}</div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Total Products</div></div>
            </div>
            <div className="bg-red-50 p-10 rounded-[40px] border border-red-100"><h3 className="text-xl font-black text-red-700 flex items-center gap-3 lowercase tracking-tighter italic mb-8">danger zone: clear records</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['today', '7days', '30days', 'all'].map(p => (
                    <button key={p} onClick={async () => confirm(`Clear ${p}?`) && await clearAnalytics(p)} className="bg-white border border-red-200 text-red-600 py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition">Clear {p}</button>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden"><div className="p-8 border-b flex justify-between items-center bg-slate-50/50"><span className="font-black text-slate-800 uppercase text-xs tracking-widest">Members ({users.length})</span><button onClick={async () => confirm('Delete ALL?') && await clearAllUsers()} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Clear All Users</button></div>
            <div className="divide-y divide-slate-50">
              {users.map(u => (<div key={u.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition"><div><div className="font-black text-slate-800 text-sm">{u.name || 'Anonymous'}</div><div className="text-xs text-slate-400 font-bold">{u.email}</div></div><button onClick={async () => await deleteUser(u.id)} className="text-slate-200 hover:text-red-500 transition"><Trash2 size={20} /></button></div>))}
              {users.length === 0 && <div className="p-24 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic">No registered members found.</div>}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 space-y-8 max-w-xl"><h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 lowercase tracking-tighter italic">site configuration</h3>
            <div className="space-y-6">{['facebook', 'instagram', 'tiktok', 'email'].map(field => (
                <div key={field} className="space-y-2"><label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">{field}</label><input defaultValue={initialSettings[field] || ''} onBlur={async (e) => await updateSetting(field, e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 shadow-inner" placeholder={`Enter ${field} details...`} /></div>
            ))}</div>
          </div>
        )}
      </main>
    </div>
  );
}
