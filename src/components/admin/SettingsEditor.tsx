"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { GripVertical, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Settings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TOOTH_PATH } from "@/components/site/icons";
import { api } from "./api";
import { Button, Card, FieldWrap, ImageField, ListField, PageTitle, Segmented, Toggle, inputBase, useToast } from "./ui";

const TABS = [
  { id: "brand", label: "Brand & theme" },
  { id: "intro", label: "Intro animation" },
  { id: "hero", label: "Hero & banner" },
  { id: "sections", label: "Homepage layout" },
  { id: "about", label: "About & CTA" },
  { id: "contact", label: "Contact & hours" },
  { id: "booking", label: "Booking" },
  { id: "seo", label: "SEO & social" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const PRESETS = [
  { name: "Mint", accent: "#0F9B8E", ink: "#0B0D10", paper: "#F4F2EE" },
  { name: "Cobalt", accent: "#2F5BFF", ink: "#0A0C14", paper: "#F3F4F7" },
  { name: "Coral", accent: "#F2653A", ink: "#141110", paper: "#F6F1EC" },
  { name: "Lavender", accent: "#7C5CFF", ink: "#0E0C14", paper: "#F4F2F8" },
  { name: "Sage", accent: "#5E8B6A", ink: "#101410", paper: "#F2F1EA" },
  { name: "Noir", accent: "#C8A26B", ink: "#0B0B0B", paper: "#F3F0EA" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Section({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <Card className="p-6">
      <p className="text-[17px] font-semibold tracking-tight">{title}</p>
      {text && <p className="mt-0.5 text-sm text-black/50">{text}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

function SectionRow({ item, onToggle, onCommit }: { item: Settings["sections"][number]; onToggle: (v: boolean) => void; onCommit: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} onDragEnd={onCommit} className="list-none" whileDrag={{ scale: 1.02 }}>
      <div className={cn("flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition", !item.enabled && "opacity-55")}>
        <button onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none text-black/25" aria-label="Drag to reorder">
          <GripVertical className="size-4" />
        </button>
        <span className="flex-1 text-[15px] font-medium">{item.label}</span>
        <Toggle checked={item.enabled} onChange={onToggle} />
      </div>
    </Reorder.Item>
  );
}

export default function SettingsEditor() {
  const sp = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>((sp.get("tab") as Tab) || "brand");
  const [s, setS] = useState<Settings | null>(null);
  const [orig, setOrig] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get<Settings>("/api/admin/settings").then((d) => {
      setS(d);
      setOrig(JSON.stringify(d));
    });
  }, []);
  useEffect(() => {
    const t = sp.get("tab") as Tab;
    if (t) setTab(t);
  }, [sp]);

  if (!s) return <Card className="h-96 animate-pulse" />;
  const dirty = JSON.stringify(s) !== orig;

  function up<K extends keyof Settings>(k: K, patch: Partial<Settings[K]>) {
    setS((x) => (x ? { ...x, [k]: { ...(x[k] as object), ...patch } } : x));
  }

  const save = async (next = s) => {
    setSaving(true);
    try {
      const r = await api.put<Settings>("/api/admin/settings", next);
      setS(r);
      setOrig(JSON.stringify(r));
      toast("Published to website");
      router.refresh();
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  };

  const text = (k: keyof Settings, field: string, label: string, opts: { full?: boolean; area?: boolean; placeholder?: string } = {}) => {
    const obj = s[k] as unknown as Record<string, string>;
    return (
      <FieldWrap label={label} className={opts.full || opts.area ? "sm:col-span-2" : ""}>
        {opts.area ? (
          <textarea rows={4} className={inputBase} value={obj[field] ?? ""} onChange={(e) => up(k, { [field]: e.target.value } as never)} />
        ) : (
          <input className={inputBase} value={obj[field] ?? ""} placeholder={opts.placeholder} onChange={(e) => up(k, { [field]: e.target.value } as never)} />
        )}
      </FieldWrap>
    );
  };

  return (
    <>
      <PageTitle title="Site settings" subtitle="Everything on the website — from colours to the intro animation — is controlled here." />

      <div className="no-scrollbar -mx-4 mb-6 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="inline-flex gap-1 rounded-full bg-black/[.05] p-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("relative whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium transition", tab === t.id ? "text-ink" : "text-black/50 hover:text-ink")}>
              {tab === t.id && <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-4 pb-24">
          {tab === "brand" && (
            <>
              <Section title="Identity">
                {text("brand", "name", "Clinic name")}
                {text("brand", "shortName", "Short name (logo & footer)")}
                {text("brand", "tagline", "Tagline", { full: true })}
              </Section>
              <Card className="p-6">
                <p className="text-[17px] font-semibold tracking-tight">Colour theme</p>
                <p className="mt-0.5 text-sm text-black/50">Pick a preset or fine-tune each colour. Changes apply site-wide.</p>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {PRESETS.map((p) => {
                    const active = p.accent.toLowerCase() === s.brand.accent.toLowerCase();
                    return (
                      <button key={p.name} onClick={() => up("brand", { accent: p.accent, ink: p.ink, paper: p.paper })} className={cn("rounded-2xl p-2 text-left ring-1 transition", active ? "ring-2 ring-ink" : "ring-black/5 hover:ring-black/20")}>
                        <span className="flex h-12 overflow-hidden rounded-xl">
                          <span className="flex-1" style={{ background: p.paper }} />
                          <span className="flex-1" style={{ background: p.accent }} />
                          <span className="flex-1" style={{ background: p.ink }} />
                        </span>
                        <span className="mt-1.5 block text-xs font-medium">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {(["accent", "ink", "paper"] as const).map((k) => (
                    <FieldWrap key={k} label={k === "accent" ? "Accent" : k === "ink" ? "Text / dark" : "Background"}>
                      <div className="flex items-center gap-2 rounded-xl bg-black/[.035] p-1.5">
                        <input type="color" value={s.brand[k]} onChange={(e) => up("brand", { [k]: e.target.value })} className="size-9 cursor-pointer rounded-lg border-0 bg-transparent" />
                        <input value={s.brand[k]} onChange={(e) => up("brand", { [k]: e.target.value })} className="min-w-0 flex-1 bg-transparent font-mono text-sm uppercase outline-none" />
                      </div>
                    </FieldWrap>
                  ))}
                </div>
                <div className="mt-5 overflow-hidden rounded-2xl p-6" style={{ background: s.brand.paper, color: s.brand.ink }}>
                  <p className="text-3xl font-semibold tracking-[-0.04em]">
                    Smiles, <span className="serif-i" style={{ color: s.brand.accent }}>crafted</span> with precision.
                  </p>
                  <span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: s.brand.ink }}>
                    Book a visit
                  </span>
                </div>
              </Card>
            </>
          )}

          {tab === "intro" && (
            <Card className="p-6">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-5">
                  <div>
                    <p className="text-[17px] font-semibold tracking-tight">Intro animation</p>
                    <p className="mt-0.5 text-sm text-black/50">The loader that plays when someone opens the website.</p>
                  </div>
                  <Toggle checked={s.intro.enabled} onChange={(v) => up("intro", { enabled: v })} label="Show intro animation" />
                  <FieldWrap label="Style">
                    <Segmented
                      value={s.intro.style}
                      onChange={(v) => up("intro", { style: v })}
                      options={[
                        { value: "smile", label: "Smile" },
                        { value: "curtain", label: "Curtain" },
                        { value: "minimal", label: "Minimal" },
                      ]}
                    />
                  </FieldWrap>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldWrap label="Big word">
                      <input className={inputBase} value={s.intro.line1} onChange={(e) => up("intro", { line1: e.target.value })} />
                    </FieldWrap>
                    <FieldWrap label="Italic line">
                      <input className={inputBase} value={s.intro.line2} onChange={(e) => up("intro", { line2: e.target.value })} />
                    </FieldWrap>
                  </div>
                  <FieldWrap label={`Duration · ${s.intro.duration.toFixed(1)}s`}>
                    <input type="range" min={1.2} max={6} step={0.1} value={s.intro.duration} onChange={(e) => up("intro", { duration: Number(e.target.value) })} className="w-full accent-[var(--accent)]" />
                  </FieldWrap>
                  <Toggle checked={s.intro.showOncePerSession} onChange={(v) => up("intro", { showOncePerSession: v })} label="Only play once per visit (recommended)" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-black/50">Live preview</p>
                  <div key={JSON.stringify(s.intro) + s.brand.accent} className={cn("relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl text-white", !s.intro.enabled && "opacity-40")} style={{ background: s.brand.ink }}>
                    {s.intro.style !== "minimal" && (
                      <svg viewBox="0 0 100 100" className="mb-4 size-16" fill="none">
                        <motion.path d={TOOTH_PATH} stroke={s.brand.accent} strokeWidth={2.4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: s.intro.duration * 0.7 }} />
                        {s.intro.style === "smile" && <motion.path d="M34 40 Q50 54 66 40" stroke="white" strokeWidth={2.4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: s.intro.duration * 0.55, duration: 0.6 }} />}
                      </svg>
                    )}
                    <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-5xl font-semibold tracking-[-0.06em]">
                      {s.intro.line1}
                    </motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.4 }} className="serif-i mt-1 text-xl">
                      {s.intro.line2}
                    </motion.p>
                    <motion.span className="absolute bottom-0 left-0 h-0.5" style={{ background: s.brand.accent }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: s.intro.duration, ease: "linear" }} />
                  </div>
                  <p className="mt-2 text-xs text-black/40">Tip: after saving, open the site in a private window to see the full intro.</p>
                </div>
              </div>
            </Card>
          )}

          {tab === "hero" && (
            <>
              <Section title="Hero" text="Headline is shown as: Title + italic highlight + ending.">
                {text("hero", "eyebrow", "Eyebrow", { full: true })}
                {text("hero", "title", "Title start")}
                {text("hero", "highlight", "Italic highlight word")}
                {text("hero", "titleEnd", "Title end", { full: true })}
                {text("hero", "subtitle", "Subtitle", { area: true })}
                {text("hero", "ctaPrimary", "Primary button")}
                {text("hero", "ctaSecondary", "Secondary button")}
                {text("hero", "rating", "Rating")}
                {text("hero", "reviews", "Reviews label")}
                <FieldWrap label="Portrait image (arch)" className="sm:col-span-2">
                  <ImageField value={s.hero.image} onChange={(v) => up("hero", { image: v })} />
                </FieldWrap>
                <FieldWrap label="Wide clinic image (scroll-expand)" className="sm:col-span-2">
                  <ImageField value={s.hero.wideImage} onChange={(v) => up("hero", { wideImage: v })} />
                </FieldWrap>
              </Section>
              <Section title="Announcement banner">
                <div className="sm:col-span-2">
                  <Toggle checked={s.announcement.enabled} onChange={(v) => up("announcement", { enabled: v })} label="Show announcement" />
                </div>
                {text("announcement", "text", "Text", { full: true })}
                {text("announcement", "link", "Link", { placeholder: "/book" })}
              </Section>
              <Section title="Philosophy statement" text="The paragraph that lights up word-by-word on scroll.">
                {text("statement", "text", "Statement", { area: true })}
              </Section>
            </>
          )}

          {tab === "sections" && (
            <Card className="p-6">
              <p className="text-[17px] font-semibold tracking-tight">Homepage layout</p>
              <p className="mt-0.5 text-sm text-black/50">Drag to reorder, toggle to show or hide. The hero always stays on top.</p>
              <Reorder.Group axis="y" values={s.sections} onReorder={(v) => setS({ ...s, sections: v })} className="mt-5 space-y-2">
                {s.sections.map((sec) => (
                  <SectionRow key={sec.key} item={sec} onCommit={() => undefined} onToggle={(v) => setS({ ...s, sections: s.sections.map((x) => (x.key === sec.key ? { ...x, enabled: v } : x)) })} />
                ))}
              </Reorder.Group>
            </Card>
          )}

          {tab === "about" && (
            <>
              <Section title="About the studio">
                {text("about", "eyebrow", "Eyebrow")}
                {text("about", "years", "Years badge")}
                {text("about", "title", "Title", { full: true })}
                {text("about", "body", "Body", { area: true })}
                <FieldWrap label="Highlights" className="sm:col-span-2">
                  <ListField value={s.about.points} onChange={(v) => up("about", { points: v })} />
                </FieldWrap>
                <FieldWrap label="Main image" className="sm:col-span-2">
                  <ImageField value={s.about.image} onChange={(v) => up("about", { image: v })} />
                </FieldWrap>
                <FieldWrap label="Secondary image" className="sm:col-span-2">
                  <ImageField value={s.about.image2} onChange={(v) => up("about", { image2: v })} />
                </FieldWrap>
              </Section>
              <Section title="Booking call-to-action">
                {text("cta", "title", "Title", { full: true })}
                {text("cta", "subtitle", "Subtitle", { area: true })}
                <FieldWrap label="Background image" className="sm:col-span-2">
                  <ImageField value={s.cta.image} onChange={(v) => up("cta", { image: v })} />
                </FieldWrap>
              </Section>
            </>
          )}

          {tab === "contact" && (
            <>
              <Section title="Contact details">
                {text("contact", "phone", "Phone")}
                {text("contact", "whatsapp", "WhatsApp number (digits, with country code)")}
                {text("contact", "email", "Email")}
                {text("contact", "emergency", "Emergency line")}
                {text("contact", "address", "Address", { full: true })}
                {text("contact", "mapQuery", "Google Maps search query", { full: true })}
              </Section>
              <Card className="p-6">
                <p className="text-[17px] font-semibold tracking-tight">Opening hours</p>
                <p className="mt-0.5 text-sm text-black/50">Powers the live “Open now” indicator in the navbar.</p>
                <div className="mt-5 divide-y divide-black/5">
                  {s.contact.hours.map((h, i) => {
                    const setH = (patch: Partial<typeof h>) => up("contact", { hours: s.contact.hours.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
                    return (
                      <div key={h.day} className="flex flex-wrap items-center gap-3 py-3">
                        <span className="w-24 font-medium">{h.day}</span>
                        <Toggle checked={!h.closed} onChange={(v) => setH({ closed: !v })} />
                        {h.closed ? (
                          <span className="text-sm text-black/40">Closed</span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <input type="time" value={h.open} onChange={(e) => setH({ open: e.target.value })} className={cn(inputBase, "w-auto")} />
                            <span className="text-black/30">–</span>
                            <input type="time" value={h.close} onChange={(e) => setH({ close: e.target.value })} className={cn(inputBase, "w-auto")} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {tab === "booking" && (
            <>
              <Section title="Online booking" text="Controls the booking wizard on /book.">
                <FieldWrap label="Time slots (24h, e.g. 14:30)" className="sm:col-span-2">
                  <ListField value={s.booking.slots} onChange={(v) => up("booking", { slots: v.filter((x) => /^\d{2}:\d{2}$/.test(x)).sort() })} placeholder="Add a slot like 16:30" />
                </FieldWrap>
                <FieldWrap label="Days bookable in advance">
                  <input type="number" min={1} max={90} className={inputBase} value={s.booking.daysAhead} onChange={(e) => up("booking", { daysAhead: Number(e.target.value) })} />
                </FieldWrap>
                <FieldWrap label="Closed weekdays">
                  <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map((d, i) => {
                      const closed = s.booking.closedWeekdays.includes(i);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => up("booking", { closedWeekdays: closed ? s.booking.closedWeekdays.filter((x) => x !== i) : [...s.booking.closedWeekdays, i] })}
                          className={cn("rounded-full px-3 py-1.5 text-[13px] transition", closed ? "bg-red-50 text-red-600 ring-1 ring-red-100" : "bg-black/[.04]")}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </FieldWrap>
              </Section>
              <Section title="Insurance partners">
                <div className="sm:col-span-2">
                  <ListField value={s.insurers} onChange={(v) => setS({ ...s, insurers: v })} />
                </div>
              </Section>
            </>
          )}

          {tab === "seo" && (
            <>
              <Section title="Search engines">
                {text("seo", "title", "Meta title", { full: true })}
                {text("seo", "description", "Meta description", { area: true })}
                <div className="rounded-2xl bg-black/[.03] p-4 sm:col-span-2">
                  <p className="text-xs text-black/40">Google preview</p>
                  <p className="mt-1 truncate text-lg text-[#1a0dab]">{s.seo.title}</p>
                  <p className="line-clamp-2 text-sm text-black/60">{s.seo.description}</p>
                </div>
              </Section>
              <Section title="Social links">
                {text("social", "instagram", "Instagram")}
                {text("social", "facebook", "Facebook")}
                {text("social", "youtube", "YouTube")}
                {text("social", "linkedin", "LinkedIn")}
              </Section>
              <Card className="p-6 ring-red-100">
                <p className="text-[17px] font-semibold tracking-tight text-red-600">Danger zone</p>
                <p className="mt-0.5 text-sm text-black/50">Reset all content and CRM data back to the demo state.</p>
                <Button
                  variant="outline"
                  className="mt-4 !text-red-600"
                  onClick={async () => {
                    if (!confirm("This will erase all changes, appointments and leads. Continue?")) return;
                    await api.post("/api/admin/reset");
                    toast("Demo data restored");
                    window.location.reload();
                  }}
                >
                  <RotateCcw className="size-4" /> Reset demo data
                </Button>
              </Card>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* save bar */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-white shadow-2xl lg:ml-[130px]"
          >
            <span className="flex items-center gap-2 whitespace-nowrap text-sm">
              <span className="size-2 rounded-full bg-amber-400" /> Unsaved changes
            </span>
            <Button variant="ghost" size="sm" className="!text-white/70 hover:!bg-white/10" onClick={() => setS(JSON.parse(orig))}>
              Discard
            </Button>
            <Button variant="accent" size="sm" loading={saving} onClick={() => save()}>
              Publish
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
