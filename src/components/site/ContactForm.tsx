"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

export const inputCls =
  "peer w-full rounded-2xl border border-line bg-white/70 px-4 pb-2.5 pt-6 text-[15px] outline-none transition placeholder-transparent focus:border-ink focus:bg-white";

export function Field({ label, name, type = "text", required, textarea, defaultValue }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean; defaultValue?: string }) {
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} required={required} placeholder={label} rows={4} defaultValue={defaultValue} className={cn(inputCls, "resize-none")} />
      ) : (
        <input name={name} type={type} required={required} placeholder={label} defaultValue={defaultValue} className={inputCls} />
      )}
      <span className="pointer-events-none absolute left-4 top-2 text-[11px] text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-focus:top-2 peer-focus:text-[11px]">
        {label}
        {required && " *"}
      </span>
    </label>
  );
}

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] bg-accent-soft p-8 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }} className="grid size-16 place-items-center rounded-full bg-accent text-white">
              <Check className="size-7" strokeWidth={2.5} />
            </motion.span>
            <p className="mt-6 text-2xl font-semibold tracking-tight">Message received.</p>
            <p className="mt-2 text-muted">We&apos;ll get back to you within a few hours.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -10 }}
            onSubmit={async (e) => {
              e.preventDefault();
              setState("loading");
              const data = Object.fromEntries(new FormData(e.currentTarget));
              const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
              if (r.ok) setState("done");
              else {
                setErr((await r.json()).error || "Something went wrong");
                setState("error");
              }
            }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <Field label="Full name" name="name" required />
            <Field label="Phone" name="phone" type="tel" />
            <div className="sm:col-span-2">
              <Field label="Email" name="email" type="email" />
            </div>
            <div className="sm:col-span-2">
              <Field label="Subject" name="subject" />
            </div>
            <div className="sm:col-span-2">
              <Field label="How can we help?" name="message" textarea required />
            </div>
            {state === "error" && <p className="text-sm text-red-600 sm:col-span-2">{err}</p>}
            <button disabled={state === "loading"} className="group flex items-center justify-between rounded-full bg-ink py-2 pl-6 pr-2 font-medium text-white transition hover:bg-accent disabled:opacity-60 sm:col-span-2">
              Send message
              <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform group-hover:rotate-45">
                {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpRight className="size-4" />}
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
