"use client";

import React, { useState } from 'react';
import { login } from '../actions';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await login(password);
      if (res.success) {
        // ඉතා වැදගත්: සම්පූර්ණ පිටුවම refresh වී /admin වෙත යයි
        window.location.href = '/admin';
      } else {
        setLoading(false);
        alert("වැරදි මුරපදයක්!");
      }
    } catch (err) {
      setLoading(false);
      alert("සර්වර් එක සමඟ සම්බන්ධ විය නොහැක.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#111] p-8 rounded-[30px] border border-white/5 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <Lock className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-8">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passkey"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 text-center"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
