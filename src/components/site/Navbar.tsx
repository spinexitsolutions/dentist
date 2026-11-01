"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, BookOpen, Home, MapPin, Phone, Smile, Sparkles, Stethoscope, X, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/types";
import { cn, formatTime, openStatus } from "@/lib/utils";
import { InstagramIcon, ToothMark, WhatsappIcon } from "./icons";
import { EASE } from "./motion";

/** FDI tooth numbers double as our menu index — a small clinical signature. */
export const NAV_LINKS: { href: string; label: string; icon: LucideIcon; fdi: string }[] = [
  { href: "/", label: "Home", icon: Home, fdi: "11" },
  { href: "/services", label: "Treatments", icon: Sparkles, fdi: "12" },
  { href: "/team", label: "Doctors", icon: Stethoscope, fdi: "13" },
  { href: "/gallery", label: "Smile gallery", icon: Smile, fdi: "14" },
  { href: "/blog", label: "Journal", icon: BookOpen, fdi: "15" },
  { href: "/contact", label: "Visit us", icon: MapPin, fdi: "16" },
];

type Props = {
  brand: Settings["brand"];
  contact: Settings["contact"];
  social: Settings["social"];
  studioImage: string;
};

function useStatus(hours: Settings["contact"]["hours"]) {
  const [s, setS] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const tick = () => setS(openStatus(hours));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, [hours]);
  return s;
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-x-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-medium text-paper opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
      {children}
    </span>
  );
}

export default function Navbar({ brand, contact, social, studioImage }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const status = useStatus(contact.hours);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const w = window as unknown as { __lenis?: { stop(): void; start(): void } };
    if (open) w.__lenis?.stop();
    else w.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const tel = `tel:${contact.phone.replace(/\s/g, "")}`;
  const today = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

  return (
    <>
      {/* ============ Desktop: vertical rail ============ */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[84px] flex-col items-center border-r border-ink/10 bg-paper/90 py-5 backdrop-blur-xl md:flex" aria-label="Main">
        <Link href="/" className="group relative grid size-12 place-items-center rounded-full bg-ink text-paper transition hover:bg-accent" aria-label={brand.name}>
          <ToothMark className="size-5" />
          <Tip>{brand.name}</Tip>
        </Link>

        <button onClick={() => setOpen(true)} className="group relative mt-4 flex size-12 flex-col items-center justify-center gap-[5px] rounded-2xl transition hover:bg-ink/5" aria-label="Open menu" aria-expanded={open}>
          <span className="h-[1.5px] w-5 bg-ink transition-all group-hover:w-3" />
          <span className="h-[1.5px] w-5 bg-ink" />
          <span className="h-[1.5px] w-5 bg-ink transition-all group-hover:w-4" />
          <Tip>Menu</Tip>
        </button>

        <nav className="mt-6 flex flex-col items-center gap-1.5">
          {NAV_LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href} className={cn("group relative grid size-11 place-items-center rounded-full transition", active ? "text-paper" : "text-ink/55 hover:bg-ink/5 hover:text-ink")} aria-label={l.label}>
                {active && <motion.span layoutId="rail-active" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <l.icon className="relative size-[18px]" strokeWidth={1.7} />
                <Tip>
                  <span className="mr-1.5 opacity-50">{l.fdi}</span>
                  {l.label}
                </Tip>
              </Link>
            );
          })}
        </nav>

        {/* progress line + vertical wordmark */}
        <div className="relative my-6 flex w-full flex-1 justify-center">
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/10" />
          <motion.span style={{ scaleY: progress }} className="absolute inset-y-0 left-1/2 w-px origin-top -translate-x-1/2 bg-accent" />
          <span className="relative self-center bg-paper py-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-ink/45 [writing-mode:vertical-rl] rotate-180">
            {brand.shortName} · Est. 2009
          </span>
        </div>

        {status && (
          <span className="group relative mb-3 grid size-11 place-items-center" aria-label={status.label}>
            <span className={cn("size-2.5 rounded-full", status.open ? "live-dot bg-green-500" : "bg-amber-400")} />
            <Tip>{status.label}</Tip>
          </span>
        )}
        <Link href="/book" className="group relative flex w-12 flex-col items-center gap-2 rounded-full bg-accent py-5 text-white transition hover:bg-ink">
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">Book</span>
        </Link>
      </aside>

      {/* ============ Mobile: app-style dock with raised book button ============ */}
      <nav className="fixed inset-x-0 bottom-0 z-50 px-2.5 pb-[max(10px,env(safe-area-inset-bottom))] md:hidden" aria-label="Main mobile">
        <div className="relative rounded-[26px] bg-ink px-2 pb-2 pt-2.5 text-paper shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-x-6 top-0 h-[2px] overflow-hidden rounded-full bg-paper/10">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-accent" />
          </div>
          <div className="grid grid-cols-5 items-end">
            {[NAV_LINKS[0], NAV_LINKS[1]].map((l) => (
              <Link key={l.href} href={l.href} className={cn("flex flex-col items-center gap-1 py-1 text-[10.5px] font-medium", isActive(l.href) ? "text-paper" : "text-paper/45")}>
                <l.icon className="size-5" strokeWidth={1.7} />
                {l.label}
              </Link>
            ))}
            <Link href="/book" className="-mt-8 flex flex-col items-center gap-1 text-[10.5px] font-semibold">
              <span className="grid size-[58px] place-items-center rounded-full bg-accent text-white shadow-[0_10px_30px_-8px_var(--accent)] ring-[5px] ring-paper">
                <ToothMark className="size-6" />
              </span>
              Book
            </Link>
            <a href={tel} className="flex flex-col items-center gap-1 py-1 text-[10.5px] font-medium text-paper/45">
              <Phone className="size-5" strokeWidth={1.7} />
              Call
            </a>
            <button onClick={() => setOpen(true)} className="flex flex-col items-center gap-1 py-1 text-[10.5px] font-medium text-paper/45" aria-expanded={open}>
              <span className="flex size-5 flex-col items-center justify-center gap-[4px]">
                <span className="h-[1.5px] w-4 bg-current" />
                <span className="h-[1.5px] w-4 bg-current" />
              </span>
              Menu
            </button>
          </div>
        </div>
      </nav>

      {/* ============ Full-screen menu ============ */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[120] overflow-y-auto bg-ink text-paper"
            initial={{ clipPath: "circle(0% at 42px 88px)" }}
            animate={{ clipPath: "circle(150% at 42px 88px)" }}
            exit={{ clipPath: "circle(0% at 42px 88px)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="flex min-h-full flex-col px-5 pb-32 pt-5 md:px-12 md:pb-10 md:pl-[132px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3 text-[15px] font-semibold">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-white">
                    <ToothMark className="size-4" />
                  </span>
                  {brand.name}
                </span>
                <button onClick={() => setOpen(false)} className="grid size-12 place-items-center rounded-full bg-paper text-ink transition hover:rotate-90" aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-10 grid flex-1 gap-12 md:mt-6 md:grid-cols-[1.4fr_1fr] md:items-center">
                <ul>
                  {NAV_LINKS.map((l, i) => (
                    <li key={l.href} className="overflow-hidden border-b border-paper/10">
                      <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.05 }}>
                        <Link href={l.href} className="group flex items-baseline gap-4 py-2 md:py-1.5">
                          <span className="w-8 text-[12px] font-semibold tabular-nums opacity-60">{l.fdi}</span>
                          <span className="display text-[13vw] uppercase leading-[0.95] transition-[font-variation-settings,letter-spacing,color] duration-500 group-hover:text-pop group-hover:[font-variation-settings:'wdth'_120] md:text-[5.6vw]">
                            {l.label}
                          </span>
                          {isActive(l.href) && <span className="ml-auto size-3 rounded-full bg-pop" />}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: EASE }} className="grid gap-4">
                  <div className="relative hidden aspect-[16/10] overflow-hidden rounded-[28px] md:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={studioImage} alt="" className="size-full object-cover" />
                    {status && (
                      <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-[12.5px] font-medium text-ink">
                        <span className={cn("size-2 rounded-full", status.open ? "bg-green-500" : "bg-amber-400")} />
                        {status.label}
                      </span>
                    )}
                  </div>
                  <div className="rounded-[24px] bg-paper/[.06] p-5 text-paper ring-1 ring-paper/10">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-paper/50">Hours</p>
                    <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-[13.5px] sm:grid-cols-2">
                      {contact.hours.map((h) => (
                        <li key={h.day} className={cn("flex justify-between", h.day === today ? "text-pop" : "text-paper/75")}>
                          <span>{h.day.slice(0, 3)}</span>
                          <span>{h.closed ? "Closed" : `${formatTime(h.open)}–${formatTime(h.close)}`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[13px] font-medium">
                    <a href={tel} className="flex flex-col items-center gap-2 rounded-2xl bg-paper/[.08] py-4 transition hover:bg-paper/15">
                      <Phone className="size-4" /> Call
                    </a>
                    <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl bg-paper/[.08] py-4 transition hover:bg-paper/15">
                      <WhatsappIcon className="size-4" /> WhatsApp
                    </a>
                    <a href={social.instagram} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl bg-paper/[.08] py-4 transition hover:bg-paper/15">
                      <InstagramIcon className="size-4" /> Instagram
                    </a>
                  </div>
                  <Link href="/book" className="group flex items-center justify-between rounded-full bg-accent py-2 pl-6 pr-2 font-semibold text-white">
                    Book a visit
                    <span className="grid size-11 place-items-center rounded-full bg-paper text-ink transition-transform group-hover:rotate-45">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
