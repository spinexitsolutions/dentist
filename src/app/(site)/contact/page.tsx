import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import { PageHeader } from "@/components/site/Chrome";
import Contact from "@/components/site/sections/Contact";
import Faq from "@/components/site/sections/Faq";

export const metadata: Metadata = { title: "Visit us" };

export default async function ContactPage() {
  const db = await getDB();
  return (
    <>
      <PageHeader eyebrow="Contact" title="We'd love to" italic="see you." text="Call, WhatsApp, email or simply walk in. We're right here." />
      <div className="-mt-20 md:-mt-32">
        <Contact contact={db.settings.contact} />
      </div>
      <Faq faqs={db.faqs} contact={db.settings.contact} />
    </>
  );
}
