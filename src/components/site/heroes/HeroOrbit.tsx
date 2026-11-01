"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { useRef } from "react";
import { EASE, Magnetic, SplitWords, useIntroDone } from "../motion";
import type { HeroProps } from "./types";

/** Round so server and browser trig results serialise identically. */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Design 4 — calm centred type, a hand-drawn smile line and orbiting portraits. */
export default function HeroOrbit({ hero, avatars, doctors, services }: HeroProps) {
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const spin = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const bubbles = [
    { img: hero.image, label: "Smile makeover" },
    { img: doctors[0]?.image, label: doctors[0]?.name },
    { img: services[0]?.image, label: services[0]?.title },
    { img: avatars[0]?.avatar, label: `“${avatars[0]?.role}”` },
    { img: doctors[2]?.image, label: doctors[2]?.role },
    { img: services[1]?.image, label: services[1]?.title },
    { img: avatars[2]?.avatar, label: "5★ review" },
    { img: services[3]?.image, label: services[3]?.title },
  ].filter((b) => b.img);

  return (
    <section ref={ref} className="relative flex h-[calc(100dvh-44px)] min-h-[640px] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--pop)_0%,transparent_60%)] opacity-50" />

      {/* orbit */}
      <motion.div style={{ rotate: spin, opacity: fade }} className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[78%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-ink/10 md:h-[80%] md:w-[86%]" />
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-ink/10 md:w-[64%]" />
        <div className="absolute inset-0 animate-[spin_90s_linear_infinite]">
          {bubbles.map((b, i) => {
            const a = (i / bubbles.length) * Math.PI * 2 - Math.PI / 2;
            const size = i % 3 === 0 ? 112 : i % 3 === 1 ? 84 : 68;
            return (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${r3(50 + Math.cos(a) * 43)}%`, top: `${r3(50 + Math.sin(a) * 40)}%` }}
              >
                <div className="animate-[spin_90s_linear_infinite_reverse]">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={play ? { scale: 1, opacity: 1 } : undefined}
                  transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 + i * 0.08 }}
                >
                  <div className="relative scale-[0.5] opacity-80 md:scale-100 md:opacity-100" style={{ width: size, height: size }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.img} alt="" className="size-full rounded-full object-cover shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)] ring-4 ring-white" />
                    {i % 2 === 0 && b.label && (
                      <span className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold shadow md:block">{b.label}</span>
                    )}
                  </div>
                </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* centre copy */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={play ? { opacity: 1, y: 0 } : undefined} className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-medium text-ink/70 ring-1 ring-ink/5 backdrop-blur">
          <span className="size-1.5 rounded-full bg-accent" /> {hero.eyebrow}
        </motion.p>
        <h1 className="display mt-6 text-[15vw] md:text-[clamp(4rem,8vw,8.6rem)]">
          <SplitWords text={hero.title} play={play} delay={0.15} />
          <br />
          <span className="relative inline-block">
            <SplitWords text={hero.highlight} play={play} delay={0.3} wordClassName="thin-word text-accent" />
            <svg viewBox="0 0 300 40" preserveAspectRatio="none" className="absolute -bottom-[0.18em] left-[4%] h-[0.32em] w-[92%] overflow-visible">
              <motion.path
                d="M4 8 Q150 52 296 8"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={play ? { pathLength: 1 } : undefined}
                transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
              />
            </svg>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : undefined} transition={{ delay: 0.7 }} className="mx-auto mt-8 max-w-xl text-[16px] leading-relaxed text-ink/60">
          {hero.subtitle}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={play ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.85, duration: 0.9, ease: EASE }} className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Magnetic>
            <Link href="/book" className="group flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-semibold text-white transition hover:bg-accent">
              {hero.ctaPrimary}
              <span className="grid size-10 place-items-center rounded-full bg-pop text-ink transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </Magnetic>
          <Link href="/services" className="rounded-full bg-white/70 px-5 py-4 text-[15px] font-semibold ring-1 ring-ink/10 backdrop-blur transition hover:bg-white">
            {hero.ctaSecondary}
          </Link>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : undefined} transition={{ delay: 1 }} className="mt-6 flex items-center justify-center gap-1.5 text-[13px] text-ink/60">
          <Star className="size-3.5 fill-accent text-accent" /> <b className="text-ink">{hero.rating}</b> · {hero.reviews}
        </motion.p>
      </div>
    </section>
  );
}
