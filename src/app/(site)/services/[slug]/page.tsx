import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Clock, Wallet } from "lucide-react";
import { getDB } from "@/lib/db";
import { Icon } from "@/components/site/icons";
import { Reveal } from "@/components/site/motion";
import Faq from "@/components/site/sections/Faq";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = (await getDB()).services.find((x) => x.slug === slug);
  return { title: s?.title ?? "Treatment", description: s?.short };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const db = await getDB();
  const s = db.services.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = db.services.filter((x) => x.id !== s.id).slice(0, 3);

  return (
    <>
      <section className="container-x pt-10 md:pt-36">
        <Link href="/services" className="eyebrow hover:text-ink">
          ← All treatments
        </Link>
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-deep">
              <Icon name={s.icon} className="size-6" />
            </span>
            <h1 className="display mt-6 text-[3.2rem] md:text-[6.5rem]">{s.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{s.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm ring-1 ring-line">
                <Wallet className="size-4 text-accent" /> {s.price}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm ring-1 ring-line">
                <Clock className="size-4 text-accent" /> {s.duration}
              </span>
            </div>
            <Link href={`/book?service=${encodeURIComponent(s.title)}`} className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 font-medium text-white transition hover:bg-accent">
              Book {s.title.toLowerCase()}
              <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </div>
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[40px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.title} className="size-full object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-4 md:grid-cols-4">
          {s.benefits.map((b, i) => (
            <Reveal key={b} delay={i * 0.06} className="rounded-[24px] bg-card p-6 ring-1 ring-line">
              <Check className="size-5 text-accent" strokeWidth={2.5} />
              <p className="mt-10 text-lg font-medium tracking-tight">{b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Faq faqs={db.faqs.slice(0, 4)} contact={db.settings.contact} />

      <section className="container-x pb-24">
        <h2 className="display text-4xl md:text-5xl">
          You may also <span className="thin-word text-accent">like</span>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {others.map((o) => (
            <Link key={o.id} href={`/services/${o.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.image} alt="" className="absolute inset-0 size-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-2xl font-semibold tracking-tight">{o.title}</p>
                <p className="text-sm text-white/70">{o.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
