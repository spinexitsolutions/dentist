"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, ["blur(3px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className="mr-[0.25em] inline-block">
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
        <p className="eyebrow mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-ink/30" /> Our philosophy
        </p>
        <p className="text-[1.9rem] font-medium leading-[1.15] tracking-[-0.035em] md:text-[3.4rem]">
          {words.map((w, i) => {
            const start = i / words.length;
            return <Word key={i} word={w} progress={scrollYProgress} range={[start, Math.min(1, start + 2 / words.length)]} />;
          })}
        </p>
      </div>
    </section>
  );
}
