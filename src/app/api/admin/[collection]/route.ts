import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { insert, list, replaceCollection } from "@/lib/db";
import { bad, isCollection, requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: RouteContext<"/api/admin/[collection]">) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { collection } = await ctx.params;
  if (!isCollection(collection)) return bad("Unknown collection", 404);
  return NextResponse.json(await list(collection));
}

export async function POST(req: Request, ctx: RouteContext<"/api/admin/[collection]">) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { collection } = await ctx.params;
  if (!isCollection(collection)) return bad("Unknown collection", 404);
  const body = await req.json();
  if (!body.createdAt && ["appointments", "patients", "leads", "subscribers"].includes(collection)) body.createdAt = new Date().toISOString();
  const rec = await insert(collection, body);
  revalidatePath("/", "layout");
  return NextResponse.json(rec);
}

/** Replace the whole collection (used for drag re-ordering). */
export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/[collection]">) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { collection } = await ctx.params;
  if (!isCollection(collection)) return bad("Unknown collection", 404);
  const body = await req.json();
  if (!Array.isArray(body)) return bad("Expected an array");
  const items = await replaceCollection(collection, body);
  revalidatePath("/", "layout");
  return NextResponse.json(items);
}
