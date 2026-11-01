"use client";

import { motion } from "framer-motion";
import type { Doctor } from "@/lib/types";
import { EASE } from "../motion";
import SectionHead from "./SectionHead";

export function DoctorCard({ d, i }: { d: Doctor; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: EASE, delay: (i % 4) * 0.08 }}
      className="group w-[75vw] shrink-0 snap-start sm:w-auto"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-accent-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.image} alt={d.name} className="size-full object-cover grayscale-[40%] transition-all duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0" />
        <div className="absolute inset-x-3 bottom-3 translate-y-[calc(100%-2.75rem)] rounded-2xl bg-white/85 p-4 backdrop-blur-xl transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
          <div className="flex h-5 items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-muted">{d.experience} experience</span>
            <span className="size-2 rounded-full bg-accent" />
          </div>
          <p className="mt-3 text-sm leading-snug text-ink/80">{d.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.specialties.map((s) => (
              <span key={s} className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px]">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{d.name}</h3>
      <p className="text-sm text-muted">{d.role}</p>
    </motion.article>
  );
}

export default function Doctors({ doctors }: { doctors: Doctor[] }) {
  return (
    <section className="py-20 md:py-32">
      <div className="container-x">
        <SectionHead eyebrow="The specialists" title="Gentle hands." italic="Brilliant minds." text="A team of specialists who trained at the world's best institutions — and who genuinely love what they do." />
      </div>
      <div className="no-scrollbar container-x mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
        {doctors.map((d, i) => (
          <DoctorCard key={d.id} d={d} i={i} />
        ))}
      </div>
    </section>
  );
}
