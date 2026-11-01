"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/types";
import { cn, openStatus } from "@/lib/utils";
import { ToothMark, WhatsappIcon, InstagramIcon } from "./icons";
import { EASE } from "./motion";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Treatments" },
  { href: "/team", label: "Doctors" },
  { href: "/gallery", label: "Smile gallery" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Visit us" },
];

const SPRING = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 } as const;

type Props = {
  brand: Settings["brand"];
  contact: Settings["contact"];
  social: Settings["social"];
  previews: Record<string, string>;
};

function ProgressMark({ size = 40 }: { size?: number }) {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <span className="relative grid shrink-0 place-items-center rounded-full bg-white/10" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth="2" />
        <motion.circle cx="20" cy="20" r="18" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ pathLength: p }} />
      </svg>
      <ToothMark className="size-[45%] text-white" />
    </span>
  );
}

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

export default function Navbar({ brand, contact, social, previews, hasBar = false }: Props & { hasBar?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hover, setHover] = useState<string | null>(null);
  const [preview, setPreview] = useState(NAV_LINKS[1].href);
  const status = useStatus(contact.hours);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setAtTop(y < 40);
    if (y < 120) setCompact(false);
    else if (y > prev + 4) setCompact(true);
    else if (y < prev - 8) setCompact(false);
  });

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
  const inline = NAV_LINKS.slice(1);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ===================== Desktop island (top) ===================== */}
      <div className={cn("pointer-events-none fixed inset-x-0 z-50 hidden justify-center transition-[top] duration-500 ease-[var(--ease-out-expo)] md:flex", atTop && hasBar ? "top-[52px]" : "top-4")}>
        <motion.nav
          layout
          transition={SPRING}
          style={{ borderRadius: open ? 32 : 999 }}
          className="pointer-events-auto glass-dark overflow-hidden text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          aria-label="Main"
        >
          {!open ? (
            <motion.div layout="position" className="flex items-center gap-1 p-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Link href="/" className="flex items-center gap-2.5 rounded-full pr-3" aria-label={brand.name}>
                <ProgressMark />
                <AnimatePresence initial={false}>
                  {!compact && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-tight"
                    >
                      {brand.shortName}
                      <span className="thin-word ml-1 text-white/60">dental</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <AnimatePresence initial={false}>
                {!compact && (
                  <motion.ul
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="flex items-center overflow-hidden"
                    onMouseLeave={() => setHover(null)}
                  >
                    {inline.map((l) => (
                      <li key={l.href} className="relative">
                        <Link
                          href={l.href}
                          onMouseEnter={() => setHover(l.href)}
                          className={cn("relative z-10 block whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] transition-colors", isActive(l.href) ? "text-white" : "text-white/65 hover:text-white")}
                        >
                          {l.label}
                          {isActive(l.href) && <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />}
                        </Link>
                        {hover === l.href && <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              {status && (
                <span className="mx-1 hidden items-center gap-2 whitespace-nowrap rounded-full bg-white/5 px-3 py-2 text-[12px] text-white/70 lg:flex">
                  <span className={cn("size-1.5 rounded-full", status.open ? "live-dot bg-green-400" : "bg-amber-400")} />
                  {compact ? (status.open ? "Open now" : "Closed") : status.label}
                </span>
              )}

              <button
                onClick={() => setOpen(true)}
                className="group flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-expanded={open}
              >
                <span className="flex flex-col gap-[3px]">
                  <span className="h-px w-4 bg-current transition-all group-hover:w-3" />
                  <span className="h-px w-4 bg-current" />
                </span>
                Menu
              </button>
              <Link href="/book" className="group flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink transition hover:bg-accent hover:text-white">
                Book a visit
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          ) : (
            <motion.div layout="position" className="w-[min(92vw,920px)] p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.12 }}>
              <div className="flex items-center justify-between pl-1">
                <Link href="/" className="flex items-center gap-2.5">
                  <ProgressMark />
                  <span className="text-[15px] font-semibold tracking-tight">{brand.name}</span>
                </Link>
                <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:rotate-90 hover:bg-white/20" aria-label="Close menu">
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-[1.1fr_1fr] gap-3">
                <ul className="flex flex-col justify-center px-4 py-2">
                  {NAV_LINKS.map((l, i) => (
                    <motion.li key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}>
                      <Link
                        href={l.href}
                        onMouseEnter={() => setPreview(l.href)}
                        className="group flex items-baseline gap-4 py-1.5"
                      >
                        <span className="font-mono text-[11px] text-white/35">0{i + 1}</span>
                        <span className={cn("text-[2.6rem] font-medium leading-[1.05] tracking-[-0.04em] transition-all duration-500 group-hover:translate-x-2", preview === l.href ? "text-white" : "text-white/45")}>
                          {l.label}
                        </span>
                        {isActive(l.href) && <span className="thin-word text-lg text-accent">current</span>}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-white/5">
                    <AnimatePresence mode="popLayout">
                      <motion.img
                        key={preview}
                        src={previews[preview]}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                        initial={{ opacity: 0, scale: 1.12, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: EASE }}
                      />
                    </AnimatePresence>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-sm">
                      {status && (
                        <span className="flex items-center gap-2">
                          <span className={cn("size-1.5 rounded-full", status.open ? "live-dot bg-green-400" : "bg-amber-400")} />
                          {status.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-2xl bg-white/5 p-3.5 transition hover:bg-white/10">
                      <Phone className="size-4 text-accent" /> {contact.phone}
                    </a>
                    <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl bg-white/5 p-3.5 transition hover:bg-white/10">
                      <WhatsappIcon className="size-4 text-accent" /> WhatsApp us
                    </a>
                    <p className="col-span-2 rounded-2xl bg-white/5 p-3.5 text-white/60">{contact.address}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[22px] bg-accent px-5 py-4 text-white">
                <span className="text-lg font-medium tracking-tight">
                  New here? <span className="thin-word">Your first 3D scan is on us.</span>
                </span>
                <Link href="/book" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">
                  Book now <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </motion.nav>
      </div>

      {/* ===================== Mobile island (bottom, thumb-reach) ===================== */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
        <motion.nav
          layout
          transition={SPRING}
          style={{ borderRadius: open ? 30 : 999 }}
          className="pointer-events-auto glass-dark w-full max-w-[440px] overflow-hidden text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
          aria-label="Main mobile"
        >
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="sheet"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="px-5 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow !text-white/40">Navigate</span>
                    {status && (
                      <span className="flex items-center gap-2 text-xs text-white/60">
                        <span className={cn("size-1.5 rounded-full", status.open ? "live-dot bg-green-400" : "bg-amber-400")} />
                        {status.label}
                      </span>
                    )}
                  </div>
                  <ul className="mt-3">
                    {NAV_LINKS.map((l, i) => (
                      <motion.li key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.045, duration: 0.55, ease: EASE }} className="border-b border-white/10 last:border-0">
                        <Link href={l.href} className="flex items-center justify-between py-3">
                          <span className={cn("text-[1.9rem] font-medium leading-none tracking-[-0.04em]", isActive(l.href) ? "text-white" : "text-white/55")}>{l.label}</span>
                          <span className="font-mono text-[10px] text-white/30">0{i + 1}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-4 grid grid-cols-3 gap-2 pb-3 text-[12px]">
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/[.07] py-3">
                      <Phone className="size-4 text-accent" /> Call
                    </a>
                    <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/[.07] py-3">
                      <WhatsappIcon className="size-4 text-accent" /> WhatsApp
                    </a>
                    <a href={social.instagram} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/[.07] py-3">
                      <InstagramIcon className="size-4 text-accent" /> Instagram
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout="position" className="flex items-center gap-2 p-1.5">
            <Link href="/" aria-label={brand.name}>
              <ProgressMark size={44} />
            </Link>
            <button onClick={() => setOpen((o) => !o)} className="flex min-w-0 flex-1 flex-col items-start px-1 text-left" aria-expanded={open}>
              <span className="truncate text-[14px] font-semibold leading-tight tracking-tight">
                {brand.shortName} <span className="thin-word font-normal text-white/60">dental</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                {status && <span className={cn("size-1.5 rounded-full", status.open ? "bg-green-400" : "bg-amber-400")} />}
                {status ? (status.open ? "Open now" : "Closed now") : " "}
              </span>
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="grid size-11 place-items-center rounded-full bg-white/10"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-4">
                <motion.span className="absolute left-0 top-0 h-[1.5px] w-4 rounded bg-white" animate={open ? { rotate: 45, y: 5.25 } : { rotate: 0, y: 0 }} transition={{ duration: 0.35, ease: EASE }} />
                <motion.span className="absolute bottom-0 left-0 h-[1.5px] w-4 rounded bg-white" animate={open ? { rotate: -45, y: -5.25 } : { rotate: 0, y: 0 }} transition={{ duration: 0.35, ease: EASE }} />
              </span>
            </button>
            <Link href="/book" className="flex h-11 items-center gap-1 rounded-full bg-white px-4 text-[13px] font-semibold text-ink">
              Book <ArrowUpRight className="size-4" />
            </Link>
          </motion.div>
        </motion.nav>
      </div>
    </>
  );
}
