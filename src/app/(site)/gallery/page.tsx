import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import { PageHeader } from "@/components/site/Chrome";
import { BeforeAfter } from "@/components/site/sections/Gallery";
import { Reveal } from "@/components/site/motion";
import Testimonials from "@/components/site/sections/Testimonials";

export const metadata: Metadata = { title: "Smile gallery" };

export default async function GalleryPage() {
  const db = await getDB();
  return (
    <>
      <PageHeader eyebrow="Smile gallery" title="Before." italic="After. Happier." text="Drag across each image to see the transformation. All cases shown with patient consent." />
      <section className="container-x grid gap-10 pb-24 md:grid-cols-2">
        {db.gallery.map((g, i) => (
          <Reveal key={g.id} delay={(i % 2) * 0.1}>
            <BeforeAfter item={g} />
            <div className="mt-4 flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">{g.title}</h2>
              <p className="text-sm text-muted">{g.treatment}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <Testimonials items={db.testimonials} rating={db.settings.hero.rating} reviews={db.settings.hero.reviews} />
      <div className="h-20" />
    </>
  );
}
