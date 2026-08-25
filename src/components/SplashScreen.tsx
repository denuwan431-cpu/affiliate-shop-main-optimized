"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center"
        >
          <div className="relative overflow-hidden text-center">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-7xl font-[1000] text-white tracking-tighter uppercase italic"
            >
              AFFILIATE<span className="text-orange-600">SHOP.LK</span>
            </motion.h1>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-1 bg-orange-600 mt-4 rounded-full origin-left"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              className="text-white text-[10px] uppercase tracking-[0.5em] mt-4 font-bold"
            >
              Find The Best Deals
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
