"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Pill } from "../Orbit";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

/** Apple-style paragraph that lights up word by word as you scroll. */
export default function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <section className="container-x py-28 md:py-44">
      <div ref={ref} className="mx-auto max-w-5xl">
        <div className="mb-8 flex justify-center">
          <Pill>Our philosophy</Pill>
        </div>
        <p className="font-[family-name:var(--font-bricolage)] text-[1.9rem] font-medium [font-variation-settings:'wdth'_80] leading-[1.12] tracking-[-0.04em] text-center md:text-[3.5rem]">
          {words.map((w, i) => {
            const start = i / words.length;
            return <Word key={i} word={w} progress={scrollYProgress} range={[start, Math.min(1, start + 2 / words.length)]} />;
          })}
        </p>
      </div>
    </section>
  );
}
