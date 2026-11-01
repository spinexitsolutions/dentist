"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { TOOTH_PATH } from "@/components/site/icons";
import { inputBase } from "@/components/admin/ui";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-[600px] rounded-full bg-accent/30 blur-[120px]" />
        <p className="relative text-lg font-semibold tracking-tight">
          Ivory <span className="serif-i font-normal text-white/60">studio OS</span>
        </p>
        <div className="relative m-auto">
          <svg viewBox="0 0 100 100" className="size-56" fill="none">
            <motion.path d={TOOTH_PATH} stroke="var(--accent)" strokeWidth={1.2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }} />
            <motion.path d={TOOTH_PATH} stroke="white" strokeOpacity={0.15} strokeWidth={0.6} style={{ scale: 1.15, transformOrigin: "50% 50%" }} />
          </svg>
        </div>
        <p className="relative max-w-md text-3xl font-medium leading-tight tracking-[-0.03em]">
          Your entire practice — appointments, patients, leads and website — <span className="serif-i text-accent">in one calm place.</span>
        </p>
      </div>
      <div className="flex items-center justify-center p-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
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
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">Welcome back.</h1>
          <p className="mt-2 text-black/50">Sign in to manage your studio.</p>
          <div className="mt-8 space-y-3">
            <input name="email" type="email" required defaultValue="admin@ivory.studio" placeholder="Email" className={`${inputBase} !py-3.5`} />
            <input name="password" type="password" required defaultValue="ivory2026" placeholder="Password" className={`${inputBase} !py-3.5`} />
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-medium text-white transition hover:bg-accent disabled:opacity-60">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <>Sign in <ArrowRight className="size-4" /></>}
          </button>
          <p className="mt-6 rounded-2xl bg-white p-4 text-xs leading-relaxed text-black/50 ring-1 ring-black/5">
            Demo credentials are pre-filled: <b>admin@ivory.studio</b> / <b>ivory2026</b>. Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> env vars in production.
          </p>
        </motion.form>
      </div>
    </div>
  );
}
