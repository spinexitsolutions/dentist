"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck, Check, Clock, Inbox, Mail, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Appointment, Lead, Patient, Subscriber } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { api } from "@/components/admin/api";
import { Badge, Button, Card, STATUS_TONE, useToast } from "@/components/admin/ui";

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Dashboard() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [today, setToday] = useState("");
  const toast = useToast();

  useEffect(() => {
    setToday(iso(new Date()));
    Promise.all([
      api.get<Appointment[]>("/api/admin/appointments"),
      api.get<Lead[]>("/api/admin/leads"),
      api.get<Patient[]>("/api/admin/patients"),
      api.get<Subscriber[]>("/api/admin/subscribers"),
    ]).then(([a, l, p, s]) => {
      setAppts(a);
      setLeads(l);
      setPatients(p);
      setSubs(s);
    });
  }, []);

  const days = useMemo(() => {
    if (!today) return [];
    const out: { date: string; label: string; count: number; done: number }[] = [];
    for (let i = -10; i <= 7; i++) {
      const d = new Date(today + "T00:00:00");
      d.setDate(d.getDate() + i);
      const k = iso(d);
      const list = appts.filter((a) => a.date === k && a.status !== "cancelled");
      out.push({ date: k, label: d.toLocaleDateString("en-IN", { day: "numeric" }), count: list.length, done: list.filter((a) => a.status === "completed").length });
    }
    return out;
  }, [appts, today]);
  const max = Math.max(3, ...days.map((d) => d.count));

  const upcoming = appts
    .filter((a) => a.date >= today && ["pending", "confirmed"].includes(a.status))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6);

  const statusCounts = (["pending", "confirmed", "completed", "cancelled", "no-show"] as const).map((s) => ({ s, n: appts.filter((a) => a.status === s).length }));
  const total = appts.length || 1;
  const colors: Record<string, string> = { pending: "#F59E0B", confirmed: "#0EA5E9", completed: "#10B981", cancelled: "#EF4444", "no-show": "#A3A3A3" };

  const topServices = Object.entries(appts.reduce<Record<string, number>>((m, a) => ((m[a.service] = (m[a.service] || 0) + 1), m), {}))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const kpis = [
    { label: "Today", value: appts.filter((a) => a.date === today && a.status !== "cancelled").length, sub: "appointments", icon: CalendarCheck, href: "/admin/appointments" },
    { label: "Pending", value: appts.filter((a) => a.status === "pending").length, sub: "need confirmation", icon: Clock, href: "/admin/appointments?status=pending" },
    { label: "New leads", value: leads.filter((l) => l.status === "new").length, sub: `${leads.length} total`, icon: Inbox, href: "/admin/leads" },
    { label: "Patients", value: patients.length, sub: `${subs.length} subscribers`, icon: Users, href: "/admin/patients" },
  ];

  let acc = 0;

  return (
    <>
      {/* greeting orbit card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mb-4 overflow-hidden rounded-[30px] bg-ink p-6 text-white md:p-9">
        <div className="pointer-events-none absolute -right-24 top-1/2 size-[440px] -translate-y-1/2 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-1/2 hidden size-[380px] -translate-y-1/2 md:block">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-[16%] rounded-full border border-dashed border-white/10" />
          <div className="absolute inset-0" style={{ animation: "spin 60s linear infinite" }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <span key={k} className="absolute size-3 rounded-full bg-pop" style={{ left: `${50 + 50 * Math.round(Math.cos(k * 1.2566) * 1000) / 1000}%`, top: `${50 + 50 * Math.round(Math.sin(k * 1.2566) * 1000) / 1000}%`, transform: "translate(-50%,-50%)", opacity: 0.4 + k * 0.12 }} />
            ))}
          </div>
          <div className="absolute inset-[30%] grid place-items-center rounded-full bg-white/10 text-center backdrop-blur">
            <span>
              <span className="display block text-5xl">{appts.filter((a) => a.date === today && a.status !== "cancelled").length}</span>
              <span className="text-xs text-white/60">visits today</span>
            </span>
          </div>
        </div>
        <p className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] text-white/75">
          <span className="size-1.5 rounded-full bg-pop" />
          {today ? formatDate(today, { weekday: "long", day: "numeric", month: "long" }) : "Today"}
        </p>
        <h1 className="display relative mt-4 text-[44px] md:text-[64px]">
          Good day, <span className="thin-word text-pop">doctor.</span>
        </h1>
        <p className="relative mt-2 max-w-md text-[15px] text-white/60">
          {appts.filter((a) => a.status === "pending").length} appointments need confirmation and {leads.filter((l) => l.status === "new").length} new enquiries are waiting.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-2">
          <Link href="/admin/appointments?new=1">
            <Button variant="accent">New appointment</Button>
          </Link>
          <a href="/" target="_blank">
            <Button variant="ghost" className="!text-white ring-1 ring-white/20 hover:!bg-white/10">
              View site <ArrowUpRight className="size-4" />
            </Button>
          </a>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.5 }}>
            <Link href={k.href}>
              <Card className="group transition hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-black/50">{k.label}</span>
                  <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent-deep">
                    <k.icon className="size-4" />
                  </span>
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] tabular-nums">{k.value}</p>
                <p className="mt-1 text-xs text-black/40">{k.sub}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold tracking-tight">Appointment volume</p>
              <p className="text-xs text-black/40">Last 10 days → next 7 days</p>
            </div>
            <span className="flex items-center gap-3 text-xs text-black/50">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-accent" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-ink/15" /> Booked
              </span>
            </span>
          </div>
          <div className="mt-6 flex h-48 gap-1.5">
            {days.map((d, i) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(d.count ? 6 : 2, (d.count / max) * 100)}%` }}
                    transition={{ delay: i * 0.025, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-md ${d.date === today ? "bg-ink" : "bg-ink/10"}`}
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-accent" style={{ height: d.count ? `${(d.done / d.count) * 100}%` : 0 }} />
                  </motion.div>
                  <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">{d.count}</span>
                </div>
                <span className={`text-[10px] tabular-nums ${d.date === today ? "font-semibold text-ink" : "text-black/40"}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-semibold tracking-tight">Status breakdown</p>
          <div className="mt-4 flex items-center gap-6">
            <svg viewBox="0 0 42 42" className="size-36 -rotate-90">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#0000000d" strokeWidth="5" />
              {statusCounts.map(({ s, n }) => {
                const pct = (n / total) * 100;
                const el = (
                  <motion.circle
                    key={s}
                    cx="21"
                    cy="21"
                    r="15.9"
                    fill="none"
                    stroke={colors[s]}
                    strokeWidth="5"
                    strokeDasharray={`${pct} ${100 - pct}`}
                    strokeDashoffset={-acc}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                );
                acc += pct;
                return el;
              })}
            </svg>
            <ul className="flex-1 space-y-2 text-sm">
              {statusCounts.map(({ s, n }) => (
                <li key={s} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 capitalize">
                    <span className="size-2 rounded-full" style={{ background: colors[s] }} />
                    {s}
                  </span>
                  <span className="tabular-nums text-black/50">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold tracking-tight">Upcoming</p>
            <Link href="/admin/appointments" className="text-sm text-accent">
              See all
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {upcoming.length === 0 && <li className="py-6 text-center text-sm text-black/40">No upcoming appointments.</li>}
            {upcoming.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <div className="w-14 shrink-0 rounded-xl bg-black/[.04] py-1.5 text-center">
                  <p className="text-[10px] uppercase text-black/40">{formatDate(a.date, { month: "short" })}</p>
                  <p className="text-lg font-semibold leading-none">{formatDate(a.date, { day: "numeric" })}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{a.name}</p>
                  <p className="truncate text-xs text-black/50">
                    {formatTime(a.time)} · {a.service} · {a.doctor}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                {a.status === "pending" && (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={async () => {
                      const rec = await api.put<Appointment>(`/api/admin/appointments/${a.id}`, { status: "confirmed" });
                      setAppts((x) => x.map((i) => (i.id === a.id ? rec : i)));
                      toast("Appointment confirmed");
                    }}
                  >
                    <Check className="size-3.5" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
        <div className="grid gap-3">
          <Card>
            <p className="flex items-center gap-2 font-semibold tracking-tight">
              <TrendingUp className="size-4 text-accent" /> Top treatments
            </p>
            <ul className="mt-4 space-y-3">
              {topServices.map(([name, n], i) => (
                <li key={name}>
                  <div className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span className="text-black/40">{n}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5">
                    <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${(n / (topServices[0]?.[1] || 1)) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.8 }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-2 font-semibold tracking-tight">
                <Mail className="size-4 text-accent" /> Latest leads
              </p>
              <Link href="/admin/leads" className="text-sm text-accent">
                Inbox
              </Link>
            </div>
            <ul className="divide-y divide-black/5">
              {leads.slice(0, 4).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{l.name}</span>
                    <span className="block truncate text-xs text-black/50">{l.subject}</span>
                  </span>
                  <Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
