"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { useRef } from "react";
import type { Settings, Testimonial } from "@/lib/types";
import { EASE, Magnetic, SplitWords, useIntroDone } from "../motion";
import { ToothMark } from "../icons";

export default function Hero({ hero, avatars, serviceTitles }: { hero: Settings["hero"]; avatars: Testimonial[]; serviceTitles: string[] }) {
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <>
      <section ref={ref} className="relative overflow-x-clip pb-14 pt-10 md:pb-20 md:pt-14">
        {/* soft accent glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="container-x relative grid items-end gap-10 md:grid-cols-12 md:gap-8">
          <motion.div style={{ y: textY, opacity: fade }} className="md:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={play ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-3 py-1.5 text-xs text-muted backdrop-blur"
            >
              <span className="size-1.5 rounded-full bg-accent" />
              {hero.eyebrow}
            </motion.span>

            <h1 className="display mt-6 text-[17vw] sm:text-[13vw] md:text-[6.2rem] lg:text-[7.4rem]">
              <SplitWords text={hero.title} play={play} delay={0.05} />
              <br />
              <SplitWords text={hero.highlight} play={play} delay={0.18} wordClassName="serif-i text-accent pr-2" />
              <br className="md:hidden" /> <SplitWords text={hero.titleEnd} play={play} delay={0.3} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 0.55 }}
              className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted md:text-lg"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={play ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 0.7 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Link href="/book" className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white">
                  <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                  <span className="relative">{hero.ctaPrimary}</span>
                  <span className="relative grid size-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </Magnetic>
              <Link href="/services" className="group flex items-center gap-2 rounded-full px-5 py-4 text-[15px] font-medium">
                <span className="relative">
                  {hero.ctaSecondary}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : undefined}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {avatars.slice(0, 4).map((a) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={a.id} src={a.avatar} alt="" className="size-10 rounded-full border-2 border-paper object-cover" />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 font-semibold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1">{hero.rating}</span>
                </div>
                <p className="text-muted">{hero.reviews}</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative md:col-span-5">
            <motion.div
              initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 40px 40px)" }}
              animate={play ? { clipPath: "inset(0% 0% 0% 0% round 999px 999px 40px 40px)" } : undefined}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
              className="relative aspect-[4/5] overflow-hidden rounded-b-[40px] rounded-t-full bg-accent-soft"
            >
              <motion.img
                src={hero.image}
                alt="Smiling patient"
                style={{ y: imgY }}
                initial={{ scale: 1.35 }}
                animate={play ? { scale: 1.12 } : undefined}
                transition={{ duration: 1.8, ease: EASE, delay: 0.15 }}
                className="absolute inset-0 size-full object-cover"
              />
            </motion.div>

            {/* floating chips */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={play ? { opacity: 1, x: 0, scale: 1 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 1 }}
              className="glass absolute -left-3 top-[22%] flex items-center gap-3 rounded-2xl p-3 pr-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)] md:-left-12"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-white">
                <Sparkles className="size-5" strokeWidth={1.5} />
              </span>
              <span className="text-sm leading-tight">
                <b className="block font-semibold">Painless laser care</b>
                <span className="text-muted">No drills, no fear</span>
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={play ? { opacity: 1, x: 0, scale: 1 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 1.15 }}
              className="glass absolute -right-2 bottom-[14%] rounded-2xl p-3.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)] md:-right-6"
            >
              <p className="eyebrow">Next available</p>
              <p className="mt-1 text-sm font-semibold">Today · 4:30 PM</p>
              <div className="mt-2 flex gap-1">
                {[1, 1, 1, 0, 1, 0, 0].map((v, i) => (
                  <span key={i} className={`h-5 w-2 rounded-full ${v ? "bg-accent" : "bg-ink/10"}`} />
                ))}
              </div>
            </motion.div>

            {/* rotating badge */}
            <Link href="/book" className="absolute -bottom-8 left-6 grid size-28 place-items-center md:-left-10 md:bottom-10" aria-label="Book a free 3D scan">
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <path id="circ" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
                </defs>
                <circle cx="50" cy="50" r="49" fill="var(--ink)" />
                <text fontSize="9" letterSpacing="2.2" fill="white" fontFamily="var(--font-geist-mono)">
                  <textPath href="#circ">FREE 3D SCAN ✦ BOOK TODAY ✦ </textPath>
                </text>
              </motion.svg>
              <ToothMark className="relative size-8 text-accent" />
            </Link>
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="relative border-y border-line bg-paper py-5">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10" style={{ ["--marquee-speed" as string]: "45s" }}>
            {[...serviceTitles, ...serviceTitles].map((t, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap text-2xl font-medium tracking-tight md:text-4xl">
                {i % 2 ? <span className="serif-i text-muted">{t}</span> : t}
                <ToothMark className="size-5 text-accent" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function ExpandImage({ image, caption }: { image: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const clip = useTransform(scrollYProgress, (v) => {
    const k = 1 - Math.min(1, Math.max(0, (v - 0.1) / 0.75));
    return `inset(${k * 12}% ${k * 16}% ${k * 12}% ${k * 16}% round ${16 + k * 40}px)`;
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.55, 0.95], [60, 0]);

  return (
    <div ref={ref} className="relative h-[170vh]">
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.img src={image} alt="Inside the studio" style={{ scale }} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </motion.div>
        <motion.div style={{ opacity: textOpacity, y: textY }} className="container-x relative mt-auto pb-24 text-white md:pb-20">
          <p className="eyebrow !text-white/60">Inside the studio</p>
          <p className="display mt-4 max-w-4xl text-4xl md:text-7xl">
            {caption.split("*").map((part, i) => (i % 2 ? <span key={i} className="serif-i">{part}</span> : part))}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
