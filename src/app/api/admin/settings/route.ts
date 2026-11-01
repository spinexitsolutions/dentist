import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSettings, saveSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getSettings());
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const patch = await req.json();
  const s = await saveSettings(patch);
  revalidatePath("/", "layout");
  return NextResponse.json(s);
}
