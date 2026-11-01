"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useRef } from "react";
import { EASE, Magnetic, SplitWords, useIntroDone } from "../motion";
import { OrbitBackdrop, OrbitBubbles, Pill, SmileLine } from "../Orbit";
import type { HeroProps } from "./types";

/** Smile Orbit — calm centred type, a hand-drawn smile line and orbiting portraits. */
export default function HeroOrbit({ hero, avatars, doctors, services }: HeroProps) {
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const spin = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const bubbles = [
    { img: hero.image, label: "Smile makeover" },
    { img: doctors[0]?.image, label: doctors[0]?.name },
    { img: services[0]?.image, label: services[0]?.title },
    { img: avatars[0]?.avatar, label: `“${avatars[0]?.role}”` },
    { img: doctors[2]?.image, label: doctors[2]?.role },
    { img: services[1]?.image, label: services[1]?.title },
    { img: avatars[2]?.avatar, label: "5★ review" },
    { img: services[3]?.image, label: services[3]?.title },
  ];

  return (
    <section ref={ref} className="relative flex h-[calc(100dvh-44px)] min-h-[660px] items-center justify-center overflow-hidden">
      <motion.div style={{ rotate: spin, scale, opacity: fade }} className="pointer-events-none absolute inset-0">
        <OrbitBackdrop />
        <OrbitBubbles items={bubbles} play={play} />
      </motion.div>

      {/* floating trust chips */}
      <motion.div style={{ opacity: fade }} className="pointer-events-none absolute inset-x-0 bottom-10 hidden justify-between px-10 md:flex">
        <motion.span initial={{ opacity: 0, x: -20 }} animate={play ? { opacity: 1, x: 0 } : undefined} transition={{ delay: 1.2, duration: 0.8 }} className="flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-3 text-[13px] font-medium shadow-sm ring-1 ring-ink/5 backdrop-blur">
          <ShieldCheck className="size-4 text-accent" /> Hospital-grade sterilisation
        </motion.span>
        <motion.span initial={{ opacity: 0, x: 20 }} animate={play ? { opacity: 1, x: 0 } : undefined} transition={{ delay: 1.3, duration: 0.8 }} className="mr-16 flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-3 text-[13px] font-medium shadow-sm ring-1 ring-ink/5 backdrop-blur">
          <Sparkles className="size-4 text-accent" /> Free 3D smile scan on first visit
        </motion.span>
      </motion.div>

      <motion.div style={{ y: copyY }} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={play ? { opacity: 1, y: 0 } : undefined}>
          <Pill>{hero.eyebrow}</Pill>
        </motion.div>
        <h1 className="display mt-6 text-[15vw] md:text-[clamp(4rem,8vw,8.6rem)]">
          <SplitWords text={hero.title} play={play} delay={0.15} />
          <br />
          <SmileLine play={play} delay={0.9}>
            <SplitWords text={hero.highlight} play={play} delay={0.3} wordClassName="thin-word text-accent" />
          </SmileLine>
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
      </motion.div>
    </section>
  );
}
