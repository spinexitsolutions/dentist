import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || "";
  const doctor = searchParams.get("doctor") || "";
  const db = await getDB();
  const taken = db.appointments
    .filter((a) => a.date === date && a.status !== "cancelled" && (!doctor || doctor === "Any available" || a.doctor === doctor))
    .map((a) => a.time);
  return NextResponse.json({ taken });
}
