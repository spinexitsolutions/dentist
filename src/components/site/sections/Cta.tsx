"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Settings } from "@/lib/types";
import { Magnetic, SplitWords } from "../motion";

export default function Cta({ cta, contact }: { cta: Settings["cta"]; contact: Settings["contact"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  return (
    <section ref={ref} className="px-3 py-10 md:px-4">
      <motion.div style={{ scale }} className="relative overflow-hidden rounded-[36px] bg-ink text-white">
        <motion.img src={cta.image} alt="" style={{ y }} className="absolute inset-0 h-[130%] w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/70 to-transparent" />
        <div className="container-x relative flex min-h-[78vh] flex-col justify-end py-14 md:py-20">
          <p className="eyebrow !text-white/50">Book in 60 seconds</p>
          <h2 className="display mt-5 max-w-5xl text-[2.8rem] md:text-[6rem]">
            <SplitWords text={cta.title} />
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/70">{cta.subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/book" className="group flex items-center gap-3 rounded-full bg-white py-2 pl-7 pr-2 text-base font-medium text-ink transition hover:bg-accent hover:text-white">
                Book your visit
                <span className="grid size-12 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </Magnetic>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="rounded-full px-6 py-4 text-white/80 ring-1 ring-white/20 transition hover:bg-white/10">
              or call {contact.phone}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
