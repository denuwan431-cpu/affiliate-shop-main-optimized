"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AdminSettings() {
  const [settings, setSettings] = useState({ facebookUrl: "", youtubeUrl: "" });

  const handleSave = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    });
    if (res.ok) toast.success("Settings Updated Successfully!");
  };

  return (
    <div className="p-10 max-w-3xl">
      <h1 className="text-4xl font-black text-slate-900 mb-10">Site Settings</h1>
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-8">
        <div>
          <label className="block text-sm font-bold uppercase text-slate-400 mb-3">Facebook Link</label>
          <input 
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-orange-500 outline-none transition-all"
            value={settings.facebookUrl}
            onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase text-slate-400 mb-3">YouTube Link</label>
          <input 
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-orange-500 outline-none transition-all"
            value={settings.youtubeUrl}
            onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
            placeholder="https://youtube.com/..."
          />
        </div>
        <button 
          onClick={handleSave}
          className="w-full bg-orange-500 text-white font-black py-5 rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 uppercase tracking-widest"
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
}
