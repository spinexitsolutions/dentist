"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Mail, Phone, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import type { Lead, LeadStatus, Patient } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { api, useCollection } from "@/components/admin/api";
import { Badge, Button, Card, Drawer, Empty, PageTitle, STATUS_TONE, StatusSelect, useToast } from "@/components/admin/ui";

const STAGES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];

export default function Leads() {
  const { items, loading, save, remove } = useCollection("leads");
  const [open, setOpen] = useState<Lead | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const toast = useToast();

  const move = async (l: Lead, s: LeadStatus) => {
    await save(l.id, { status: s });
    if (open?.id === l.id) setOpen({ ...l, status: s });
    toast(`Moved to ${s}`);
  };

  const convert = async (l: Lead) => {
    await api.post<Patient>("/api/admin/patients", { name: l.name, phone: l.phone, email: l.email, notes: `From enquiry: ${l.subject}\n${l.message}`, tags: ["Lead"], dob: "", gender: "" });
    await move(l, "won");
    toast("Converted to patient");
  };

  return (
    <>
      <PageTitle title="Leads & inbox" subtitle="Enquiries from the website contact form. Drag cards between stages." />
      {loading ? (
        <Card className="h-64 animate-pulse" />
      ) : items.length === 0 ? (
        <Empty title="Inbox zero" text="New website enquiries will land here." />
      ) : (
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
          {STAGES.map((s) => {
            const col = items.filter((l) => l.status === s);
            return (
              <div
                key={s}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  const l = items.find((x) => x.id === drag);
                  if (l && l.status !== s) move(l, s);
                  setDrag(null);
                }}
                className={cn("w-[280px] shrink-0 rounded-[22px] bg-black/[.03] p-2", drag && "ring-2 ring-accent/30")}
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <Badge tone={STATUS_TONE[s]}>{s}</Badge>
                  <span className="text-xs text-black/40">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((l) => (
                    <motion.div
                      layout
                      key={l.id}
                      draggable
                      onDragStart={() => setDrag(l.id)}
                      onDragEnd={() => setDrag(null)}
                      onClick={() => setOpen(l)}
                      className="cursor-grab rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{l.name}</p>
                        <span className="shrink-0 text-[11px] text-black/40">{formatDate(l.createdAt, { day: "numeric", month: "short" })}</span>
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-black/70">{l.subject}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-black/50">{l.message}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Drawer
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.subject || "Lead"}
        footer={
          open && (
            <>
              <Button
                variant="danger"
                className="mr-auto"
                onClick={async () => {
                  if (!confirm("Delete this lead?")) return;
                  await remove(open.id);
                  setOpen(null);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
              <Button variant="outline" onClick={() => convert(open)}>
                <UserPlus className="size-4" /> Convert to patient
              </Button>
              <a href="/admin/appointments?new=1">
                <Button>
                  <CalendarPlus className="size-4" /> Book
                </Button>
              </a>
            </>
          )
        }
      >
        {open && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold tracking-tight">{open.name}</p>
                <p className="text-sm text-black/50">{formatDate(open.createdAt, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <StatusSelect value={open.status} options={STAGES} onChange={(v) => move(open, v)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {open.phone && (
                <a href={`tel:${open.phone.replace(/\s/g, "")}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="size-3.5" /> {open.phone}
                  </Button>
                </a>
              )}
              {open.email && (
                <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="size-3.5" /> Reply by email
                  </Button>
                </a>
              )}
              {open.phone && (
                <a href={`https://wa.me/${open.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${open.name.split(" ")[0]}, thanks for reaching out to us!`)}`} target="_blank" rel="noreferrer">
                  <Button variant="accent" size="sm">
                    WhatsApp
                  </Button>
                </a>
              )}
            </div>
            <Card className="whitespace-pre-wrap text-[15px] leading-relaxed">{open.message}</Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
