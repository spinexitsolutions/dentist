"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EASE } from "../motion";
import SectionHead from "./SectionHead";

export function BeforeAfter({ item }: { item: GalleryItem }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className="relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] bg-ink md:aspect-[16/10]"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.after} alt={`${item.title} after`} className="pointer-events-none absolute inset-0 size-full object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.before} alt={`${item.title} before`} className={cn("pointer-events-none absolute inset-0 size-full object-cover", item.simulateBefore && "before-sim")} draggable={false} />
      </div>
      <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium">Before</span>
      <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white">After</span>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white" />
        <div className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-xl">
          <span className="flex">
            <ChevronLeft className="size-4" />
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(0);
  const item = items[active];
  if (!item) return null;
  return (
    <section className="container-x py-20 md:py-32">
      <SectionHead eyebrow="Smile gallery" title="Real patients." italic="Real confidence." text="Drag the handle to compare. Every result is designed digitally before we begin." />
      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_320px]">
        <AnimatePresence mode="wait">
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.6, ease: EASE }}>
            <BeforeAfter item={item} />
          </motion.div>
        </AnimatePresence>
        <div className="no-scrollbar flex gap-3 overflow-x-auto md:flex-col md:overflow-visible">
          {items.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setActive(i)}
              className={cn("relative flex min-w-[220px] items-center gap-4 rounded-2xl p-3 text-left transition md:min-w-0", i === active ? "text-white" : "hover:bg-card")}
            >
              {i === active && <motion.span layoutId="gal-active" className="absolute inset-0 rounded-2xl bg-ink" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.after} alt="" className="relative size-14 rounded-xl object-cover" />
              <span className="relative">
                <span className="block font-medium tracking-tight">{g.title}</span>
                <span className={cn("text-sm", i === active ? "text-white/60" : "text-muted")}>{g.treatment}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
