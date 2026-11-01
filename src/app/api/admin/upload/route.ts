import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdmin, bad } from "@/lib/api";

const DIR = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "uploads");
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return bad("No file");
  const ext = TYPES[file.type];
  if (!ext) return bad("Only JPG, PNG, WEBP, GIF or AVIF images are allowed.");
  if (file.size > 8 * 1024 * 1024) return bad("Image must be under 8 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${ext}`;
  try {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(path.join(DIR, name), buf);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    // read-only FS: fall back to an inline data URL
    return NextResponse.json({ url: `data:${file.type};base64,${buf.toString("base64")}` });
  }
}
