"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3, BookOpen, CalendarCheck, ExternalLink, HelpCircle, Image as ImageIcon, LayoutDashboard, LayoutTemplate, ListOrdered, LogOut, Mail, Menu,
  Cpu, Settings2, Sparkles, Star, Stethoscope, Users, Wallet, X, Inbox,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ToothMark } from "@/components/site/icons";

type Item = { href: string; label: string; icon: typeof Users; count?: number };

export default function AdminShell({ children, email, brand, counts }: { children: ReactNode; email: string; brand: string; counts: { appointments: number; leads: number } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const groups: { title: string; items: Item[] }[] = [
    { title: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
    {
      title: "CRM",
      items: [
        { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck, count: counts.appointments },
        { href: "/admin/patients", label: "Patients", icon: Users },
        { href: "/admin/leads", label: "Leads & inbox", icon: Inbox, count: counts.leads },
        { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
      ],
    },
    {
      title: "Website",
      items: [
        { href: "/admin/settings", label: "Site settings", icon: Settings2 },
        { href: "/admin/settings?tab=sections", label: "Homepage layout", icon: LayoutTemplate },
        { href: "/admin/content/services", label: "Treatments", icon: Sparkles },
        { href: "/admin/content/doctors", label: "Doctors", icon: Stethoscope },
        { href: "/admin/content/gallery", label: "Smile gallery", icon: ImageIcon },
        { href: "/admin/content/testimonials", label: "Testimonials", icon: Star },
        { href: "/admin/content/posts", label: "Journal", icon: BookOpen },
        { href: "/admin/content/faqs", label: "FAQ", icon: HelpCircle },
        { href: "/admin/content/plans", label: "Plans", icon: Wallet },
        { href: "/admin/content/stats", label: "Numbers", icon: BarChart3 },
        { href: "/admin/content/features", label: "Technology", icon: Cpu },
        { href: "/admin/content/steps", label: "Visit steps", icon: ListOrdered },
      ],
    },
  ];

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    if (href.includes("?")) return false;
    return path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);
  };

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-3 pb-5 pt-1">
        <span className="grid size-9 place-items-center rounded-xl bg-ink text-white">
          <ToothMark className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold leading-tight tracking-tight">{brand}</span>
          <span className="text-[11px] text-black/40">Studio OS</span>
        </span>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto pb-4" data-lenis-prevent>
        {groups.map((g) => (
          <div key={g.title}>
            <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-black/35">{g.title}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <li key={it.href}>
                    <Link href={it.href} className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] transition", active ? "font-medium text-ink" : "text-black/60 hover:bg-black/[.04] hover:text-ink")}>
                      {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-black/5" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                      <it.icon className={cn("relative size-[18px]", active && "text-accent")} strokeWidth={1.7} />
                      <span className="relative flex-1">{it.label}</span>
                      {!!it.count && <span className="relative rounded-full bg-accent px-1.5 text-[11px] font-semibold text-white">{it.count}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="space-y-1 border-t border-black/5 pt-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-black/60 hover:bg-black/[.04] hover:text-ink">
          <ExternalLink className="size-[18px]" strokeWidth={1.7} /> View website
        </a>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-black/60 hover:bg-black/[.04] hover:text-ink"
        >
          <LogOut className="size-[18px]" strokeWidth={1.7} /> Sign out
        </button>
        <p className="truncate px-3 pt-1 text-[11px] text-black/35">{email}</p>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[260px] shrink-0 border-r border-black/5 bg-[#F5F5F7]/80 p-3 pt-5 backdrop-blur-xl lg:block">{nav}</aside>

      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-black/5 bg-[#F5F5F7]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <span className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-white">
            <ToothMark className="size-3.5" />
          </span>
          Studio OS
        </span>
        <button onClick={() => setOpen(true)} className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-black/5" aria-label="Open navigation">
          <Menu className="size-4" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/25 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-[#F5F5F7] p-3 pt-5 shadow-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <button onClick={() => setOpen(false)} className="absolute right-3 top-4 grid size-8 place-items-center rounded-full bg-black/5" aria-label="Close navigation">
                <X className="size-4" />
              </button>
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="min-w-0 flex-1 px-4 pb-16 pt-20 md:px-8 lg:pt-8">
        <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mx-auto max-w-[1200px]">
          {children}
        </motion.div>
      </main>
    </div>
  );
}
