"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { ToothMark } from "@/components/site/icons";
import { OrbitBackdrop, OrbitBubbles, SmileLine } from "@/components/site/Orbit";
import { inputBase } from "@/components/admin/ui";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=300&q=80&auto=format&fit=crop`;
const FACES = [
  "1559839734-2b71ea197ec2",
  "1438761681033-6461ffad8d80",
  "1612349317150-e413f6a5b16d",
  "1531123897727-8f129e1688ce",
  "1594824476967-48c8b964273f",
  "1500648767791-00dcc994a43e",
  "1622253692010-333f2da6031d",
  "1534528741775-53994a69daeb",
].map((id) => ({ img: u(id) }));

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute inset-0">
        <OrbitBackdrop />
        <OrbitBubbles items={FACES} labels={false} sizes={[88, 68, 56]} mobileScale={0.55} speed={120} />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px] rounded-[32px] bg-white/90 p-7 text-center shadow-[0_40px_80px_-40px_rgba(11,30,51,0.45)] ring-1 ring-ink/5 backdrop-blur-xl md:p-9"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          const data = Object.fromEntries(new FormData(e.currentTarget));
          const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
          if (r.ok) window.location.href = "/admin";
          else {
            setError((await r.json()).error || "Login failed");
            setLoading(false);
          }
        }}
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-white ring-8 ring-pop/50">
          <ToothMark className="size-6" />
        </span>
        <h1 className="display mt-6 text-5xl">
          Welcome{" "}
          <SmileLine play delay={0.5}>
            <span className="thin-word text-accent">back.</span>
          </SmileLine>
        </h1>
        <p className="mt-3 text-ink/55">Sign in to Studio OS — appointments, patients and your website in one calm place.</p>
        <div className="mt-7 space-y-3 text-left">
          <input name="email" type="email" required defaultValue="admin@ivory.studio" placeholder="Email" className={`${inputBase} !rounded-2xl !py-3.5`} />
          <input name="password" type="password" required defaultValue="ivory2026" placeholder="Password" className={`${inputBase} !rounded-2xl !py-3.5`} />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white transition hover:bg-accent disabled:opacity-60">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Sign in <ArrowRight className="size-4" />
            </>
          )}
        </button>
        <p className="mt-5 rounded-2xl bg-pop/30 p-3 text-xs leading-relaxed text-ink/60">
          Demo: <b>admin@ivory.studio</b> / <b>ivory2026</b> (pre-filled). Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> in production.
        </p>
      </motion.form>
    </div>
  );
}
