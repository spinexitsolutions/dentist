import type { Metadata } from "next";
import Link from "next/link";
import { getDB } from "@/lib/db";
import Hero from "@/components/site/sections/Hero";
import { HERO_VARIANTS } from "@/components/site/heroes/types";

export const metadata: Metadata = { title: "Hero designs", robots: { index: false } };

/** Side-by-side preview of every hero design, so the clinic can choose one. */
export default async function DesignsPage() {
  const db = await getDB();
  const s = db.settings;
  return (
    <div className="pb-20">
      <div className="container-x pb-6 pt-10 md:pt-14">
        <p className="eyebrow">Hero designs</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">
          Pick your <span className="thin-word text-accent">first impression.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-ink/60">
          Five hero layouts with the same content. Choose one in Admin → Site settings → Hero &amp; banner. The one currently live is marked.
        </p>
      </div>
      {HERO_VARIANTS.map((v, i) => (
        <section key={v.key} className="mt-10 border-t border-ink/10 pt-6">
          <div className="container-x mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-accent">Design {i + 1}</p>
              <h2 className="display text-4xl">
                {v.name} {s.hero.variant === v.key && <span className="ml-2 rounded-full bg-accent px-3 py-1 align-middle font-sans text-xs font-semibold text-white">LIVE</span>}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-ink/60">{v.text}</p>
            </div>
            <Link href={`/?hero=${v.key}`} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Open on homepage ↗
            </Link>
          </div>
          <Hero variant={v.key} hero={s.hero} avatars={db.testimonials} services={db.services} contact={s.contact} gallery={db.gallery} doctors={db.doctors} />
        </section>
      ))}
    </div>
  );
}
