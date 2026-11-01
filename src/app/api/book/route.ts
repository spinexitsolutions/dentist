import { NextResponse } from "next/server";
import { getDB, insert, uid } from "@/lib/db";
import { bad, clean } from "@/lib/api";
import type { Appointment, Patient } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const data = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    service: clean(body.service, 120),
    doctor: clean(body.doctor, 120) || "Any available",
    date: clean(body.date, 10),
    time: clean(body.time, 5),
    notes: clean(body.notes, 1000),
  };
  if (!data.name || !data.phone || !data.date || !data.time || !data.service) return bad("Please fill in all required fields.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !/^\d{2}:\d{2}$/.test(data.time)) return bad("Invalid date or time.");

  const db = await getDB();
  const taken = db.appointments.some(
    (a) => a.date === data.date && a.time === data.time && a.status !== "cancelled" && (data.doctor === "Any available" || a.doctor === data.doctor),
  );
  if (taken && data.doctor !== "Any available") return bad("That slot was just taken — please pick another time.", 409);

  const norm = (s: string) => s.replace(/\D/g, "").slice(-10);
  let patient = db.patients.find((p) => (data.phone && norm(p.phone) === norm(data.phone)) || (data.email && p.email.toLowerCase() === data.email.toLowerCase()));
  if (!patient) {
    patient = (await insert("patients", {
      id: uid("pat"),
      name: data.name,
      phone: data.phone,
      email: data.email,
      dob: "",
      gender: "",
      notes: "",
      tags: ["New"],
      createdAt: new Date().toISOString(),
    } as Patient)) as Patient;
  }

  const appt = (await insert("appointments", {
    ...data,
    id: uid("apt"),
    status: "pending",
    source: "Website",
    patientId: patient.id,
    createdAt: new Date().toISOString(),
  } as Appointment)) as Appointment;

  return NextResponse.json({ ok: true, id: appt.id });
}
