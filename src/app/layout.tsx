import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategories, getSiteSettings } from "@/lib/data";
import { Suspense, ReactNode } from "react";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AffiliateShop.lk — Best Deals',
  description: 'Compare Deals & Shop on Daraz',
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
          <Suspense fallback={<div className="p-20 text-center font-bold">Loading...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
