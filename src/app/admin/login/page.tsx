'use client';

import React, { useState } from 'react';
import { login } from '../actions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await login(password);
      if (res.success) {
        // Redirection should be fast now since the cookie is set server-side
        router.push('/admin');
        router.refresh();
      } else {
        setError('Wrong passcode. Access denied.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#0a0a0a] p-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/10 w-full max-w-md shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-3xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-2xl shadow-orange-500/20 rotate-3 transition-transform duration-500">
            A
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">ENCRYPTED LOGIN</h1>
          <p className="text-gray-400 mt-3 text-[10px] font-black uppercase tracking-[0.2em]">Authorized Access Only</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] ml-1">Secure Passkey</label>
            <input
              type="password"
              required
              autoFocus
              disabled={loading}
              className="w-full px-6 py-5 bg-white/[0.05] border border-white/10 rounded-3xl outline-none focus:ring-2 focus:ring-orange-600 transition-all text-white placeholder-white/10 text-center text-2xl tracking-[0.8em] font-black disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-[10px] font-black text-center animate-shake uppercase tracking-wider">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 text-white py-5 rounded-3xl font-black text-lg transition-all shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                VERIFYING...
              </>
            ) : (
              'AUTHENTICATE'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
