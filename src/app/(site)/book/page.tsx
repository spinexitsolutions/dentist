import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import { PageHeader } from "@/components/site/Chrome";
import BookingWizard from "@/components/site/BookingWizard";

export const metadata: Metadata = { title: "Book a visit" };

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const sp = await searchParams;
  const db = await getDB();
  const service = typeof sp.service === "string" ? sp.service : undefined;
  const plan = typeof sp.plan === "string" ? sp.plan : undefined;
  return (
    <>
      <PageHeader eyebrow="Book a visit" title="Your smile," italic="your schedule." text="Choose a treatment, a specialist and a time that suits you. It takes less than a minute." />
      <section className="container-x pb-24">
        <BookingWizard services={db.services} doctors={db.doctors} booking={db.settings.booking} initialService={service} plan={plan} />
      </section>
    </>
  );
}
