"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { useRef } from "react";
import type { Settings } from "@/lib/types";
import { Magnetic, SplitWords } from "../motion";
import { OrbitBackdrop, OrbitBubbles, Pill, SmileLine } from "../Orbit";

export default function Cta({ cta, contact, images = [] }: { cta: Settings["cta"]; contact: Settings["contact"]; images?: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.94, 1]);
  const words = cta.title.split(" ");
  const last = words.pop() ?? "";
  return (
    <section ref={ref} className="px-3 py-10 md:px-4">
      <motion.div style={{ scale }} className="relative flex min-h-[86vh] items-center justify-center overflow-hidden rounded-[40px] bg-ink py-24 text-white">
        <motion.div style={{ rotate }} className="pointer-events-none absolute inset-0">
          <OrbitBackdrop dark />
          <OrbitBubbles items={[cta.image, ...images].slice(0, 8).map((img) => ({ img }))} labels={false} sizes={[96, 72, 60]} mobileScale={0.55} speed={120} />
        </motion.div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Pill dark>Book in 60 seconds</Pill>
          <h2 className="display mt-6 text-[2.8rem] md:text-[5.6rem]">
            <SplitWords text={words.join(" ")} />{" "}
            <SmileLine delay={0.8}>
              <SplitWords text={last} wordClassName="thin-word text-pop" delay={0.2} />
            </SmileLine>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">{cta.subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Link href="/book" className="group flex items-center gap-3 rounded-full bg-white py-2 pl-7 pr-2 text-base font-semibold text-ink transition hover:bg-pop">
                Book your visit
                <span className="grid size-12 place-items-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </Magnetic>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-full px-6 py-4 text-white/80 ring-1 ring-white/20 transition hover:bg-white/10">
              <Phone className="size-4" /> {contact.phone}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
