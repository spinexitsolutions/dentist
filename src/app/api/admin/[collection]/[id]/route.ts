import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { remove, update } from "@/lib/db";
import { bad, isCollection, requireAdmin } from "@/lib/api";

export async function PUT(req: Request, ctx: RouteContext<"/api/admin/[collection]/[id]">) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { collection, id } = await ctx.params;
  if (!isCollection(collection)) return bad("Unknown collection", 404);
  const rec = await update(collection, id, await req.json());
  if (!rec) return bad("Not found", 404);
  revalidatePath("/", "layout");
  return NextResponse.json(rec);
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/[collection]/[id]">) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { collection, id } = await ctx.params;
  if (!isCollection(collection)) return bad("Unknown collection", 404);
  const ok = await remove(collection, id);
  if (!ok) return bad("Not found", 404);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
