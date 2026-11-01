import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "./auth";
import { COLLECTIONS, type CollectionKey } from "./types";

export async function requireAdmin() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export function isCollection(k: string): k is CollectionKey {
  return (COLLECTIONS as string[]).includes(k);
}

export const bad = (msg: string, status = 400) => NextResponse.json({ error: msg }, { status });

export function clean(v: unknown, max = 2000) {
  return String(v ?? "").trim().slice(0, max);
}
