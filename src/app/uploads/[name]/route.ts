import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "uploads");
const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  if (!/^[a-z0-9]+\.(jpg|png|webp|gif|avif)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(DIR, name));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": MIME[name.split(".").pop()!], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
