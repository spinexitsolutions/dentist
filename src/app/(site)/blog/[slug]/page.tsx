import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { PostCard } from "@/components/site/sections/Blog";
import { Reveal } from "@/components/site/motion";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getDB()).posts.find((x) => x.slug === slug);
  return { title: p?.title ?? "Journal", description: p?.excerpt, openGraph: p ? { images: [p.cover] } : undefined };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const db = await getDB();
  const p = db.posts.find((x) => x.slug === slug && x.published);
  if (!p) notFound();
  const more = db.posts.filter((x) => x.published && x.id !== p.id).slice(0, 3);
  return (
    <article>
      <header className="container-x max-w-4xl pt-10 text-center md:pt-36">
        <Link href="/blog" className="eyebrow hover:text-ink">
          ← Journal
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-muted">
          {p.category} · {formatDate(p.date)} · {p.readTime} read
        </p>
        <h1 className="display mt-5 text-[2.8rem] md:text-[5rem]">{p.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{p.excerpt}</p>
        <p className="mt-6 text-sm">
          By <b className="font-medium">{p.author}</b>
        </p>
      </header>
      <Reveal className="container-x mt-12">
        <div className="aspect-[16/8] overflow-hidden rounded-[32px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover} alt="" className="size-full object-cover" />
        </div>
      </Reveal>
      <div className="container-x max-w-2xl py-16 text-[18px] leading-[1.75] text-ink/85">
        {p.content.split(/\n{2,}/).map((para, i) => (
          <p key={i} className="mb-6 first-of-type:first-letter:float-left first-of-type:first-letter:mr-3 first-of-type:first-letter:font-display first-of-type:first-letter:font-semibold first-of-type:first-letter:text-7xl first-of-type:first-letter:leading-[0.8] first-of-type:first-letter:text-accent">
            {para}
          </p>
        ))}
      </div>
      {more.length > 0 && (
        <section className="container-x border-t border-line py-20">
          <h2 className="display text-4xl">
            Keep <span className="thin-word text-accent">reading</span>
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
            {more.map((m, i) => (
              <PostCard key={m.id} p={m} i={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
