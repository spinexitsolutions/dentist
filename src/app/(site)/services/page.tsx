import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getDB } from "@/lib/db";
import { PageHeader } from "@/components/site/Chrome";
import { Icon } from "@/components/site/icons";
import { Reveal } from "@/components/site/motion";
import Cta from "@/components/site/sections/Cta";

export const metadata: Metadata = { title: "Treatments" };

export default async function ServicesPage() {
  const db = await getDB();
  return (
    <>
      <PageHeader eyebrow="Treatments" title="Care for every" italic="kind of smile." text="From preventive hygiene to complete smile makeovers — every treatment is planned digitally, priced transparently and delivered gently." />
      <section className="container-x pb-20">
        <div className="divide-y divide-line border-y border-line">
          {db.services.map((s, i) => (
            <Reveal key={s.id} y={20}>
              <Link href={`/services/${s.slug}`} className="group grid items-center gap-5 py-7 md:grid-cols-[60px_1.2fr_1fr_160px_56px] md:gap-8">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-center gap-5">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl md:size-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">{s.title}</h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                      <Icon name={s.icon} className="size-4 text-accent" />
                      {s.duration}
                    </p>
                  </div>
                </div>
                <p className="text-[15px] text-muted">{s.short}</p>
                <p className="font-medium">{s.price}</p>
                <span className="hidden size-12 place-items-center rounded-full ring-1 ring-line transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-white md:grid">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <Cta cta={db.settings.cta} contact={db.settings.contact} />
    </>
  );
}
