import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import { PageHeader } from "@/components/site/Chrome";
import { DoctorCard } from "@/components/site/sections/Doctors";
import About from "@/components/site/sections/About";
import Stats from "@/components/site/sections/Stats";

export const metadata: Metadata = { title: "Our doctors" };

export default async function TeamPage() {
  const db = await getDB();
  return (
    <>
      <PageHeader eyebrow="The specialists" title="Meet the people behind" italic="your smile." text="Every specialist at the studio is hand-picked for clinical excellence — and for a gentle chair-side manner." />
      <section className="container-x grid gap-x-5 gap-y-12 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        {db.doctors.map((d, i) => (
          <DoctorCard key={d.id} d={d} i={i} />
        ))}
      </section>
      <About about={db.settings.about} brand={db.settings.brand} />
      <Stats stats={db.stats} />
    </>
  );
}
