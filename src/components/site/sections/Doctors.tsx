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
      className="group flex w-[72vw] shrink-0 snap-start flex-col items-center text-center sm:w-auto"
    >
      <div className="relative aspect-square w-full max-w-[260px]">
        <div className="absolute inset-0 rounded-full border border-dashed border-ink/15 transition-transform duration-[2.5s] ease-[var(--ease-out-expo)] group-hover:rotate-180" />
        <span className="absolute left-[14.6%] top-[14.6%] z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-paper" />
        <div className="absolute inset-[7%] overflow-hidden rounded-full bg-pop/40 shadow-[0_30px_60px_-30px_rgba(11,30,51,0.4)] ring-[6px] ring-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.image} alt={d.name} className="size-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110" />
        </div>
        <span className="absolute bottom-[6%] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[12px] font-semibold shadow ring-1 ring-ink/5">{d.experience} experience</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{d.name}</h3>
      <p className="text-sm text-accent">{d.role}</p>
      <p className="mt-2 line-clamp-3 max-w-[30ch] text-[14px] leading-snug text-ink/55">{d.bio}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {d.specialties.map((s) => (
          <span key={s} className="rounded-full bg-white px-2.5 py-1 text-[11.5px] ring-1 ring-ink/5">
            {s}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function Doctors({ doctors }: { doctors: Doctor[] }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container-x">
        <SectionHead eyebrow="The specialists" title="Gentle hands." italic="Brilliant minds." text="A team of specialists who trained at the world's best institutions — and who genuinely love what they do." />
      </div>
      <div className="no-scrollbar container-x mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
        {doctors.map((d, i) => (
          <DoctorCard key={d.id} d={d} i={i} />
        ))}
      </div>
    </section>
  );
}
