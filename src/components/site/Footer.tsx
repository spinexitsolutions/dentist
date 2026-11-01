"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import type { Service, Settings } from "@/lib/types";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "./icons";
import { NAV_LINKS } from "./Navbar";
import { SmileLine } from "./Orbit";

function Newsletter() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState("loading");
        const email = new FormData(e.currentTarget).get("email");
        const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
        setState(r.ok ? "done" : "error");
      }}
      className="flex w-full max-w-md items-center rounded-full bg-white/[.07] p-1.5 ring-1 ring-white/10 focus-within:ring-white/30"
    >
      <input name="email" type="email" required placeholder="Your email" className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/40" disabled={state === "done"} />
      <button className="flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-ink transition hover:bg-accent hover:text-white" disabled={state === "loading" || state === "done"}>
        {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : state === "done" ? <Check className="size-4" /> : null}
        {state === "done" ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}

export default function Footer({ brand, contact, social, services }: { brand: Settings["brand"]; contact: Settings["contact"]; social: Settings["social"]; services: Service[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0.2, 1], ["60%", "0%"]);
  const letters = brand.shortName.split("");
  const socials = [
    { href: social.instagram, I: InstagramIcon, label: "Instagram" },
    { href: social.facebook, I: FacebookIcon, label: "Facebook" },
    { href: social.youtube, I: YoutubeIcon, label: "YouTube" },
    { href: social.linkedin, I: LinkedinIcon, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer ref={ref} className="relative mt-10 overflow-hidden rounded-t-[36px] bg-ink pb-28 pt-16 text-white md:pb-0 md:pt-24">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="display text-4xl md:text-5xl">
              Smile <SmileLine><span className="thin-word text-pop">often.</span></SmileLine>
            </p>
            <p className="mt-4 max-w-sm text-white/60">Monthly notes on oral health, new treatments and members-only offers. No spam, ever.</p>
            <div className="mt-6">
              <Newsletter />
            </div>
          </div>
          <div>
            <p className="eyebrow !text-white/40">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/75 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow !text-white/40">Treatments</p>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}`} className="text-white/75 transition hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow !text-white/40">Contact</p>
            <ul className="mt-4 space-y-2.5 text-white/75">
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="text-white/50">{contact.address}</li>
            </ul>
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, I, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full bg-white/[.07] transition hover:bg-accent">
                  <I className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/45 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-center gap-1 hover:text-white">
              Staff login <ArrowUpRight className="size-3.5" />
            </Link>
            <button onClick={() => {
                const l = (window as unknown as { __lenis?: { scrollTo(n: number): void } }).__lenis;
                if (l) l.scrollTo(0);
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }} className="flex items-center gap-1 hover:text-white">
              Back to top <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-6 flex select-none justify-center overflow-hidden leading-[0.78]" aria-hidden>
        {letters.map((l, i) => (
          <motion.span
            key={i}
            style={{ y }}
            transition={{ delay: i * 0.05 }}
            className="display inline-block bg-gradient-to-b from-white/90 to-white/5 bg-clip-text text-[30vw] text-transparent"
          >
            {l}
          </motion.span>
        ))}
      </div>
    </footer>
  );
}
