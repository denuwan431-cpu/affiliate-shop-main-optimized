'use client';

import React, { useState } from 'react';
import { Package, Tag, Image as ImageIcon, LogOut, LayoutDashboard, Plus, Trash2, Settings, Users, BarChart3, Star } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, addCategory, deleteCategory, addBanner, deleteBanner, updateSetting, logout, clearAnalytics } from './actions';
import { useRouter } from 'next/navigation';

export default function AdminUI({ products, categories, banners, initialSettings, clickStats, users }: { products: any[], categories: any[], banners: any[], initialSettings: any, clickStats: any[], users: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [siteSettings, setSiteSettings] = useState(initialSettings || {});
  const [isProcessing, setIsProcessing] = useState(false);

  // ... (ඔබගේ අනෙකුත් handle functions එලෙසම තබන්න)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Sidebar - Requirement 1, 5, 7, 8 */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">A</div>
          <span className="text-xl font-black tracking-tighter">AFFILIATE SHOP</span>
        </div>

        <nav className="space-y-1 flex-1">
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'products' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Package size={20} /> Products</button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'categories' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Tag size={20} /> Categories</button>
          <button onClick={() => setActiveTab('banners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'banners' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><ImageIcon size={20} /> Banners</button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'users' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Users size={20} /> Users Admin</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><BarChart3 size={20} /> Analytics</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}><Settings size={20} /> Settings</button>
        </nav>

        {/* Logout section stays here */}
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* Analytics Tab UI - Requirement 8 */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col gap-2">
                <BarChart3 className="text-orange-500" />
                <span className="text-3xl font-black">{clickStats.length}</span>
                <span className="text-sm text-gray-500">Total Affiliate Clicks</span>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
               <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="font-bold">Recent Clicks Stats</h3>
                  <button onClick={() => confirm('Clear all analytics?') && clearAnalytics('all')} className="text-xs text-red-500 font-bold hover:underline">Clear Data</button>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                    <tr><th className="p-4">Product</th><th className="p-4">Platform</th><th className="p-4 text-right">Time</th></tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {clickStats.map((log: any) => (
                      <tr key={log.id}><td className="p-4 font-bold">{log.product?.name}</td><td className="p-4 text-xs text-gray-500">{log.userAgent?.split(' ')[0]}</td><td className="p-4 text-right text-gray-400">{new Date(log.clickedAt).toLocaleTimeString()}</td></tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Users Tab UI - Requirement 7 */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold">Registered Users ({users?.length || 0})</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                <tr><th className="p-4">User</th><th className="p-4">Email</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {users?.map((u: any) => (
                  <tr key={u.id}>
                    <td className="p-4 font-bold">{u.name}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4 text-right"><button className="text-red-500 p-2"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ... (අනෙකුත් Tab content එලෙසම තබන්න) */}
      </main>
    </div>
  );
}
