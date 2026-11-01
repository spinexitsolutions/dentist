export type SectionKey =
  | "statement"
  | "services"
  | "stats"
  | "about"
  | "process"
  | "gallery"
  | "doctors"
  | "technology"
  | "testimonials"
  | "pricing"
  | "faq"
  | "blog"
  | "cta"
  | "contact";

export interface Settings {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    accent: string;
    pop: string;
    ink: string;
    paper: string;
  };
  intro: {
    enabled: boolean;
    style: "smile" | "curtain" | "minimal";
    line1: string;
    line2: string;
    duration: number; // seconds
    showOncePerSession: boolean;
  };
  announcement: { enabled: boolean; text: string; link: string };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    titleEnd: string;
    subtitle: string;
    image: string;
    wideImage: string;
    caption: string;
    ctaPrimary: string;
    ctaSecondary: string;
    rating: string;
    reviews: string;
  };
  statement: { text: string };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    image2: string;
    years: string;
    points: string[];
  };
  cta: { title: string; subtitle: string; image: string };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    mapQuery: string;
    emergency: string;
    hours: { day: string; open: string; close: string; closed: boolean }[];
  };
  social: { instagram: string; facebook: string; youtube: string; linkedin: string };
  sections: { key: SectionKey; label: string; enabled: boolean }[];
  insurers: string[];
  booking: { slots: string[]; daysAhead: number; closedWeekdays: number[] };
  seo: { title: string; description: string };
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  image: string;
  price: string;
  duration: string;
  featured: boolean;
  benefits: string[];
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  experience: string;
  specialties: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  treatment: string;
  before: string;
  after: string;
  simulateBefore: boolean;
}

export interface Faq {
  id: string;
  q: string;
  a: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  published: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface Feature {
  id: string;
  title: string;
  text: string;
  icon: string;
  image: string;
}

export interface Step {
  id: string;
  title: string;
  text: string;
  image: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show";

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  doctor: string;
  date: string; // yyyy-mm-dd
  time: string;
  notes: string;
  status: AppointmentStatus;
  source: string;
  patientId: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface DB {
  settings: Settings;
  services: Service[];
  doctors: Doctor[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqs: Faq[];
  posts: Post[];
  plans: Plan[];
  stats: Stat[];
  features: Feature[];
  steps: Step[];
  appointments: Appointment[];
  patients: Patient[];
  leads: Lead[];
  subscribers: Subscriber[];
}

export type CollectionKey = Exclude<keyof DB, "settings">;

export const COLLECTIONS: CollectionKey[] = [
  "services",
  "doctors",
  "testimonials",
  "gallery",
  "faqs",
  "posts",
  "plans",
  "stats",
  "features",
  "steps",
  "appointments",
  "patients",
  "leads",
  "subscribers",
];
