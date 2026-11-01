"use client";

import type { Stat } from "@/lib/types";
import { Counter, Reveal } from "../motion";

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.08} className="border-b border-r border-line p-5 md:p-8">
            <p className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</p>
            <Counter value={s.value} suffix={s.suffix} className="display mt-8 block text-[2.6rem] tabular-nums md:mt-16 md:text-6xl" />
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
