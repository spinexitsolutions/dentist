"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Feature } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Icon } from "../icons";
import { Reveal } from "../motion";
import SectionHead from "./SectionHead";

function Tile({ f, big, className }: { f: Feature; big?: boolean; className?: string }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      className={cn("group relative flex min-h-[200px] flex-col overflow-hidden rounded-[28px] p-6 md:min-h-[260px] md:p-8", big ? "bg-ink text-white" : "bg-card ring-1 ring-line", className)}
    >
      {big && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.image} alt="" className="absolute inset-0 size-full object-cover opacity-50 transition-transform duration-[1.5s] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </>
      )}
      <span className={cn("relative grid size-12 place-items-center rounded-2xl", big ? "glass text-ink" : "bg-accent-soft text-accent-deep")}>
        <Icon name={f.icon} className="size-5" />
      </span>
      <div className="relative mt-auto pt-10">
        <h3 className={cn("font-semibold tracking-[-0.03em]", big ? "text-3xl md:text-5xl" : "text-2xl")}>{f.title}</h3>
        <p className={cn("mt-2 max-w-md text-[15px] leading-relaxed", big ? "text-white/70" : "text-muted")}>{f.text}</p>
      </div>
    </motion.div>
  );
}

export default function Technology({ features }: { features: Feature[] }) {
  const [first, ...rest] = features;
  if (!first) return null;
  return (
    <section className="container-x py-20 md:py-32">
      <SectionHead eyebrow="Technology" title="Precision you can" italic="actually feel." text="We invest in the tools that make treatment faster, gentler and more predictable." />
      <div className="mt-12 grid gap-4 md:grid-cols-4 md:grid-rows-2">
        <Reveal className="md:col-span-2 md:row-span-2">
          <Tile f={first} big className="h-full min-h-[420px]" />
        </Reveal>
        {rest.map((f, i) => (
          <Reveal key={f.id} delay={0.08 * (i + 1)}>
            <Tile f={f} className="h-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
