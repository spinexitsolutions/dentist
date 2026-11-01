"use client";

import { AnimatePresence, motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/types";
import { TOOTH_PATH } from "./icons";
import { EASE } from "./motion";

type Phase = "play" | "exit" | "gone";

function finish() {
  const w = window as unknown as { __introDone?: boolean; __lenis?: { start(): void } };
  w.__introDone = true;
  document.documentElement.style.overflow = "";
  w.__lenis?.start();
  window.dispatchEvent(new Event("intro:done"));
}

export default function Intro({ intro, accent }: { intro: Settings["intro"]; accent: string }) {
  const [phase, setPhase] = useState<Phase>("play");
  const [count, setCount] = useState(0);
  const D = Math.max(1.2, Math.min(intro.duration || 2.6, 8));

  useEffect(() => {
    if (document.documentElement.dataset.introSeen === "1") {
      setPhase("gone");
      finish();
      return;
    }
    const w = window as unknown as { __lenis?: { stop(): void } };
    document.documentElement.style.overflow = "hidden";
    w.__lenis?.stop();
    window.scrollTo(0, 0);
    const c = animate(0, 100, { duration: D * 0.85, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setCount(Math.round(v)) });
    const t = setTimeout(() => {
      setPhase("exit");
      finish();
      try {
        if (intro.showOncePerSession) sessionStorage.setItem("ivory-intro", "1");
      } catch {}
    }, D * 1000);
    return () => {
      clearTimeout(t);
      c.stop();
    };
  }, [D, intro.showOncePerSession]);

  if (phase === "gone") return null;

  const letters = intro.line1.split("");

  return (
    <AnimatePresence onExitComplete={() => setPhase("gone")}>
      {phase === "play" && (
        <motion.div
          data-intro
          key="intro"
          className="fixed inset-0 z-[200] text-white"
          initial={false}
          exit={intro.style === "curtain" ? { opacity: 1 } : { y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* background panes */}
          {intro.style === "curtain" ? (
            <>
              <motion.div className="absolute inset-y-0 left-0 w-1/2 bg-ink" exit={{ x: "-100%" }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} />
              <motion.div className="absolute inset-y-0 right-0 w-1/2 bg-ink" exit={{ x: "100%" }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} />
            </>
          ) : (
            <div className="absolute inset-0 bg-ink">
              {/* curved bottom edge that trails while the panel lifts */}
              <svg className="absolute left-0 top-full h-[18vh] w-full text-ink" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 0 Q50 40 100 0 Z" fill="currentColor" />
              </svg>
            </div>
          )}

          <motion.div className="relative flex h-full flex-col items-center justify-center grain" exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.6, ease: EASE }}>
            {intro.style !== "minimal" && (
              <div className="relative mb-8 size-24 md:size-28">
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" fill="none">
                  <motion.path
                    d={TOOTH_PATH}
                    stroke={accent}
                    strokeWidth={2.2}
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: D * 0.7, ease: [0.65, 0, 0.35, 1] }}
                  />
                  <motion.path
                    d={TOOTH_PATH}
                    fill={accent}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 0.18, scale: 1 }}
                    style={{ transformOrigin: "50% 50%" }}
                    transition={{ duration: 0.8, delay: D * 0.6, ease: EASE }}
                  />
                  {intro.style === "smile" && (
                    <motion.path
                      d="M34 40 Q50 54 66 40"
                      stroke="white"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.7, delay: D * 0.55, ease: EASE }}
                    />
                  )}
                </svg>
              </div>
            )}

            <h1 className="flex overflow-hidden text-[18vw] font-semibold leading-[0.9] tracking-[-0.06em] md:text-[9rem]">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: EASE, delay: 0.15 + i * 0.06 }}
                >
                  {l === " " ? " " : l}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="thin-word mt-2 text-2xl text-white/70 md:text-4xl"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.5, ease: EASE }}
            >
              {intro.line2}
            </motion.p>
          </motion.div>

          {/* bottom meta row */}
          <motion.div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 font-mono text-xs uppercase tracking-[0.2em] text-white/50 md:p-10" exit={{ opacity: 0 }}>
            <span>Est. 2009</span>
            <span className="tabular-nums text-white">
              <span className="text-5xl tracking-tight md:text-7xl">{String(count).padStart(3, "0")}</span>
            </span>
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{ background: accent, width: `${count}%` }}
            exit={{ opacity: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
