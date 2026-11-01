"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/types";
import { Icon } from "../icons";
import SectionHead from "./SectionHead";

function ServiceCard({ s, i }: { s: Service; i: number }) {
  return (
    <Link
      href={`/services/${s.slug}`}
      className="group relative flex h-[440px] w-[80vw] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-ink text-white sm:w-[360px] md:h-[clamp(380px,54vh,520px)] md:w-[380px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.image} alt={s.title} className="absolute inset-0 size-full object-cover opacity-80 transition-all duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
      <div className="relative flex items-center justify-between p-6">
        <span className="glass grid size-12 place-items-center rounded-2xl text-ink">
          <Icon name={s.icon} className="size-5" />
        </span>
        <span className="font-mono text-xs text-white/60">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div className="relative mt-auto p-6">
        <h3 className="text-3xl font-semibold tracking-[-0.03em]">{s.title}</h3>
        <p className="mt-2 max-w-[30ch] text-[15px] leading-snug text-white/70">{s.short}</p>
        <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
          <span className="text-sm text-white/80">
            {s.price} <span className="text-white/40">· {s.duration}</span>
          </span>
          <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Pinned horizontal scroll on desktop, native snap carousel on touch. */
export default function Services({ services }: { services: Service[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const measure = () => {
      setDesktop(mq.matches);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, [services.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const head = (
    <SectionHead
      eyebrow="Treatments"
      title="Everything your smile needs,"
      italic="under one roof."
      action={
        <Link href="/services" className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition hover:bg-ink hover:text-white">
          All treatments <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
        </Link>
      }
    />
  );

  if (!desktop) {
    return (
      <section ref={ref} className="py-20">
        <div className="container-x">{head}</div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4" data-lenis-prevent-touch>
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} />
          ))}
          <div className="w-1 shrink-0" />
        </div>
        <div ref={track} />
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        <div className="container-x">{head}</div>
        <motion.div ref={track} style={{ x }} className="mt-8 flex gap-5 pl-[max(2rem,calc((100vw-1320px)/2+2rem))] pr-8">
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} />
          ))}
        </motion.div>
        <div className="container-x mt-8">
          <div className="h-px w-full bg-line">
            <motion.div style={{ width: bar }} className="h-px bg-ink" />
          </div>
        </div>
      </div>
    </section>
  );
}
