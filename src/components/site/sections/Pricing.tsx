"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Plan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "../motion";
import SectionHead from "./SectionHead";

export default function Pricing({ plans, insurers }: { plans: Plan[]; insurers: string[] }) {
  return (
    <section className="container-x py-20 md:py-32">
      <SectionHead eyebrow="Membership" title="Care plans that" italic="pay for themselves." text="Predictable monthly pricing, priority booking and generous savings on every treatment." />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <div className={cn("relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 md:p-8", p.highlighted ? "bg-ink text-white" : "bg-card ring-1 ring-line")}>
              {p.highlighted && <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-accent/40 blur-3xl" />}
              <div className="relative flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">{p.name}</h3>
                {p.highlighted && <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium">Most popular</span>}
              </div>
              <p className={cn("relative mt-2 text-sm", p.highlighted ? "text-white/60" : "text-muted")}>{p.description}</p>
              <p className="relative mt-8 flex items-baseline gap-1">
                <span className="display text-6xl">{p.price}</span>
                <span className={cn("text-sm", p.highlighted ? "text-white/50" : "text-muted")}>{p.period}</span>
              </p>
              <ul className="relative mt-8 space-y-3 text-[15px]">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className={cn("mt-0.5 size-4 shrink-0", p.highlighted ? "text-accent" : "text-accent-deep")} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/book?plan=${encodeURIComponent(p.name)}`}
                className={cn(
                  "group relative mt-10 flex items-center justify-between rounded-full py-2 pl-5 pr-2 text-[15px] font-medium transition",
                  p.highlighted ? "bg-white text-ink hover:bg-accent hover:text-white" : "bg-ink text-white hover:bg-accent",
                )}
              >
                Join {p.name}
                <span className={cn("grid size-9 place-items-center rounded-full transition-transform group-hover:rotate-45", p.highlighted ? "bg-ink text-white" : "bg-white text-ink")}>
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
      {insurers.length > 0 && (
        <div className="mt-14 flex flex-col items-center gap-5 md:flex-row">
          <p className="eyebrow shrink-0">Insurance partners</p>
          <div className="flex w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee flex shrink-0 gap-12 pr-12" style={{ ["--marquee-speed" as string]: "30s" }}>
              {[...insurers, ...insurers].map((n, i) => (
                <span key={i} className="whitespace-nowrap text-lg font-semibold tracking-tight text-ink/40">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
