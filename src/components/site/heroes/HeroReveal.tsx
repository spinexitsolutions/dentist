"use client";

import Link from "next/link";
import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import { EASE, SplitWords, useIntroDone } from "../motion";
import type { HeroProps } from "./types";

/** Design 2 — the whole hero is a before/after comparison that follows the cursor. */
export default function HeroReveal({ hero, avatars, gallery }: HeroProps) {
  const play = useIntroDone();
  const box = useRef<HTMLDivElement>(null);
  const raw = useMotionValue(100);
  const pos = useSpring(raw, { stiffness: 120, damping: 22 });
  const clip = useTransform(pos, (p) => `inset(0 ${100 - p}% 0 0)`);
  const left = useTransform(pos, (p) => `${p}%`);
  const dragging = useRef(false);
  const touched = useRef(false);
  const item = gallery[0];
  const after = item?.after || hero.image;
  const before = item?.before || hero.image;
  const simulate = item ? item.simulateBefore : true;

  // opening sweep, then gentle idle sway until the visitor interacts
  useEffect(() => {
    if (!play) return;
    const c = animate(raw, 42, { duration: 1.8, ease: [0.76, 0, 0.24, 1], delay: 0.4 });
    let sway: ReturnType<typeof animate> | null = null;
    const t = setTimeout(() => {
      if (!touched.current) sway = animate(raw, [42, 58, 42], { duration: 5, repeat: Infinity, ease: "easeInOut" });
    }, 2400);
    return () => {
      c.stop();
      sway?.stop();
      clearTimeout(t);
    };
  }, [play, raw]);

  const move = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    touched.current = true;
    raw.stop();
    raw.set(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="p-2 md:p-3">
      <div
        ref={box}
        className="relative h-[calc(100dvh-60px)] min-h-[600px] touch-pan-y select-none overflow-hidden rounded-[28px] bg-ink md:h-[calc(100dvh-68px)] md:rounded-[36px]"
        onPointerMove={(e) => (e.pointerType === "mouse" || dragging.current) && move(e.clientX)}
        onPointerDown={(e) => {
          dragging.current = true;
          move(e.clientX);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after} alt="After treatment" draggable={false} className="absolute inset-0 size-full object-cover object-[50%_25%]" />
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={before} alt="Before treatment" draggable={false} className={`absolute inset-0 size-full object-cover object-[50%_25%] ${simulate ? "before-sim" : ""}`} />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />

        {/* handle */}
        <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 z-10">
          <div className="absolute inset-y-0 -left-px w-0.5 bg-white/90" />
          <div className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-2xl">
            <span className="flex">
              <ChevronLeft className="size-4" />
              <ChevronRight className="size-4" />
            </span>
          </div>
          <span className="absolute right-3 top-6 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur">Before</span>
          <span className="absolute left-3 top-6 rounded-full bg-accent px-3 py-1.5 text-[12px] font-semibold text-white">After</span>
        </motion.div>

        {/* copy */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-6 pb-10 text-white md:justify-center md:p-14">
          <motion.p initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : undefined} transition={{ delay: 0.3 }} className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/70">
            {hero.eyebrow}
          </motion.p>
          <h1 className="display mt-4 max-w-3xl text-[14vw] md:text-[clamp(3.6rem,7vw,7.4rem)]">
            <SplitWords text={hero.title} play={play} delay={0.2} />
            <br />
            <SplitWords text={hero.highlight} play={play} delay={0.35} wordClassName="thin-word text-pop" />
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={play ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.6, duration: 0.9, ease: EASE }} className="mt-5 hidden max-w-md text-[16px] leading-relaxed text-white/75 md:block">
            {hero.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={play ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.75, duration: 0.9, ease: EASE }} className="pointer-events-auto mt-7 flex flex-wrap items-center gap-2">
            <Link href="/book" className="group flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-[15px] font-semibold text-ink transition hover:bg-pop">
              {hero.ctaPrimary}
              <span className="grid size-10 place-items-center rounded-full bg-accent text-white transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
            <Link href="/gallery" className="rounded-full px-5 py-4 text-[15px] font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/10">
              See real results
            </Link>
          </motion.div>
        </div>

        {/* corner meta */}
        <motion.div initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : undefined} transition={{ delay: 1 }} className="pointer-events-none absolute right-5 top-5 z-20 hidden items-center gap-3 rounded-full bg-white/90 py-1.5 pl-1.5 pr-4 text-[13px] backdrop-blur md:flex">
          <span className="flex -space-x-2">
            {avatars.slice(0, 3).map((a) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={a.id} src={a.avatar} alt="" className="size-8 rounded-full border-2 border-white object-cover" />
            ))}
          </span>
          <span className="leading-tight">
            <b className="flex items-center gap-1">
              <Star className="size-3 fill-accent text-accent" /> {hero.rating}
            </b>
            <span className="text-ink/55">{hero.reviews}</span>
          </span>
        </motion.div>
        <p className="pointer-events-none absolute bottom-5 right-6 z-20 hidden text-[12px] font-medium text-white/60 md:block">Move your cursor across the smile</p>
      </div>
    </section>
  );
}
