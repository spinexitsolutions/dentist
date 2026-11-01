"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Reveal } from "../motion";
import SectionHead from "./SectionHead";

export function PostCard({ p, i = 0, large }: { p: Post; i?: number; large?: boolean }) {
  return (
    <Reveal delay={(i % 3) * 0.08}>
      <Link href={`/blog/${p.slug}`} className="group block">
        <div className={`relative overflow-hidden rounded-[24px] ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover} alt={p.title} className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium">{p.category}</span>
          <span className="absolute bottom-4 right-4 grid size-11 translate-y-3 place-items-center rounded-full bg-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
          {formatDate(p.date)} · {p.readTime} read
        </p>
        <h3 className={`mt-2 font-semibold tracking-[-0.03em] ${large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>{p.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.excerpt}</p>
      </Link>
    </Reveal>
  );
}

export default function Blog({ posts }: { posts: Post[] }) {
  return (
    <section className="container-x py-20 md:py-32">
      <SectionHead
        eyebrow="Journal"
        title="Notes on"
        italic="healthy smiles."
        action={
          <Link href="/blog" className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition hover:bg-ink hover:text-white">
            Read the journal <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </Link>
        }
      />
      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
        {posts.slice(0, 3).map((p, i) => (
          <PostCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
