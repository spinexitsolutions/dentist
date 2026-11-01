import type { Doctor, GalleryItem, Service, Settings, Testimonial } from "@/lib/types";

export type HeroProps = {
  hero: Settings["hero"];
  avatars: Testimonial[];
  services: Service[];
  contact: Settings["contact"];
  gallery: GalleryItem[];
  doctors: Doctor[];
};

export const HERO_VARIANTS = [
  { key: "bento", name: "Bento", text: "Apple-style grid of tiles — headline, portrait, rating and rotating treatments." },
  { key: "reveal", name: "Smile Reveal", text: "Full-bleed smile photo with a before/after line that follows the cursor or finger." },
  { key: "cinematic", name: "Cinematic", text: "Full-screen clinic photo with a slow zoom and a glass quick-booking card." },
  { key: "orbit", name: "Smile Orbit", text: "Minimal centred headline with a hand-drawn smile line and orbiting portraits." },
  { key: "arch", name: "Dental Arch", text: "Interactive arch of teeth — each tooth reveals a treatment inside the dome." },
] as const;

export type HeroVariant = (typeof HERO_VARIANTS)[number]["key"];
