import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import PageTransition from "@/components/PageTransition";

import { getCategories, getSiteSettings } from "@/lib/data";

import { Suspense, ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "AffiliateShop.lk",
  description: "Best Deals in Sri Lanka",
};


export const dynamic = "force-dynamic";


export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <html lang="en">
      <body
        className={`${inter.className} animated-bg min-h-screen flex flex-col antialiased`}
      >

        {/* Splash Screen */}
        <SplashScreen />


        {/* Header */}
        <Header categories={categories} />


        {/* Main Content */}
        <main className="relative z-10 flex-1">

          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center p-20 text-center">
                <div className="font-bold tracking-widest text-slate-400">
                  LOADING...
                </div>
              </div>
            }
          >

            <PageTransition>
              {children}
            </PageTransition>

          </Suspense>

        </main>


        {/* Footer */}
        <Footer settings={settings} />

      </body>
    </html>
  );
}
