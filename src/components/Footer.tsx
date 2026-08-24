import React from 'react';
import Link from 'next/link';

interface FooterProps {
  settings: Record<string, string>;
}

// Settings are passed down from the (server) root layout — cached there —
// instead of this component fetching '/api/settings' from the client on
// every page. That also means Footer no longer needs 'use client' or a
// hook at all for the social links, saving a bit of client JS.
export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-16 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-white font-black text-lg mb-6 tracking-tight uppercase border-l-4 border-orange-600 pl-4">Customer Care</h3>
          <ul className="space-y-3 text-[13px]">
            <li><Link href="#" className="hover:text-orange-500 transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition-colors">How to Buy</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition-colors">Corporate & Bulk Purchasing</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition-colors">Returns & Refunds</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-black text-lg mb-6 tracking-tight uppercase border-l-4 border-orange-600 pl-4">AffiliateShop</h3>
          <ul className="space-y-3 text-[13px]">
            <li><Link href="#" className="hover:text-orange-500 transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition-colors">Careers</Link></li>
            <li><Link href="/affiliate-disclosure" className="hover:text-orange-500 transition-colors">Affiliate Disclosure</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition-colors">Digital Payments</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-black text-lg mb-6 tracking-tight uppercase border-l-4 border-orange-600 pl-4">Payment Methods</h3>
          <div className="grid grid-cols-3 gap-2">
             {['Visa', 'MasterCard', 'Koko', 'Mintpay', 'Amex', 'COD'].map((name) => (
               <div key={name} className="bg-white/5 border border-white/10 h-9 rounded-lg flex items-center justify-center text-[9px] font-bold text-gray-400 hover:text-white hover:border-orange-500/50 transition-all duration-300 uppercase tracking-tighter cursor-default shadow-sm">
                 {name}
               </div>
             ))}
          </div>
        </div>
        <div>
          <h3 className="text-white font-black text-lg mb-6 tracking-tight uppercase border-l-4 border-orange-600 pl-4">Follow Us</h3>
          <div className="flex gap-3">
            <a href={settings.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all duration-500 group">
               <svg className="w-6 h-6 fill-current text-gray-400 group-hover:text-white group-hover:scale-110 transition duration-500" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </a>
            <a href={settings.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all duration-500 group">
               <svg className="w-6 h-6 fill-current text-gray-400 group-hover:text-white group-hover:scale-110 transition duration-500" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.197-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
            </a>
            <a href={settings.youtube || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all duration-500 group">
               <svg className="w-6 h-6 fill-current text-gray-400 group-hover:text-white group-hover:scale-110 transition duration-500" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 2.78 2.78 0 00-.46-5.33zM9.75 15.02V8.48L15.45 11.75l-5.7 3.27z"></path></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 tracking-widest uppercase font-bold relative">
        <p>&copy; {new Date().getFullYear()} AffiliateShop.lk | Affiliate shopping guide</p>
        
        <div className="flex items-center gap-2">
          <Link 
            href="/admin" 
            className="mt-6 md:mt-0 opacity-[0.08] hover:opacity-100 transition-all duration-500 cursor-default hover:cursor-pointer text-orange-600 flex items-center gap-2 hover:scale-105"
          >
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,88,12,0.8)]"></div>
            Secure System Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
