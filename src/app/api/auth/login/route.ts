import { NextResponse } from "next/server";
import { checkCredentials, createToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { email = "", password = "" } = await req.json().catch(() => ({}));
  if (!checkCredentials(String(email), String(password))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createToken(String(email)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
