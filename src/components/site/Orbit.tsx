"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

/** Round so server and browser trig results serialise identically. */
export const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** The brand's signature: a hand-drawn smile curve under a word. */
export function SmileLine({ children, className, play, delay = 0.4 }: { children: ReactNode; className?: string; play?: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const show = play ?? inView;
  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
      <svg viewBox="0 0 300 40" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.16em] left-[4%] h-[0.3em] w-[92%] overflow-visible" aria-hidden>
        <motion.path
          d="M4 8 Q150 52 296 8"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 3.5 }}
          initial={{ pathLength: 0 }}
          animate={show ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay }}
        />
      </svg>
    </span>
  );
}

/** Soft mint glow + concentric orbit rings, used as a section backdrop. */
export function OrbitBackdrop({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className={cn("absolute left-1/2 top-1/2 size-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl", dark ? "bg-accent/25" : "bg-pop/40")} />
      <div className={cn("absolute left-1/2 top-1/2 h-[80%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border md:w-[86%]", dark ? "border-white/10" : "border-ink/[.07]")} />
      <div className={cn("absolute left-1/2 top-1/2 h-[58%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed md:w-[62%]", dark ? "border-white/10" : "border-ink/[.07]")} />
    </div>
  );
}

/** Small white pill used for eyebrows across the site. */
export function Pill({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 backdrop-blur",
        dark ? "bg-white/10 text-white/80 ring-white/15" : "bg-white/80 text-ink/70 ring-ink/5",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export type Bubble = { img?: string; label?: string };

/** Portrait bubbles that slowly orbit a centre point while staying upright. */
export function OrbitBubbles({
  items,
  play = true,
  rx = 43,
  ry = 40,
  sizes = [112, 84, 68],
  mobileScale = 0.5,
  speed = 90,
  labels = true,
}: {
  items: Bubble[];
  play?: boolean;
  rx?: number;
  ry?: number;
  sizes?: number[];
  mobileScale?: number;
  speed?: number;
  labels?: boolean;
}) {
  const list = items.filter((b) => b.img);
  return (
    <div className="absolute inset-0" style={{ animation: `spin ${speed}s linear infinite` }}>
      {list.map((b, i) => {
        const a = (i / list.length) * Math.PI * 2 - Math.PI / 2;
        const size = sizes[i % sizes.length];
        return (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${r3(50 + Math.cos(a) * rx)}%`, top: `${r3(50 + Math.sin(a) * ry)}%` }}>
            <div style={{ animation: `spin ${speed}s linear infinite reverse` }}>
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={play ? { scale: 1, opacity: 1 } : undefined} transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 + i * 0.08 }}>
                <div className="relative origin-center scale-[var(--ms)] opacity-90 md:scale-100 md:opacity-100" style={{ width: size, height: size, ["--ms" as string]: mobileScale }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.img} alt="" className="size-full rounded-full object-cover shadow-[0_20px_40px_-15px_rgba(11,30,51,0.35)] ring-4 ring-white" />
                  {labels && i % 2 === 0 && b.label && (
                    <span className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink shadow md:block">{b.label}</span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
