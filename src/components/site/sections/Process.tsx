"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import type { Step } from "@/lib/types";
import SectionHead from "./SectionHead";

function Card({ step, i, total, progress }: { step: Step; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i) * 0.04]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, i === total - 1 ? 0 : 0.05]);
  return (
    <div className="sticky top-0 flex h-[88vh] items-start justify-center pt-[10vh] md:h-screen md:pt-[14vh]" style={{ top: `${i * 18}px` }}>
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className="relative grid w-full overflow-hidden rounded-[32px] bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] ring-1 ring-line md:h-[64vh] md:grid-cols-2"
      >
        <div className="flex flex-col p-7 md:p-12">
          <span className="font-mono text-xs text-muted">
            Step {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h3 className="display mt-6 text-[2.2rem] md:mt-auto md:text-6xl">{step.title}</h3>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">{step.text}</p>
        </div>
        <div className="relative h-56 md:h-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={step.image} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="display absolute bottom-4 right-6 text-[7rem] text-white/90 mix-blend-overlay md:text-[12rem]">{i + 1}</span>
        </div>
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-ink" />
      </motion.article>
    </div>
  );
}

export default function Process({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHead eyebrow="Your visit" title="Four calm steps to a" italic="better smile." text="No jargon, no surprises. Here's exactly what happens when you choose us." />
      <div ref={ref} className="relative mt-6">
        {steps.map((s, i) => (
          <Card key={s.id} step={s} i={i} total={steps.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
