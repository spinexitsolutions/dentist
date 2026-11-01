import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import { PageHeader } from "@/components/site/Chrome";
import { PostCard } from "@/components/site/sections/Blog";

export const metadata: Metadata = { title: "Journal" };

export default async function BlogPage() {
  const posts = (await getDB()).posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  const [first, ...rest] = posts;
  return (
    <>
      <PageHeader eyebrow="Journal" title="Notes on" italic="healthy smiles." text="Practical advice, treatment explainers and stories from the studio — written by our specialists." />
      <section className="container-x pb-24">
        {first ? (
          <>
            <PostCard p={first} large />
            <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
              {rest.map((p, i) => (
                <PostCard key={p.id} p={p} i={i} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted">No posts yet.</p>
        )}
      </section>
    </>
  );
}
