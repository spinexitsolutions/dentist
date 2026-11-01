"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import { WhatsappIcon } from "./icons";

export function Announcement({ a }: { a: Settings["announcement"] }) {
  if (!a.enabled) return null;
  return (
    <Link href={a.link || "/book"} className="group relative z-10 block bg-ink px-4 py-2.5 text-center text-[12.5px] text-white/80 md:fixed md:inset-x-0 md:top-0 md:hidden">
      <span className="text-shimmer !bg-[linear-gradient(90deg,#fff_0%,var(--accent)_40%,#fff_60%)] font-medium">{a.text}</span>
      <ArrowRight className="ml-1.5 inline size-3.5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function DesktopAnnouncement({ a }: { a: Settings["announcement"] }) {
  if (!a.enabled) return null;
  return (
    <div className="container-x hidden pt-24 md:block">
      <Link href={a.link || "/book"} className="group mx-auto flex w-fit items-center gap-3 rounded-full border border-line bg-white/60 py-1 pl-1 pr-4 text-[13px] backdrop-blur">
        <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">NEW</span>
        {a.text}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export function MobileTopBar({ brand, phone }: { brand: Settings["brand"]; phone: string }) {
  return (
    <div className="container-x flex items-center justify-between pt-4 md:hidden">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        {brand.shortName}
        <span className="serif-i ml-1 font-normal text-muted">dental studio</span>
      </Link>
      <a href={`tel:${phone.replace(/\s/g, "")}`} className="grid size-10 place-items-center rounded-full bg-white/70 ring-1 ring-line" aria-label="Call">
        <Phone className="size-4" />
      </a>
    </div>
  );
}

export function FloatingWhatsapp({ number }: { number: string }) {
  return (
    <motion.a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 3.2, type: "spring", stiffness: 260, damping: 18 }}
      className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,0.7)] md:flex"
    >
      <WhatsappIcon className="size-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 group-hover:max-w-[160px] group-hover:pr-1">Chat with us</span>
    </motion.a>
  );
}

export function PageHeader({ eyebrow, title, italic, text }: { eyebrow: string; title: string; italic?: string; text?: string }) {
  return (
    <section className="container-x pb-10 pt-14 md:pb-16 md:pt-40">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="eyebrow flex items-center gap-3">
        <span className="h-px w-10 bg-ink/30" />
        {eyebrow}
      </motion.p>
      <h1 className="display mt-5 max-w-5xl text-[3.2rem] md:text-[7rem]">
        <motion.span initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="inline-block">
          {title}
        </motion.span>{" "}
        {italic && (
          <motion.span initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="serif-i inline-block text-accent">
            {italic}
          </motion.span>
        )}
      </h1>
      {text && (
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {text}
        </motion.p>
      )}
    </section>
  );
}
