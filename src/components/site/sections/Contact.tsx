"use client";

import { Clock, Mail, MapPin, Phone, Siren } from "lucide-react";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";
import { Reveal } from "../motion";
import ContactForm from "../ContactForm";
import SectionHead from "./SectionHead";

export default function Contact({ contact }: { contact: Settings["contact"] }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]), []);
  const map = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery || contact.address)}&output=embed`;
  return (
    <section id="contact" className="container-x py-20 md:py-32">
      <SectionHead eyebrow="Visit us" title="Come say" italic="hello." text="Valet parking, step-free access and a quiet lounge with great coffee." />
      <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-card ring-1 ring-line">
          <iframe title="Map" src={map} className="absolute inset-0 size-full grayscale-[60%] contrast-[1.05]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="glass absolute bottom-4 left-4 right-4 flex items-start gap-3 rounded-2xl p-4 md:right-auto md:max-w-sm">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
            <p className="text-sm">{contact.address}</p>
          </div>
        </Reveal>
        <div className="grid gap-4">
          <Reveal delay={0.08} className="rounded-[28px] bg-card p-6 ring-1 ring-line">
            <p className="flex items-center gap-2 font-medium">
              <Clock className="size-4 text-accent" /> Opening hours
            </p>
            <ul className="mt-4 divide-y divide-line text-[15px]">
              {contact.hours.map((h) => (
                <li key={h.day} className={cn("flex justify-between py-2.5", today === h.day && "font-semibold")}>
                  <span className="flex items-center gap-2">
                    {today === h.day && <span className="size-1.5 rounded-full bg-accent" />}
                    {h.day}
                  </span>
                  <span className={h.closed ? "text-muted" : ""}>{h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.12}>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex h-full flex-col gap-6 rounded-[24px] bg-ink p-5 text-white transition hover:bg-accent">
                <Phone className="size-5" />
                <span>
                  <span className="block text-xs text-white/60">Call</span>
                  {contact.phone}
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.16}>
              <a href={`mailto:${contact.email}`} className="flex h-full flex-col gap-6 rounded-[24px] bg-card p-5 ring-1 ring-line transition hover:bg-white">
                <Mail className="size-5 text-accent" />
                <span className="break-all">
                  <span className="block text-xs text-muted">Email</span>
                  {contact.email}
                </span>
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <a href={`tel:${contact.emergency.replace(/\s/g, "")}`} className="flex items-center gap-4 rounded-[24px] bg-red-50 p-5 text-red-900 ring-1 ring-red-100">
              <span className="grid size-11 place-items-center rounded-full bg-red-500 text-white">
                <Siren className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Dental emergency?</span>
                <span className="text-sm">24/7 line · {contact.emergency}</span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
      <div className="mt-4 grid gap-8 rounded-[28px] bg-card p-6 ring-1 ring-line md:grid-cols-[1fr_1.4fr] md:p-10">
        <div>
          <h3 className="display text-4xl md:text-5xl">
            Send us a <span className="thin-word text-accent">note.</span>
          </h3>
          <p className="mt-4 text-muted">Questions about a treatment, pricing or insurance? Drop us a line and our care coordinator will call you back.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
