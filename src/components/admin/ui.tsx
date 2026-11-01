"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ImagePlus, Loader2, Plus, Upload, X } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ toast */
type Toast = { id: number; text: string; tone: "ok" | "err" };
const ToastCtx = createContext<(text: string, tone?: "ok" | "err") => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[300] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn("flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-xl", t.tone === "ok" ? "bg-ink" : "bg-red-600")}
            >
              {t.tone === "ok" ? <Check className="size-4 text-accent" /> : <X className="size-4" />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------------------------------------------ basics */
export function Button({ variant = "primary", size = "md", className, loading, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger" | "accent"; size?: "sm" | "md"; loading?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
        variant === "primary" && "bg-ink text-white hover:bg-ink/85",
        variant === "accent" && "bg-accent text-white hover:brightness-110",
        variant === "ghost" && "hover:bg-black/5",
        variant === "outline" && "bg-white ring-1 ring-black/10 hover:bg-black/[.03]",
        variant === "danger" && "text-red-600 hover:bg-red-50",
        className,
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("rounded-[26px] bg-white/90 p-5 shadow-[0_1px_2px_rgba(11,30,51,0.04),0_20px_40px_-24px_rgba(11,30,51,0.18)] ring-1 ring-ink/[.05] backdrop-blur", className)}>{children}</div>;
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="display text-[38px] md:text-[48px]">{title}</h1>
        {subtitle && <p className="mt-1 text-[15px] text-black/50">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export const inputBase = "w-full rounded-xl bg-black/[.035] px-3.5 py-2.5 text-[14px] outline-none ring-1 ring-transparent transition placeholder:text-black/30 focus:bg-white focus:ring-accent";

export function FieldWrap({ label, help, children, className }: { label: string; help?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[12.5px] font-medium text-black/60">{label}</span>
      {children}
      {help && <span className="mt-1 block text-xs text-black/40">{help}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-left text-[14px]" role="switch" aria-checked={checked}>
      <span className={cn("relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors", checked ? "bg-[#34C759]" : "bg-black/15")}>
        <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 35 }} className={cn("absolute top-[3px] size-5 rounded-full bg-white shadow", checked ? "right-[3px]" : "left-[3px]")} />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}

export function Badge({ tone = "gray", children }: { tone?: "gray" | "green" | "blue" | "amber" | "red" | "violet" | "accent"; children: ReactNode }) {
  const tones = {
    gray: "bg-black/5 text-black/60",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-700",
    accent: "bg-accent-soft text-accent-deep",
  };
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium capitalize", tones[tone])}>{children}</span>;
}

export const STATUS_TONE: Record<string, "gray" | "green" | "blue" | "amber" | "red" | "violet" | "accent"> = {
  pending: "amber",
  confirmed: "blue",
  completed: "green",
  cancelled: "red",
  "no-show": "gray",
  new: "violet",
  contacted: "blue",
  qualified: "amber",
  won: "green",
  lost: "red",
};

export function Empty({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-black/10 px-6 py-16 text-center">
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-black/50">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ drawer */
export function Drawer({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[100] bg-black/25 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className={cn("fixed inset-y-0 right-0 z-[101] flex w-full flex-col bg-[#FBFBFD] shadow-2xl md:inset-y-2 md:right-2 md:rounded-[26px]", wide ? "md:w-[720px]" : "md:w-[540px]")}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-black/5 transition hover:bg-black/10" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5" data-lenis-prevent>
              {children}
            </div>
            {footer && <div className="flex items-center justify-end gap-2 border-t border-black/5 px-6 py-4">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ image */
export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      onChange(j.url);
      toast("Image uploaded");
    } catch (e) {
      toast((e as Error).message || "Upload failed", "err");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      className="flex gap-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) upload(f);
      }}
    >
      <button type="button" onClick={() => fileRef.current?.click()} className="group relative grid size-[84px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-black/[.04] ring-1 ring-black/5">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <ImagePlus className="size-5 text-black/30" />
        )}
        <span className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">{busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}</span>
      </button>
      <div className="min-w-0 flex-1">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image URL (Unsplash, Figma export…)" className={inputBase} />
        <p className="mt-1.5 text-xs text-black/40">Click the thumbnail or drop a file to upload (max 8 MB).</p>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ list */
export function ListField({ value, onChange, placeholder = "Add item and press Enter" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...(value || []), v]);
    setDraft("");
  };
  return (
    <div className="rounded-xl bg-black/[.035] p-2">
      <div className="flex flex-wrap gap-1.5">
        <AnimatePresence initial={false}>
          {(value || []).map((v, i) => (
            <motion.span key={v + i} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[13px] shadow-sm ring-1 ring-black/5">
              {v}
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-black/40 hover:text-red-500" aria-label={`Remove ${v}`}>
                <X className="size-3.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-1.5 flex items-center gap-1">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[14px] outline-none placeholder:text-black/30"
        />
        <button type="button" onClick={add} className="grid size-7 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5" aria-label="Add">
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ segmented */
export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[] }) {
  return (
    <div className="inline-flex rounded-full bg-black/[.05] p-1">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} className={cn("relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition", value === o.value ? "text-ink" : "text-black/50 hover:text-ink")}>
          {value === o.value && <motion.span layoutId={`seg-${options.map((x) => x.value).join("")}`} className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
          <span className="relative flex items-center gap-1.5">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** A badge that is secretly a native <select> — great on mobile. */
export function StatusSelect<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <span className="relative inline-flex">
      <Badge tone={STATUS_TONE[value]}>
        {value}
        <svg viewBox="0 0 10 10" className="size-2 opacity-60">
          <path d="M2 4l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.5" />
        </svg>
      </Badge>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Change status">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </span>
  );
}
