"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { EASE, Magnetic, SplitWords, useIntroDone } from "../motion";
import { Icon } from "../icons";
import type { HeroProps } from "./types";

const tile = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: EASE, delay: 0.1 + i * 0.08 } }),
};

/** Design 1 — Apple-like bento grid. */
export default function HeroBento({ hero, avatars, services }: HeroProps) {
  const play = useIntroDone();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % Math.max(1, services.length)), 2600);
    return () => clearInterval(t);
  }, [services.length]);
  const s = services[i];

  return (
    <section className="container-x pb-6 pt-4 md:pt-6">
      <div className="grid gap-3 md:h-[calc(100dvh-90px)] md:min-h-[620px] md:grid-cols-12 md:grid-rows-6">
        {/* headline tile */}
        <motion.div custom={0} variants={tile} initial="hidden" animate={play ? "show" : "hidden"} className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white p-6 ring-1 ring-ink/5 md:col-span-7 md:row-span-4 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-pop/50 blur-3xl" />
          <p className="relative flex items-center gap-2 text-[13px] font-medium text-ink/60">
            <span className="size-1.5 rounded-full bg-accent" /> {hero.eyebrow}
          </p>
          <div className="relative mt-10 md:mt-0">
            <h1 className="display text-[15vw] md:text-[clamp(3.6rem,6.4vw,6.8rem)]">
              <SplitWords text={hero.title} play={play} delay={0.2} />{" "}
              <SplitWords text={hero.highlight} play={play} delay={0.32} wordClassName="thin-word text-accent" />
            </h1>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink/60">{hero.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Magnetic>
                <Link href="/book" className="group flex items-center gap-3 rounded-full bg-accent py-2 pl-6 pr-2 text-[15px] font-semibold text-white transition hover:bg-ink">
                  {hero.ctaPrimary}
                  <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </Magnetic>
              <Link href="/services" className="rounded-full px-5 py-4 text-[15px] font-semibold ring-1 ring-ink/15 transition hover:bg-ink hover:text-white">
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* portrait tile */}
        <motion.div custom={1} variants={tile} initial="hidden" animate={play ? "show" : "hidden"} className="group relative min-h-[460px] overflow-hidden rounded-[32px] bg-accent md:col-span-5 md:row-span-6 md:min-h-0">
          <motion.img src={hero.image} alt="Smiling patient" initial={{ scale: 1.2 }} animate={play ? { scale: 1 } : undefined} transition={{ duration: 1.8, ease: EASE }} className="absolute inset-0 size-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          <motion.div initial={{ opacity: 0, x: -20 }} animate={play ? { opacity: 1, x: 0 } : undefined} transition={{ delay: 0.9, duration: 0.8, ease: EASE }} className="glass absolute left-4 top-4 flex items-center gap-2.5 rounded-2xl py-2 pl-2 pr-4">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-white">
              <ShieldCheck className="size-4" />
            </span>
            <span className="text-[13px] font-semibold leading-tight">
              Painless care
              <span className="block font-normal text-ink/60">Laser & sedation options</span>
            </span>
          </motion.div>
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 pl-4 backdrop-blur">
            <span className="flex items-center gap-3 text-[13px] leading-tight">
              <CalendarCheck className="size-5 text-accent" />
              <span>
                <span className="block text-ink/55">Next available</span>
                <b className="font-semibold">Today · 4:30 PM</b>
              </span>
            </span>
            <Link href="/book" className="rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-white">
              Reserve
            </Link>
          </div>
        </motion.div>

        {/* rating tile */}
        <motion.div custom={2} variants={tile} initial="hidden" animate={play ? "show" : "hidden"} className="flex flex-col justify-between rounded-[32px] bg-ink p-6 text-white md:col-span-3 md:row-span-2">
          <div className="flex -space-x-2.5">
            {avatars.slice(0, 4).map((a) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={a.id} src={a.avatar} alt="" className="size-9 rounded-full border-2 border-ink object-cover" />
            ))}
          </div>
          <div className="mt-6">
            <p className="display text-6xl">{hero.rating}</p>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-white/60">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="size-3 fill-pop text-pop" />
              ))}
              <span className="ml-1">{hero.reviews}</span>
            </p>
          </div>
        </motion.div>

        {/* rotating treatment tile */}
        <motion.div custom={3} variants={tile} initial="hidden" animate={play ? "show" : "hidden"} className="relative overflow-hidden rounded-[32px] bg-pop/60 p-6 md:col-span-4 md:row-span-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/50">Popular treatments</p>
          {s && (
              <motion.div key={s.id} variants={{ a: { opacity: 0, y: 20 }, b: { opacity: 1, y: 0 } }} initial="a" animate="b" transition={{ duration: 0.5, ease: EASE }}>
                <Link href={`/services/${s.slug}`} className="group mt-4 flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-accent shadow-sm">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xl font-semibold tracking-tight">{s.title}</span>
                    <span className="text-[13px] text-ink/60">
                      {s.price} · {s.duration}
                    </span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:rotate-45" />
                </Link>
              </motion.div>
            )}
          <div className="absolute bottom-5 left-6 flex gap-1">
            {services.map((x, k) => (
              <span key={x.id} className={`h-1 rounded-full transition-all duration-500 ${k === i ? "w-5 bg-ink" : "w-1.5 bg-ink/20"}`} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
