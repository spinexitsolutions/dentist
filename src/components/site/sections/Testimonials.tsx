"use client";

import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { Reveal } from "../motion";
import { OrbitBackdrop, OrbitBubbles } from "../Orbit";
import SectionHead from "./SectionHead";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[300px] shrink-0 rounded-[26px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(11,30,51,0.3)] ring-1 ring-ink/5 md:w-[380px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-accent text-accent" />
          ))}
        </div>
        <Quote className="size-5 text-pop" />
      </div>
      <blockquote className="mt-4 text-[15.5px] leading-relaxed text-ink/80">“{t.text}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.avatar} alt="" className="size-10 rounded-full object-cover ring-2 ring-pop" />
        <span className="text-sm">
          <b className="block font-semibold">{t.name}</b>
          <span className="text-ink/50">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials({ items, rating, reviews }: { items: Testimonial[]; rating: string; reviews: string }) {
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half).length ? items.slice(half) : items];
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <OrbitBackdrop />
      <div className="container-x relative">
        <SectionHead eyebrow="Kind words" title="Loved by patients," italic="trusted by families." />
        {/* rating orb with orbiting reviewers */}
        <Reveal className="relative mx-auto mt-12 size-[300px] md:size-[380px]">
          <div className="absolute inset-[6%] rounded-full border border-dashed border-ink/15" />
          <OrbitBubbles items={items.slice(0, 6).map((t) => ({ img: t.avatar }))} rx={47} ry={47} sizes={[58, 46]} mobileScale={0.8} speed={60} labels={false} />
          <div className="absolute inset-[24%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-[0_30px_70px_-30px_rgba(11,30,51,0.35)] ring-1 ring-ink/5">
            <span className="display text-6xl md:text-7xl">{rating}</span>
            <span className="mt-1 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-accent text-accent" />
              ))}
            </span>
            <span className="mt-1 text-[12px] text-ink/55">{reviews}</span>
          </div>
        </Reveal>
      </div>
      <div className="marquee-paused relative mt-14 flex flex-col gap-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="flex overflow-hidden py-2">
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
