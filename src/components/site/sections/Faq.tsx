"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Faq as FaqT, Settings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EASE, Reveal } from "../motion";
import SectionHead from "./SectionHead";
import { WhatsappIcon } from "../icons";

export default function Faq({ faqs, contact }: { faqs: FaqT[]; contact: Settings["contact"] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <section className="container-x py-20 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-20">
        <div className="md:sticky md:top-32 md:self-start">
          <SectionHead align="left" eyebrow="FAQ" title="Questions," italic="answered honestly." />
          <Reveal delay={0.2}>
            <div className="mt-10 rounded-[24px] bg-accent-soft p-6">
              <p className="text-lg font-medium tracking-tight">Still curious?</p>
              <p className="mt-1 text-sm text-ink/70">Our care team replies on WhatsApp within minutes.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white">
                  <WhatsappIcon className="size-4" /> Chat with us
                </a>
                <Link href="/contact" className="rounded-full bg-white px-4 py-2.5 text-sm font-medium">
                  Send a message
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => {
            const isOpen = open === f.id;
            return (
              <Reveal key={f.id} delay={i * 0.05} y={16}>
                <button onClick={() => setOpen(isOpen ? null : f.id)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
                  <span className="text-lg font-medium tracking-tight md:text-xl">{f.q}</span>
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500", isOpen ? "rotate-45 bg-ink text-white" : "bg-card ring-1 ring-line")}>
                    <Plus className="size-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
