import { NextResponse } from "next/server";
import { insert } from "@/lib/db";
import { bad, clean } from "@/lib/api";
import type { Lead } from "@/lib/types";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const lead = {
    name: clean(b.name, 120),
    email: clean(b.email, 160),
    phone: clean(b.phone, 40),
    subject: clean(b.subject, 160) || "General enquiry",
    message: clean(b.message, 3000),
  };
  if (!lead.name || (!lead.email && !lead.phone) || !lead.message) return bad("Please add your name, a way to reach you and a message.");
  await insert("leads", { ...lead, status: "new", createdAt: new Date().toISOString() } as Lead);
  return NextResponse.json({ ok: true });
}
