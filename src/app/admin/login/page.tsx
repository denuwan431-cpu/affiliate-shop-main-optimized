"use client";

import React, { useState } from 'react';
import { login } from '../actions';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await login(password);
      if (res.success) {
        // සාර්ථක නම් වහාම admin dashboard එකට යොමු කරයි
        router.push('/admin');
        router.refresh();
      } else {
        setStatus('error');
        alert("වැරදි මුරපදයක්! (Invalid Password)");
      }
    } catch (err) {
      setStatus('error');
      alert("සම්බන්ධතාවයේ දෝෂයකි. නැවත උත්සාහ කරන්න.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5 w-full max-w-md shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/20 blur-[100px] rounded-full group-hover:bg-orange-600/30 transition-all duration-700"></div>
        
        <div className="relative z-10 text-center space-y-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-900/20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <Lock className="text-white w-10 h-10" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Encrypted Login</h1>
            <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-orange-500/80 text-[10px] font-black uppercase tracking-widest ml-1">Secure Passkey</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-center tracking-[0.5em] placeholder:tracking-normal"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-white/5 hover:bg-orange-600 text-white font-black py-5 rounded-2xl transition-all duration-300 active:scale-95 border border-white/10 hover:border-orange-500 shadow-xl disabled:opacity-50"
            >
              {status === 'loading' ? 'VERIFYING...' : 'ACCESS DASHBOARD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
