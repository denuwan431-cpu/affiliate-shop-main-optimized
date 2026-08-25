"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";


export default function SplashScreen() {

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const timer = window.setTimeout(
      () => {
        setLoading(false);
      },
      1500
    );


    return () => {
      window.clearTimeout(timer);
    };

  }, []);


  return (
    <AnimatePresence>

      {loading && (

        <motion.div
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            bg-slate-950
          "
        >

          <div
            className="
              w-full
              max-w-xl
              px-6
              text-center
            "
          >

            <motion.h1
              initial={{
                y: 25,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
              }}
              className="
                text-4xl
                font-black
                italic
                tracking-tighter
                text-white
                md:text-7xl
              "
            >
              AFFILIATE
              <span className="text-orange-500">
                SHOP.LK
              </span>
            </motion.h1>


            <motion.div
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: 1,
              }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeOut",
              }}
              className="
                mx-auto
                mt-5
                h-1
                w-32
                origin-left
                rounded-full
                bg-orange-500
                md:w-64
              "
            />


            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.6,
              }}
              className="
                mt-5
                text-xs
                font-medium
                uppercase
                tracking-[0.3em]
                text-slate-400
              "
            >
              Best Deals in Sri Lanka
            </motion.p>

          </div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}
