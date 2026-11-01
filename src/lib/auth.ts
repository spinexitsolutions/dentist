import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE = "ivory_admin";
const SECRET = process.env.ADMIN_SECRET || "ivory-demo-secret-change-me";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ivory.studio";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ivory2026";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string | null) {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email: string; exp: number };
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSession() {
  const c = await cookies();
  return verifyToken(c.get(SESSION_COOKIE)?.value);
}

export function checkCredentials(email: string, password: string) {
  const a = Buffer.from(`${email.trim().toLowerCase()}:${password}`);
  const b = Buffer.from(`${ADMIN_EMAIL.toLowerCase()}:${ADMIN_PASSWORD}`);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
