"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type W = { __hasNavigated?: boolean };

export default function Template({ children }: { children: React.ReactNode }) {
  // false on the very first load (the intro handles that), true on client-side navigations
  const [animateIn] = useState(() => typeof window !== "undefined" && (window as unknown as W).__hasNavigated === true);
  useEffect(() => {
    (window as unknown as W).__hasNavigated = true;
  }, []);
  return (
    <>
      {animateIn && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[150] origin-top bg-ink"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
      <motion.div initial={animateIn ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: animateIn ? 0.25 : 0 }}>
        {children}
      </motion.div>
    </>
  );
}
