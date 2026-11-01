import type { ReactNode } from "react";
import { getDB } from "@/lib/db";
import type { SectionKey } from "@/lib/types";
import Hero from "@/components/site/sections/Hero";
import Ticker from "@/components/site/sections/Ticker";
import Statement from "@/components/site/sections/Statement";
import Services from "@/components/site/sections/Services";
import Stats from "@/components/site/sections/Stats";
import About from "@/components/site/sections/About";
import Process from "@/components/site/sections/Process";
import Gallery from "@/components/site/sections/Gallery";
import Doctors from "@/components/site/sections/Doctors";
import Technology from "@/components/site/sections/Technology";
import Testimonials from "@/components/site/sections/Testimonials";
import Pricing from "@/components/site/sections/Pricing";
import Faq from "@/components/site/sections/Faq";
import Blog from "@/components/site/sections/Blog";
import Cta from "@/components/site/sections/Cta";
import Contact from "@/components/site/sections/Contact";

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const db = await getDB();
  const s = db.settings;
  const posts = db.posts.filter((p) => p.published);

  const render: Record<SectionKey, () => ReactNode> = {
    statement: () => <Statement text={s.statement.text} />,
    services: () => <Services services={db.services} />,
    stats: () => <Stats stats={db.stats} />,
    about: () => <About about={s.about} brand={s.brand} />,
    process: () => <Process steps={db.steps} />,
    gallery: () => <Gallery items={db.gallery} />,
    doctors: () => <Doctors doctors={db.doctors} />,
    technology: () => <Technology features={db.features} />,
    testimonials: () => <Testimonials items={db.testimonials} rating={s.hero.rating} reviews={s.hero.reviews} />,
    pricing: () => <Pricing plans={db.plans} insurers={s.insurers} />,
    faq: () => <Faq faqs={db.faqs} contact={s.contact} />,
    blog: () => (posts.length ? <Blog posts={posts} /> : null),
    cta: () => <Cta cta={s.cta} contact={s.contact} images={[...db.doctors.map((d) => d.image), ...db.testimonials.slice(0, 4).map((t) => t.avatar)]} />,
    contact: () => <Contact contact={s.contact} />,
  };

  return (
    <>
      <Hero
        variant={typeof sp.hero === "string" ? sp.hero : s.hero.variant}
        hero={s.hero}
        avatars={db.testimonials}
        services={db.services}
        contact={s.contact}
        gallery={db.gallery}
        doctors={db.doctors}
      />
      <Ticker services={db.services} />
      {s.sections
        .filter((x) => x.enabled && render[x.key])
        .map((x) => (
          <div key={x.key} id={x.key}>
            {render[x.key]()}
          </div>
        ))}
    </>
  );
}
