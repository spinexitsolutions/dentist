"use client";

import { CalendarPlus, Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Appointment, Patient } from "@/lib/types";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { api, useCollection } from "@/components/admin/api";
import { Badge, Button, Card, Drawer, Empty, FieldWrap, ListField, PageTitle, STATUS_TONE, inputBase, useToast } from "@/components/admin/ui";

export default function Patients() {
  const { items, loading, create, save, remove } = useCollection("patients");
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");
  const [edit, setEdit] = useState<Partial<Patient> | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get<Appointment[]>("/api/admin/appointments").then(setAppts);
  }, []);

  const tags = useMemo(() => Array.from(new Set(items.flatMap((p) => p.tags || []))), [items]);
  const stats = useMemo(() => {
    const m: Record<string, { visits: number; last: string; next: string }> = {};
    const today = new Date().toISOString().slice(0, 10);
    for (const a of appts) {
      const s = (m[a.patientId] ||= { visits: 0, last: "", next: "" });
      if (a.status === "completed") {
        s.visits++;
        if (a.date > s.last) s.last = a.date;
      }
      if (a.date >= today && ["pending", "confirmed"].includes(a.status) && (!s.next || a.date < s.next)) s.next = a.date;
    }
    return m;
  }, [appts]);

  const filtered = items
    .filter((p) => tag === "all" || p.tags?.includes(tag))
    .filter((p) => !q || `${p.name} ${p.phone} ${p.email}`.toLowerCase().includes(q.toLowerCase()));

  const history = edit?.id ? appts.filter((a) => a.patientId === edit.id).sort((a, b) => b.date.localeCompare(a.date)) : [];

  const submit = async () => {
    if (!edit?.name) return toast("Name is required", "err");
    setSaving(true);
    try {
      if (edit.id) await save(edit.id, edit);
      else await create({ tags: [], notes: "", dob: "", gender: "", ...edit } as Patient);
      toast("Patient saved");
      setEdit(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Patients"
        subtitle={`${items.length} patient records`}
        actions={
          <Button onClick={() => setEdit({ tags: [] })}>
            <Plus className="size-4" /> Add patient
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients…" className={cn(inputBase, "bg-white pl-9 ring-black/5")} />
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {["all", ...tags].map((t) => (
            <button key={t} onClick={() => setTag(t)} className={cn("whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition", tag === t ? "bg-ink text-white" : "bg-white text-black/60 ring-1 ring-black/5")}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="h-64 animate-pulse" />
      ) : filtered.length === 0 ? (
        <Empty title="No patients found" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const s = stats[p.id];
            return (
              <button key={p.id} onClick={() => setEdit(p)} className="text-left">
                <Card className="h-full transition hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent-deep">
                      {p.name
                        .split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold tracking-tight">{p.name}</span>
                      <span className="block truncate text-xs text-black/50">{p.phone || p.email}</span>
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-black/[.03] py-2">
                      <p className="text-lg font-semibold">{s?.visits ?? 0}</p>
                      <p className="text-[10px] uppercase text-black/40">Visits</p>
                    </div>
                    <div className="rounded-xl bg-black/[.03] py-2">
                      <p className="text-[13px] font-medium">{s?.last ? formatDate(s.last, { day: "numeric", month: "short" }) : "—"}</p>
                      <p className="text-[10px] uppercase text-black/40">Last</p>
                    </div>
                    <div className="rounded-xl bg-black/[.03] py-2">
                      <p className="text-[13px] font-medium">{s?.next ? formatDate(s.next, { day: "numeric", month: "short" }) : "—"}</p>
                      <p className="text-[10px] uppercase text-black/40">Next</p>
                    </div>
                  </div>
                  {p.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <Badge key={t} tone="accent">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </button>
            );
          })}
        </div>
      )}

      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? edit.name || "Patient" : "New patient"}
        wide
        footer={
          <>
            {edit?.id && (
              <Button
                variant="danger"
                className="mr-auto"
                onClick={async () => {
                  if (!confirm("Delete this patient record?")) return;
                  await remove(edit.id!);
                  setEdit(null);
                  toast("Patient deleted");
                }}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button onClick={submit} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {edit && (
          <>
            {edit.id && (
              <div className="mb-5 flex flex-wrap gap-2">
                {edit.phone && (
                  <a href={`tel:${edit.phone.replace(/\s/g, "")}`}>
                    <Button variant="outline" size="sm">
                      <Phone className="size-3.5" /> Call
                    </Button>
                  </a>
                )}
                {edit.phone && (
                  <a href={`https://wa.me/${edit.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">
                      WhatsApp
                    </Button>
                  </a>
                )}
                {edit.email && (
                  <a href={`mailto:${edit.email}`}>
                    <Button variant="outline" size="sm">
                      <Mail className="size-3.5" /> Email
                    </Button>
                  </a>
                )}
                <Link href="/admin/appointments?new=1">
                  <Button variant="accent" size="sm">
                    <CalendarPlus className="size-3.5" /> Book
                  </Button>
                </Link>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldWrap label="Full name" className="sm:col-span-2">
                <input className={inputBase} value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Phone">
                <input className={inputBase} value={edit.phone || ""} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Email">
                <input className={inputBase} value={edit.email || ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Date of birth">
                <input type="date" className={inputBase} value={edit.dob || ""} onChange={(e) => setEdit({ ...edit, dob: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Gender">
                <select className={inputBase} value={edit.gender || ""} onChange={(e) => setEdit({ ...edit, gender: e.target.value })}>
                  <option value="">—</option>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="O">Other</option>
                </select>
              </FieldWrap>
              <FieldWrap label="Tags" className="sm:col-span-2">
                <ListField value={edit.tags || []} onChange={(v) => setEdit({ ...edit, tags: v })} placeholder="VIP, Aligners, Anxious…" />
              </FieldWrap>
              <FieldWrap label="Clinical / CRM notes" className="sm:col-span-2">
                <textarea rows={4} className={inputBase} value={edit.notes || ""} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
              </FieldWrap>
            </div>
            {edit.id && (
              <div className="mt-8">
                <p className="text-sm font-semibold">Visit history</p>
                <ol className="relative mt-4 space-y-4 border-l border-black/10 pl-5">
                  {history.length === 0 && <li className="text-sm text-black/40">No appointments yet.</li>}
                  {history.map((a) => (
                    <li key={a.id} className="relative">
                      <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full bg-accent ring-4 ring-[#FBFBFD]" />
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{a.service}</p>
                        <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                      </div>
                      <p className="text-xs text-black/50">
                        {formatDate(a.date)} · {formatTime(a.time)} · {a.doctor}
                      </p>
                      {a.notes && <p className="mt-1 text-sm text-black/60">{a.notes}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </Drawer>
    </>
  );
}
