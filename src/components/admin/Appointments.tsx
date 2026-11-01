"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, KanbanSquare, List, Phone, Plus, Search, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Appointment, AppointmentStatus, Doctor, Service } from "@/lib/types";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { api, useCollection } from "./api";
import { Badge, Button, Card, Drawer, Empty, FieldWrap, PageTitle, Segmented, STATUS_TONE, StatusSelect, inputBase, useToast } from "./ui";

const STATUSES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "no-show"];
const SOURCES = ["Website", "Phone", "Walk-in", "Instagram", "Referral", "WhatsApp"];
const pad = (n: number) => String(n).padStart(2, "0");
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function Appointments() {
  const sp = useSearchParams();
  const { items, loading, create, save, remove } = useCollection("appointments");
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [view, setView] = useState<"list" | "board">("list");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>(sp.get("status") || "all");
  const [range, setRange] = useState<"upcoming" | "past" | "all">("all");
  const [edit, setEdit] = useState<Partial<Appointment> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    api.get<Service[]>("/api/admin/services").then(setServices);
    api.get<Doctor[]>("/api/admin/doctors").then(setDoctors);
    if (sp.get("new")) setEdit({ status: "confirmed", source: "Phone", date: todayIso(), time: "10:30", doctor: "Any available" });
  }, [sp]);

  const filtered = useMemo(() => {
    const t = todayIso();
    return items
      .filter((a) => status === "all" || a.status === status)
      .filter((a) => (range === "upcoming" ? a.date >= t : range === "past" ? a.date < t : true))
      .filter((a) => !q || `${a.name} ${a.phone} ${a.email} ${a.service} ${a.doctor}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (range === "past" ? (b.date + b.time).localeCompare(a.date + a.time) : (a.date + a.time).localeCompare(b.date + b.time)));
  }, [items, status, range, q]);

  const setStat = async (a: Appointment, s: AppointmentStatus) => {
    await save(a.id, { status: s });
    toast(`Marked as ${s}`);
  };

  const submit = async () => {
    if (!edit?.name || !edit.date || !edit.time) return toast("Name, date and time are required", "err");
    setSaving(true);
    try {
      if (edit.id) await save(edit.id, edit);
      else await create({ ...edit, source: edit.source || "Phone", status: edit.status || "confirmed", createdAt: new Date().toISOString() } as Appointment);
      toast(edit.id ? "Appointment updated" : "Appointment created");
      setEdit(null);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof Appointment, v: string) => setEdit((e) => ({ ...e, [k]: v }));

  return (
    <>
      <PageTitle
        title="Appointments"
        subtitle={`${items.length} total · ${items.filter((a) => a.status === "pending").length} awaiting confirmation`}
        actions={
          <>
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "list", label: <><List className="size-3.5" /> List</> },
                { value: "board", label: <><KanbanSquare className="size-3.5" /> Board</> },
              ]}
            />
            <Button onClick={() => setEdit({ status: "confirmed", source: "Phone", date: todayIso(), time: "10:30", doctor: "Any available" })}>
              <Plus className="size-4" /> New
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, treatment…" className={cn(inputBase, "bg-white pl-9 ring-black/5")} />
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {["all", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={cn("whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] capitalize transition", status === s ? "bg-ink text-white" : "bg-white text-black/60 ring-1 ring-black/5 hover:text-ink")}>
              {s}
            </button>
          ))}
        </div>
        <div className="md:ml-auto">
          <Segmented value={range} onChange={setRange} options={[{ value: "all", label: "All" }, { value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" }]} />
        </div>
      </div>

      {loading ? (
        <Card className="h-64 animate-pulse" />
      ) : view === "list" ? (
        filtered.length === 0 ? (
          <Empty title="No appointments" text="Nothing matches these filters yet." />
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-black/5 text-[12px] uppercase tracking-wider text-black/40">
                  <tr>
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-3 py-3 font-medium">When</th>
                    <th className="px-3 py-3 font-medium">Treatment</th>
                    <th className="px-3 py-3 font-medium">Source</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  <AnimatePresence initial={false}>
                    {filtered.map((a) => (
                      <motion.tr key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cursor-pointer transition hover:bg-black/[.015]" onClick={() => setEdit(a)}>
                        <td className="px-5 py-3.5">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-black/45">{a.phone}</p>
                        </td>
                        <td className="px-3 py-3.5">
                          <p>{formatDate(a.date, { weekday: "short", day: "numeric", month: "short" })}</p>
                          <p className="text-xs text-black/45">{formatTime(a.time)}</p>
                        </td>
                        <td className="px-3 py-3.5">
                          <p>{a.service}</p>
                          <p className="text-xs text-black/45">{a.doctor}</p>
                        </td>
                        <td className="px-3 py-3.5 text-black/60">{a.source}</td>
                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <StatusSelect value={a.status} options={STATUSES} onChange={(v) => setStat(a, v)} />
                        </td>
                        <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="inline-grid size-8 place-items-center rounded-full hover:bg-black/5" aria-label="Call">
                            <Phone className="size-4 text-black/50" />
                          </a>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
          {STATUSES.map((s) => {
            const col = filtered.filter((a) => a.status === s);
            return (
              <div
                key={s}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  const a = items.find((x) => x.id === dragId);
                  if (a && a.status !== s) setStat(a, s);
                  setDragId(null);
                }}
                className={cn("w-[270px] shrink-0 rounded-[22px] bg-black/[.03] p-2 transition", dragId && "ring-2 ring-dashed ring-accent/30")}
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <Badge tone={STATUS_TONE[s]}>{s}</Badge>
                  <span className="text-xs text-black/40">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((a) => (
                    <motion.div
                      layout
                      key={a.id}
                      draggable
                      onDragStart={() => setDragId(a.id)}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => setEdit(a)}
                      className="cursor-grab rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 active:cursor-grabbing"
                    >
                      <p className="font-medium">{a.name}</p>
                      <p className="mt-0.5 text-xs text-black/50">{a.service}</p>
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-black/60">
                        <CalendarCheck className="size-3.5" />
                        {formatDate(a.date, { day: "numeric", month: "short" })} · {formatTime(a.time)}
                      </p>
                    </motion.div>
                  ))}
                  {col.length === 0 && <p className="px-2 py-6 text-center text-xs text-black/30">Drop here</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "Edit appointment" : "New appointment"}
        footer={
          <>
            {edit?.id && (
              <Button
                variant="danger"
                className="mr-auto"
                onClick={async () => {
                  if (!confirm("Delete this appointment?")) return;
                  await remove(edit.id!);
                  setEdit(null);
                  toast("Deleted");
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
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldWrap label="Patient name" className="sm:col-span-2">
              <input className={inputBase} value={edit.name || ""} onChange={(e) => set("name", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Phone">
              <input className={inputBase} value={edit.phone || ""} onChange={(e) => set("phone", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Email">
              <input className={inputBase} value={edit.email || ""} onChange={(e) => set("email", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Treatment">
              <select className={inputBase} value={edit.service || ""} onChange={(e) => set("service", e.target.value)}>
                <option value="">Select…</option>
                {[...services.map((s) => s.title), "General check-up"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
                {edit.service && !services.some((s) => s.title === edit.service) && edit.service !== "General check-up" && <option>{edit.service}</option>}
              </select>
            </FieldWrap>
            <FieldWrap label="Doctor">
              <select className={inputBase} value={edit.doctor || ""} onChange={(e) => set("doctor", e.target.value)}>
                {["Any available", ...doctors.map((d) => d.name)].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </FieldWrap>
            <FieldWrap label="Date">
              <input type="date" className={inputBase} value={edit.date || ""} onChange={(e) => set("date", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Time">
              <input type="time" className={inputBase} value={edit.time || ""} onChange={(e) => set("time", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Status">
              <select className={inputBase} value={edit.status || "pending"} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </FieldWrap>
            <FieldWrap label="Source">
              <select className={inputBase} value={edit.source || "Phone"} onChange={(e) => set("source", e.target.value)}>
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </FieldWrap>
            <FieldWrap label="Notes" className="sm:col-span-2">
              <textarea rows={4} className={inputBase} value={edit.notes || ""} onChange={(e) => set("notes", e.target.value)} />
            </FieldWrap>
            {edit.createdAt && <p className="text-xs text-black/40 sm:col-span-2">Created {formatDate(edit.createdAt)} via {edit.source}</p>}
          </div>
        )}
      </Drawer>
    </>
  );
}
