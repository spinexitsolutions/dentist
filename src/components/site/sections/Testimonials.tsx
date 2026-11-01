"use client";

import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { Reveal } from "../motion";
import SectionHead from "./SectionHead";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[300px] shrink-0 rounded-[24px] bg-white/[.06] p-6 ring-1 ring-white/10 md:w-[380px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <Quote className="size-5 text-accent" />
      </div>
      <blockquote className="mt-4 text-[15.5px] leading-relaxed text-white/85">“{t.text}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.avatar} alt="" className="size-10 rounded-full object-cover" />
        <span className="text-sm">
          <b className="block font-medium">{t.name}</b>
          <span className="text-white/50">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials({ items, rating, reviews }: { items: Testimonial[]; rating: string; reviews: string }) {
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half).length ? items.slice(half) : items];
  return (
    <section className="relative overflow-hidden rounded-[36px] bg-ink py-20 text-white md:mx-4 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[140px]" />
      <div className="container-x relative">
        <SectionHead
          dark
          eyebrow="Kind words"
          title="Loved by patients,"
          italic="trusted by families."
          action={
            <Reveal className="flex items-end gap-4">
              <span className="display text-7xl md:text-8xl">
                {rating}
              </span>
              <span className="pb-2 text-sm text-white/60">
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                {reviews}
              </span>
            </Reveal>
          }
        />
      </div>
      <div className="marquee-paused relative mt-14 flex flex-col gap-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            <div className={`${r ? "animate-marquee-rev" : "animate-marquee"} flex shrink-0 gap-4 pr-4`} style={{ ["--marquee-speed" as string]: `${50 + r * 10}s` }}>
              {[...row, ...row, ...row].map((t, i) => (
                <Card key={i} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
