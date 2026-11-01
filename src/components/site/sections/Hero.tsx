"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Service, Settings, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EASE, Magnetic, SplitWords, useIntroDone } from "../motion";
import { TOOTH_PATH } from "../icons";

const N = 14; // teeth in the upper arch
const RX = 45; // % of width
const RY = 86; // % of height
const CY = 100; // arch centre sits on the bottom edge

/** Round so server and browser trig results serialise identically (avoids hydration drift). */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

type Slide = { key: string; title: string; sub: string; image: string; href: string; price?: string; fdi?: string };

/** Pre-computed geometry for each tooth along the arch. */
const TEETH = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  const a = Math.PI + 0.17 + t * (Math.PI - 0.34);
  const pair = Math.min(6, Math.round(Math.abs(i - (N - 1) / 2) - 0.5));
  return {
    i,
    cos: r3(Math.cos(a)),
    sin: r3(Math.sin(a)),
    rot: r3((a * 180) / Math.PI - 90),
    pair,
    size: r3(0.78 + pair * 0.075),
    fdi: `${i < N / 2 ? 1 : 2}${pair + 1}`,
  };
});

function Tooth({
  t,
  active,
  play,
  spread,
  onPick,
}: {
  t: (typeof TEETH)[number];
  active: boolean;
  play: boolean;
  spread: MotionValue<number>;
  onPick: () => void;
}) {
  const x = useTransform(spread, (v) => t.cos * v * 120);
  const y = useTransform(spread, (v) => t.sin * v * 120);
  const opacity = useTransform(spread, [0, 0.9], [1, 0]);
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${r3(50 + RX * t.cos)}%`, top: `${r3(CY + RY * t.sin)}%`, width: `calc(var(--tw) * ${t.size} * 1%)` }}>
      <motion.div style={{ x, y, opacity }}>
        <motion.button
          type="button"
          aria-label={`Tooth ${t.fdi}`}
          onMouseEnter={onPick}
          onFocus={onPick}
          onClick={onPick}
          initial={{ scale: 0, opacity: 0, rotate: t.rot }}
          animate={play ? { scale: active ? 1.22 : 1, opacity: 1, rotate: t.rot } : { rotate: t.rot }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: play && !active ? 0.25 + t.pair * 0.07 : 0 }}
          className="group block w-full cursor-pointer outline-none"
        >
          <svg viewBox="0 0 100 100" className="w-full overflow-visible">
            <path
              d={TOOTH_PATH}
              className={cn(
                "transition-[fill,stroke] duration-300",
                active ? "fill-accent stroke-accent" : "fill-white stroke-ink/25 group-hover:fill-pop group-focus-visible:fill-pop",
              )}
              strokeWidth={4}
              strokeLinejoin="round"
              style={{ filter: active ? "drop-shadow(0 8px 14px color-mix(in oklab, var(--accent) 55%, transparent))" : "drop-shadow(0 4px 6px rgba(0,0,0,0.08))" }}
            />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function Hero({ hero, avatars, services }: { hero: Settings["hero"]; avatars: Testimonial[]; services: Service[] }) {
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides: Slide[] = useMemo(
    () => [
      { key: "welcome", title: hero.caption || "Gentle, precise, beautifully calm.", sub: hero.titleEnd, image: hero.image, href: "/book" },
      ...services.slice(0, 7).map((s, i) => ({ key: s.id, title: s.title, sub: s.short, image: s.image, href: `/services/${s.slug}`, price: s.price, fdi: `1${i + 1} · 2${i + 1}` })),
    ],
    [hero.caption, hero.titleEnd, hero.image, services],
  );
  const slide = slides[active] ?? slides[0];

  // autoplay through treatments until the visitor takes over
  useEffect(() => {
    if (!play || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 3400);
    return () => clearInterval(t);
  }, [play, paused, slides.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const spread = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const domeScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const domeY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const pick = (pair: number) => {
    setPaused(true);
    setActive(Math.min(slides.length - 1, pair + 1));
  };

  return (
    <>
      <section ref={ref} className="relative overflow-x-clip pb-10 pt-6 md:pb-12 md:pt-10">
        {/* mobile headline (on desktop the headline lives inside the dome) */}
        <div className="container-x md:hidden">
          <motion.p initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : undefined} className="eyebrow flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent" /> {hero.eyebrow}
          </motion.p>
          <h1 className="display mt-4 text-[17vw] uppercase">
            <SplitWords text={hero.title} play={play} />
            <br />
            <SplitWords text={hero.highlight} play={play} delay={0.15} wordClassName="thin-word normal-case text-accent text-[0.62em]" />
          </h1>
        </div>

        <div className="container-x mt-6 md:mt-0">
          <div
            className="relative mx-auto aspect-[1/0.94] w-full max-w-[1080px] [--tw:7.4] md:aspect-[1080/600] md:[--tw:5.1]"
            onMouseLeave={() => setPaused(false)}
          >
            {/* arch guide lines */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
              {[0, 7, 14].map((d, i) => (
                <motion.ellipse
                  key={d}
                  cx="50"
                  cy={CY}
                  rx={RX + 4 + d * 0.55}
                  ry={RY + 6 + d}
                  fill="none"
                  stroke="var(--ink)"
                  strokeOpacity={0.1 - i * 0.025}
                  strokeWidth={0.15}
                  strokeDasharray={i ? "0.6 1.2" : undefined}
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={play ? { pathLength: 1 } : undefined}
                  transition={{ duration: 1.8, ease: EASE, delay: 0.1 + i * 0.15 }}
                />
              ))}
            </svg>

            {/* FDI tooth numbers */}
            {TEETH.map((t) => (
              <motion.span
                key={`n${t.i}`}
                style={{ left: `${r3(50 + (RX + 5.6) * t.cos)}%`, top: `${r3(CY + (RY + 11) * t.sin)}%`, opacity: fade }}
                className={cn(
                  "pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 text-[10.5px] font-semibold tabular-nums transition-colors md:block",
                  t.pair + 1 === active ? "text-accent" : "text-ink/30",
                )}
              >
                {t.fdi}
              </motion.span>
            ))}

            {/* teeth */}
            {TEETH.map((t) => (
              <Tooth key={t.i} t={t} play={play} spread={spread} active={t.pair + 1 === active} onPick={() => pick(t.pair)} />
            ))}

            {/* the dome: a window whose view changes with every tooth */}
            <motion.div
              style={{ scale: domeScale, y: domeY }}
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={play ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
              className="absolute bottom-0 left-1/2 h-[70%] w-[64%] origin-bottom -translate-x-1/2 overflow-hidden rounded-[50%_50%_0_0/100%_100%_0_0] bg-ink md:h-[76%] md:w-[66%]"
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={slide.key}
                  src={slide.image}
                  alt=""
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: EASE }}
                  className="absolute inset-0 size-full object-cover object-[50%_20%]"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10 md:via-ink/55 md:to-ink/30" />

              {/* desktop headline inside the dome */}
              <div className="absolute inset-x-0 top-[30%] hidden flex-col items-center px-8 text-center text-paper md:flex">
                <h1 className="display text-[clamp(3rem,6.6vw,6.4rem)] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
                  <SplitWords text={hero.title} play={play} delay={0.5} />
                  <br />
                  <SplitWords text={hero.highlight} play={play} delay={0.65} wordClassName="thin-word normal-case text-[0.72em] text-pop" />
                </h1>
              </div>

              {/* slide caption */}
              <div className="absolute inset-x-0 bottom-0 flex justify-center p-3 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div key={slide.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: EASE }}>
                    <Link href={slide.href} className="group flex max-w-[92%] items-center gap-3 rounded-full bg-paper py-1.5 pl-1.5 pr-4 text-ink shadow-xl md:max-w-none">
                      <span className="grid h-9 min-w-9 place-items-center rounded-full bg-accent px-2.5 text-[11px] font-bold text-white">{slide.fdi ? slide.fdi.split(" · ")[0] : "★"}</span>
                      <span className="min-w-0 leading-tight">
                        <span className="block truncate text-[13.5px] font-semibold md:text-[15px]">{slide.title}</span>
                        <span className="hidden truncate text-[12px] text-ink/55 md:block">{slide.price ?? slide.sub}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:rotate-45" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* progress ticks + hint */}
          <motion.div style={{ opacity: fade }} className="mt-5 flex items-center justify-center gap-3 text-[12px] font-medium text-ink/50">
            <span className="hidden md:inline">Hover a tooth</span>
            <span className="md:hidden">Tap a tooth</span>
            <span className="flex gap-1">
              {slides.map((s, i) => (
                <button key={s.key} onClick={() => { setPaused(true); setActive(i); }} aria-label={`Show ${s.title}`} className="grid h-4 place-items-center">
                  <span className={cn("block h-1 rounded-full transition-all duration-500", i === active ? "w-6 bg-accent" : "w-1.5 bg-ink/20")} />
                </button>
              ))}
            </span>
          </motion.div>

          {/* bottom row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            className="mt-8 grid items-center gap-5 border-t border-ink/10 pt-6 md:grid-cols-3 md:pr-20"
          >
            <p className="hidden max-w-sm text-[15px] leading-relaxed text-ink/60 md:block">{hero.subtitle}</p>
            <div className="flex flex-wrap items-center gap-2 md:justify-center">
              <Magnetic>
                <Link href="/book" className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-semibold text-paper">
                  <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                  <span className="relative">{hero.ctaPrimary}</span>
                  <span className="relative grid size-10 place-items-center rounded-full bg-accent text-white transition duration-500 group-hover:rotate-45 group-hover:bg-paper group-hover:text-ink">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </Magnetic>
              <Link href="/services" className="rounded-full px-5 py-4 text-[15px] font-semibold ring-1 ring-ink/15 transition hover:bg-ink hover:text-paper">
                {hero.ctaSecondary}
              </Link>
            </div>
            <div className="flex items-center gap-3 md:justify-end">
              <div className="flex -space-x-2.5">
                {avatars.slice(0, 4).map((a) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={a.id} src={a.avatar} alt="" className="size-9 rounded-full border-2 border-paper object-cover" />
                ))}
              </div>
              <div className="text-[13px] leading-tight">
                <span className="flex items-center gap-1 font-semibold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-accent text-accent" />
                  ))}
                  <span className="ml-1">{hero.rating}</span>
                </span>
                <span className="text-ink/55">{hero.reviews}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* treatment ticker */}
      <div className="relative overflow-hidden bg-ink py-5 text-paper">
        <div className="flex [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10" style={{ ["--marquee-speed" as string]: "45s" }}>
            {[...services, ...services].map((s, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap text-2xl md:text-4xl">
                <span className={i % 2 ? "thin-word text-paper/60" : "display"}>{s.title}</span>
                <svg viewBox="0 0 100 100" className="size-5 fill-accent">
                  <path d={TOOTH_PATH} />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
