import { NextResponse } from "next/server";
import { getDB, insert } from "@/lib/db";
import { bad, clean } from "@/lib/api";
import type { Subscriber } from "@/lib/types";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = clean(b.email, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email.");
  const db = await getDB();
  if (!db.subscribers.some((s) => s.email === email)) {
    await insert("subscribers", { email, createdAt: new Date().toISOString() } as Subscriber);
  }
  return NextResponse.json({ ok: true });
}
