import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategories, getSiteSettings } from "@/lib/data";
import { Suspense } from "react";
import PageTransition from "@/components/PageTransition";
import SplashScreen from "@/components/SplashScreen"; // නව Splash Screen එක

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'AffiliateShop.lk — Compare Deals & Shop on Daraz', template: '%s | AffiliateShop.lk' },
  description: 'Discover selected products, compare prices and check the latest deals on Daraz through our affiliate links.',
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: 'AffiliateShop.lk' },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Database එකෙන් දත්ත ලබා ගැනීම
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <html lang="en">
      <body className="animated-bg text-gray-900 antialiased min-h-screen flex flex-col overflow-x-hidden">
        {/* වෙබ් අඩවිය Load වන විට පෙන්වන Animation එක */}
        <SplashScreen />

        {/* Header කොටස */}
        <Header categories={categories} />
        
        <main className="flex-1 relative z-10">
          <PageTransition>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </PageTransition>
        </main>

        {/* Footer කොටස */}
        <Footer settings={settings} />
      </body>
    </html>
  );
}
