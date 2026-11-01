"use client";

import type { Stat } from "@/lib/types";
import { Counter, Reveal } from "../motion";

/** Each number sits inside its own little orbit. */
export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
        {stats.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.08} className="group relative mx-auto aspect-square w-full max-w-[260px]">
            <div className="absolute inset-0 rounded-full border border-dashed border-ink/15 transition-transform duration-[2s] group-hover:rotate-90" />
            <div className="absolute inset-[9%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-[0_30px_60px_-30px_rgba(11,30,51,0.25)] ring-1 ring-ink/5">
              <Counter value={s.value} suffix={s.suffix} className="display text-[2.1rem] tabular-nums text-ink md:text-5xl" />
              <p className="mt-1.5 max-w-[80%] text-[12.5px] leading-snug text-ink/55 md:text-sm">{s.label}</p>
            </div>
            <span className="absolute left-[14.6%] top-[14.6%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-paper" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
