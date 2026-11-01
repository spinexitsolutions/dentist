import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { resetDemo } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;
  await resetDemo();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
