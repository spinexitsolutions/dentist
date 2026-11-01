"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarPlus, Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Doctor, Service, Settings } from "@/lib/types";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { Icon } from "./icons";
import { EASE } from "./motion";
import { Field } from "./ContactForm";

const STEPS = ["Treatment", "Specialist", "Date & time", "Your details"];

const pad = (n: number) => String(n).padStart(2, "0");
const isoLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function BookingWizard({
  services,
  doctors,
  booking,
  initialService,
  plan,
}: {
  services: Service[];
  doctors: Doctor[];
  booking: Settings["booking"];
  initialService?: string;
  plan?: string;
}) {
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [dir, setDir] = useState(1);
  const [service, setService] = useState(initialService || (plan ? `Membership: ${plan}` : ""));
  const [doctor, setDoctor] = useState("Any available");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { name: string }>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => setNow(new Date()), []);

  const days = useMemo(() => {
    if (!now) return [];
    const out: Date[] = [];
    for (let i = 0; out.length < booking.daysAhead && i < booking.daysAhead * 2; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      if (!booking.closedWeekdays.includes(d.getDay())) out.push(d);
    }
    return out;
  }, [now, booking.daysAhead, booking.closedWeekdays]);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    fetch(`/api/book/slots?date=${date}&doctor=${encodeURIComponent(doctor)}`)
      .then((r) => r.json())
      .then((d) => setTaken(doctor === "Any available" ? [] : d.taken || []))
      .finally(() => setLoadingSlots(false));
  }, [date, doctor]);

  const isPast = (t: string) => {
    if (!now || date !== isoLocal(now)) return false;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes() + 30;
  };

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    setError("");
  };

  const canNext = [!!service, !!doctor, !!date && !!time, true][step];

  async function submit(form: HTMLFormElement) {
    setSubmitting(true);
    setError("");
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const r = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, service, doctor, date, time }),
    });
    setSubmitting(false);
    if (r.ok) setDone({ name: f.name });
    else {
      const j = await r.json().catch(() => ({}));
      setError(j.error || "Something went wrong. Please try again.");
      if (r.status === 409) go(2);
    }
  }

  const gcal = useMemo(() => {
    if (!date || !time) return "#";
    const [y, mo, d] = date.split("-");
    const [h, m] = time.split(":");
    const start = `${y}${mo}${d}T${h}${m}00`;
    const endH = pad(Number(h) + 1);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Dental visit — " + service)}&dates=${start}/${y}${mo}${d}T${endH}${m}00`;
  }, [date, time, service]);

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="mx-auto max-w-xl rounded-[32px] bg-card p-8 text-center ring-1 ring-line md:p-12">
        <div className="relative mx-auto grid size-24 place-items-center">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="absolute inset-0 rounded-full bg-accent/30" initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }} />
          ))}
          <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="relative grid size-24 place-items-center rounded-full bg-accent text-white">
            <Check className="size-10" strokeWidth={2.5} />
          </motion.span>
        </div>
        <h2 className="display mt-8 text-4xl md:text-5xl">
          You&apos;re booked, <span className="serif-i text-accent">{done.name.split(" ")[0]}.</span>
        </h2>
        <p className="mt-4 text-muted">We&apos;ll confirm your appointment on WhatsApp shortly.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 text-left text-sm">
          {[
            ["Treatment", service],
            ["Specialist", doctor],
            ["Date", formatDate(date, { weekday: "short", day: "numeric", month: "short" })],
            ["Time", formatTime(time)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-paper p-4">
              <p className="text-xs text-muted">{k}</p>
              <p className="mt-1 font-medium">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={gcal} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
            <CalendarPlus className="size-4" /> Add to calendar
          </a>
          <Link href="/" className="rounded-full px-5 py-3 text-sm font-medium ring-1 ring-line">
            Back home
          </Link>
        </div>
      </motion.div>
    );
  }

  const summary = [
    ["Treatment", service],
    ["Specialist", step > 0 ? doctor : ""],
    ["When", date ? `${formatDate(date, { weekday: "short", day: "numeric", month: "short" })}${time ? " · " + formatTime(time) : ""}` : ""],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* summary */}
      <aside className="relative overflow-hidden rounded-[28px] bg-ink p-6 text-white lg:sticky lg:top-28 lg:self-start lg:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/40 blur-3xl" />
        <p className="eyebrow !text-white/50">Your appointment</p>
        <div className="mt-6 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <motion.div className="h-full bg-accent" initial={false} animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }} transition={{ duration: 0.6, ease: EASE }} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/60">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <ul className="mt-8 hidden space-y-4 lg:block">
          {summary.map(([k, v]) => (
            <li key={k} className="border-b border-white/10 pb-4">
              <p className="text-xs text-white/50">{k}</p>
              <AnimatePresence mode="wait">
                <motion.p key={v || "empty"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={cn("mt-1 text-lg tracking-tight", !v && "text-white/30")}>
                  {v || "—"}
                </motion.p>
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <p className="mt-6 hidden items-center gap-2 text-sm text-white/60 lg:flex">
          <Sparkles className="size-4 text-accent" /> Free 3D scan for first visits
        </p>
      </aside>

      {/* steps */}
      <div className="relative min-h-[520px] overflow-hidden rounded-[28px] bg-card p-5 ring-1 ring-line md:p-8">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -60, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {step === 0 && (
              <>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">What can we help with?</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[...services.map((s) => ({ title: s.title, icon: s.icon, sub: s.duration })), { title: "General check-up", icon: "Stethoscope", sub: "30 minutes" }].map((s) => (
                    <button
                      key={s.title}
                      onClick={() => {
                        setService(s.title);
                        go(1);
                      }}
                      className={cn("flex items-center gap-4 rounded-2xl p-4 text-left ring-1 transition", service === s.title ? "bg-ink text-white ring-ink" : "bg-white/60 ring-line hover:ring-ink/30")}
                    >
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", service === s.title ? "bg-accent text-white" : "bg-accent-soft text-accent-deep")}>
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      <span>
                        <span className="block font-medium">{s.title}</span>
                        <span className={cn("text-sm", service === s.title ? "text-white/60" : "text-muted")}>{s.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Choose your specialist</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[{ id: "any", name: "Any available", role: "Fastest appointment", image: "" }, ...doctors].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setDoctor(d.name);
                        setTime("");
                        go(2);
                      }}
                      className={cn("flex items-center gap-4 rounded-2xl p-3 text-left ring-1 transition", doctor === d.name ? "bg-ink text-white ring-ink" : "bg-white/60 ring-line hover:ring-ink/30")}
                    >
                      {d.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={d.image} alt="" className="size-14 rounded-xl object-cover" />
                      ) : (
                        <span className="grid size-14 place-items-center rounded-xl bg-accent text-white">
                          <Sparkles className="size-5" />
                        </span>
                      )}
                      <span>
                        <span className="block font-medium">{d.name}</span>
                        <span className={cn("text-sm", doctor === d.name ? "text-white/60" : "text-muted")}>{d.role}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Pick a date & time</h2>
                <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8" data-lenis-prevent>
                  {days.map((d) => {
                    const v = isoLocal(d);
                    const sel = v === date;
                    return (
                      <button
                        key={v}
                        onClick={() => {
                          setDate(v);
                          setTime("");
                        }}
                        className={cn("flex w-[68px] shrink-0 flex-col items-center rounded-2xl py-3 ring-1 transition", sel ? "bg-ink text-white ring-ink" : "bg-white/60 ring-line hover:ring-ink/30")}
                      >
                        <span className={cn("text-[11px] uppercase", sel ? "text-white/60" : "text-muted")}>{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                        <span className="mt-1 text-2xl font-semibold tracking-tight">{d.getDate()}</span>
                        <span className={cn("text-[11px]", sel ? "text-white/60" : "text-muted")}>{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                      </button>
                    );
                  })}
                </div>
                {date ? (
                  <div className="mt-6">
                    <p className="flex items-center gap-2 text-sm text-muted">
                      Available times {loadingSlots && <Loader2 className="size-3.5 animate-spin" />}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {booking.slots.map((t) => {
                        const off = taken.includes(t) || isPast(t);
                        return (
                          <button
                            key={t}
                            disabled={off}
                            onClick={() => setTime(t)}
                            className={cn(
                              "rounded-xl py-3 text-sm font-medium ring-1 transition",
                              time === t ? "bg-accent text-white ring-accent" : "bg-white/60 ring-line hover:ring-ink/30",
                              off && "cursor-not-allowed opacity-35 line-through",
                            )}
                          >
                            {formatTime(t)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="mt-8 text-muted">Select a day to see open slots.</p>
                )}
              </>
            )}

            {step === 3 && (
              <form
                id="book-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(e.currentTarget);
                }}
              >
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Almost there</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Field label="Full name" name="name" required />
                  <Field label="Phone / WhatsApp" name="phone" type="tel" required />
                  <div className="sm:col-span-2">
                    <Field label="Email" name="email" type="email" />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Anything we should know?" name="notes" textarea />
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted">By booking you agree to be contacted about your appointment. We never share your data.</p>
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <button onClick={() => go(Math.max(0, step - 1))} disabled={step === 0} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition hover:bg-paper disabled:opacity-30">
            <ArrowLeft className="size-4" /> Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => canNext && go(step + 1)}
              disabled={!canNext}
              className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-accent disabled:opacity-30"
            >
              Continue <ArrowRight className="size-4" />
            </button>
          ) : (
            <button form="book-form" disabled={submitting} className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Confirm booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
