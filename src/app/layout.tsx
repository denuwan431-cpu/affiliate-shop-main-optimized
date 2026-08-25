import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategories, getSiteSettings } from "@/lib/data";
import { Suspense, ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AffiliateShop.lk — Compare Deals',
  description: 'Discover selected products and best deals.',
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <html lang="en">
      <body className={`${inter.className} animated-bg min-h-screen flex flex-col`}>
        <SplashScreen />
        <Header categories={categories} />
        <main className="flex-1 relative z-10">
          <PageTransition>
            <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] animate-pulse font-bold text-slate-400 uppercase tracking-widest">Loading Deals...</div>}>
              {children}
            </Suspense>
          </PageTransition>
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
