"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn, openStatus } from "@/lib/utils";
import { EASE, SplitWords, useIntroDone } from "../motion";
import type { HeroProps } from "./types";

/** Design 3 — full-screen clinic film-still with a glass quick-booking card. */
export default function HeroCinematic({ hero, services, contact }: HeroProps) {
  const play = useIntroDone();
  const router = useRouter();
  const [service, setService] = useState(services[0]?.title ?? "");
  const [day, setDay] = useState(0);
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  const [days, setDays] = useState<{ label: string; date: number }[]>([]);

  useEffect(() => {
    setStatus(openStatus(contact.hours));
    const out: { label: string; date: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({ label: i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-IN", { weekday: "short" }), date: d.getDate() });
    }
    setDays(out);
  }, [contact.hours]);

  const href = useMemo(() => `/book?service=${encodeURIComponent(service)}`, [service]);

  return (
    <section className="relative min-h-[calc(100dvh-44px)] overflow-hidden bg-ink text-white md:h-[calc(100dvh-44px)] md:min-h-[680px]">
      <motion.img
        src={hero.wideImage}
        alt="Inside the studio"
        initial={{ scale: 1.25 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 14, ease: "linear" }}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />

      <div className="container-x relative flex min-h-[calc(100dvh-44px)] flex-col justify-end gap-8 pb-28 pt-28 md:h-full md:min-h-0 md:flex-row md:items-end md:justify-between md:pb-14 md:pt-0">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={play ? { opacity: 1, y: 0 } : undefined} className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">{hero.eyebrow}</span>
            {status && (
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                <span className={cn("size-1.5 rounded-full", status.open ? "bg-green-400" : "bg-amber-300")} />
                {status.label}
              </span>
            )}
          </motion.div>
          <h1 className="display mt-6 text-[14vw] md:text-[clamp(4rem,7.6vw,8rem)]">
            <SplitWords text={hero.title} play={play} delay={0.15} />
            <br />
            <SplitWords text={hero.highlight} play={play} delay={0.3} wordClassName="thin-word text-pop" />
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : undefined} transition={{ delay: 0.6 }} className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/70">
            {hero.subtitle}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : undefined} transition={{ delay: 0.8 }} className="mt-6 flex items-center gap-2 text-[14px] text-white/80">
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-pop text-pop" />
              ))}
            </span>
            {hero.rating} · {hero.reviews}
          </motion.p>
        </div>

        {/* quick booking */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            router.push(href);
          }}
          className="w-full shrink-0 rounded-[28px] bg-white/12 p-5 ring-1 ring-white/20 backdrop-blur-2xl md:w-[380px]"
        >
          <p className="text-lg font-semibold tracking-tight">Book in 30 seconds</p>
          <p className="text-[13px] text-white/60">Free 3D smile scan on your first visit</p>
          <label className="mt-5 block text-[12px] font-medium text-white/60">Treatment</label>
          <select value={service} onChange={(e) => setService(e.target.value)} className="mt-1.5 w-full rounded-2xl bg-white px-4 py-3 text-[15px] font-medium text-ink outline-none">
            {services.map((s) => (
              <option key={s.id}>{s.title}</option>
            ))}
            <option>General check-up</option>
          </select>
          <label className="mt-4 block text-[12px] font-medium text-white/60">Preferred day</label>
          <div className="mt-1.5 grid grid-cols-5 gap-1.5">
            {days.map((d, i) => (
              <button type="button" key={i} onClick={() => setDay(i)} className={cn("rounded-xl py-2 text-center transition", day === i ? "bg-white text-ink" : "bg-white/10 hover:bg-white/20")}>
                <span className="block text-[10.5px] opacity-70">{d.label}</span>
                <span className="text-base font-semibold">{d.date}</span>
              </button>
            ))}
          </div>
          <button className="group mt-5 flex w-full items-center justify-between rounded-full bg-accent py-2 pl-5 pr-2 text-[15px] font-semibold transition hover:bg-white hover:text-ink">
            {hero.ctaPrimary}
            <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-4" />
            </span>
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-white/50">
            <Clock className="size-3.5" /> Usually confirmed within 15 minutes
          </p>
        </motion.form>
      </div>
    </section>
  );
}
