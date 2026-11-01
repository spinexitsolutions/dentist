"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useRef } from "react";
import type { Settings } from "@/lib/types";
import { Reveal, SplitWords } from "../motion";

export default function About({ about, brand }: { about: Settings["about"]; brand: Settings["brand"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-30, 90]);

  return (
    <section ref={ref} className="container-x py-20 md:py-36">
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <div className="relative order-2 md:order-1">
          <motion.div style={{ y: y1 }} className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-[32px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={about.image} alt="The studio" className="size-full object-cover" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute -bottom-6 right-0 aspect-square w-[46%] overflow-hidden rounded-[28px] border-[6px] border-paper shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={about.image2} alt="Treatment in progress" className="size-full object-cover" />
          </motion.div>
          <div className="absolute -top-8 right-[10%] grid size-32 place-items-center md:size-36">
            <motion.svg style={{ rotate }} viewBox="0 0 100 100" className="absolute inset-0 size-full">
              <defs>
                <path id="about-circ" d="M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1 -80 0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="var(--accent)" />
              <text fontSize="8.6" letterSpacing="2" fill="white" fontFamily="var(--font-geist-mono)">
                <textPath href="#about-circ">{`${brand.shortName.toUpperCase()} · SINCE 2009 · CARE · CRAFT · `}</textPath>
              </text>
            </motion.svg>
            <span className="relative text-center text-white">
              <span className="display block text-4xl">{about.years}</span>
              <span className="text-[10px] uppercase tracking-widest">years</span>
            </span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-ink/30" />
              {about.eyebrow}
            </p>
          </Reveal>
          <h2 className="display mt-5 text-[2.5rem] md:text-[4rem]">
            <SplitWords text={about.title} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">{about.body}</p>
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {about.points.map((p, i) => (
              <Reveal key={p} delay={0.1 + i * 0.06}>
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3.5 text-[15px]">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.3}>
            <Link href="/team" className="group mt-10 inline-flex items-center gap-2 text-[15px] font-medium">
              Meet the specialists
              <span className="grid size-9 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
