import type { CollectionKey } from "./types";

export type FieldType = "text" | "textarea" | "number" | "toggle" | "image" | "list" | "select" | "icon" | "date" | "slug";
export type FieldDef = { name: string; label: string; type: FieldType; options?: string[]; placeholder?: string; full?: boolean; help?: string; from?: string };
export type CollectionDef = {
  key: CollectionKey;
  title: string;
  singular: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
};

export const ICON_OPTIONS = ["Sparkles", "Sun", "ShieldCheck", "Smile", "Activity", "Droplets", "Baby", "Siren", "ScanFace", "Microscope", "Gem", "Radar", "Zap", "Heart", "Stethoscope", "Syringe", "Star", "Clock", "Award", "Leaf"];

export const CONTENT: CollectionDef[] = [
  {
    key: "services",
    title: "Treatments",
    singular: "treatment",
    description: "Services shown on the homepage carousel, treatments page and booking flow.",
    titleField: "title",
    subtitleField: "price",
    imageField: "image",
    defaults: { title: "", slug: "", short: "", description: "", icon: "Sparkles", image: "", price: "", duration: "", featured: false, benefits: [] },
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "URL slug", type: "slug", from: "title" },
      { name: "short", label: "Short description", type: "text", full: true },
      { name: "description", label: "Full description", type: "textarea", full: true },
      { name: "price", label: "Price", type: "text", placeholder: "From ₹10,000" },
      { name: "duration", label: "Duration", type: "text", placeholder: "60 minutes" },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "featured", label: "Featured", type: "toggle" },
      { name: "image", label: "Image", type: "image", full: true },
      { name: "benefits", label: "Benefits", type: "list", full: true },
    ],
  },
  {
    key: "doctors",
    title: "Doctors",
    singular: "doctor",
    description: "Your team of specialists.",
    titleField: "name",
    subtitleField: "role",
    imageField: "image",
    defaults: { name: "", role: "", bio: "", image: "", experience: "", specialties: [] },
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "experience", label: "Experience", type: "text", placeholder: "10 yrs" },
      { name: "bio", label: "Bio", type: "textarea", full: true },
      { name: "image", label: "Portrait", type: "image", full: true },
      { name: "specialties", label: "Specialties", type: "list", full: true },
    ],
  },
  {
    key: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    description: "Patient reviews shown in the scrolling marquee.",
    titleField: "name",
    subtitleField: "role",
    imageField: "avatar",
    defaults: { name: "", role: "", text: "", rating: 5, avatar: "" },
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Treatment / role", type: "text" },
      { name: "rating", label: "Rating (1–5)", type: "number" },
      { name: "text", label: "Review", type: "textarea", full: true },
      { name: "avatar", label: "Avatar", type: "image", full: true },
    ],
  },
  {
    key: "gallery",
    title: "Smile gallery",
    singular: "case",
    description: "Before / after cases with the drag-to-compare slider.",
    titleField: "title",
    subtitleField: "treatment",
    imageField: "after",
    defaults: { title: "", treatment: "", before: "", after: "", simulateBefore: false },
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "treatment", label: "Treatment · duration", type: "text" },
      { name: "before", label: "Before image", type: "image" },
      { name: "after", label: "After image", type: "image" },
      { name: "simulateBefore", label: "Simulate 'before' (tint the before image — demo only)", type: "toggle", full: true },
    ],
  },
  {
    key: "posts",
    title: "Journal",
    singular: "post",
    description: "Blog articles. Separate paragraphs with a blank line.",
    titleField: "title",
    subtitleField: "category",
    imageField: "cover",
    defaults: { title: "", slug: "", excerpt: "", content: "", cover: "", category: "", author: "", date: new Date().toISOString().slice(0, 10), readTime: "4 min", published: true },
    fields: [
      { name: "title", label: "Title", type: "text", full: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title" },
      { name: "category", label: "Category", type: "text" },
      { name: "author", label: "Author", type: "text" },
      { name: "date", label: "Date", type: "date" },
      { name: "readTime", label: "Read time", type: "text" },
      { name: "published", label: "Published", type: "toggle" },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "content", label: "Content", type: "textarea", full: true },
      { name: "cover", label: "Cover image", type: "image", full: true },
    ],
  },
  {
    key: "faqs",
    title: "FAQ",
    singular: "question",
    description: "Frequently asked questions.",
    titleField: "q",
    defaults: { q: "", a: "" },
    fields: [
      { name: "q", label: "Question", type: "text", full: true },
      { name: "a", label: "Answer", type: "textarea", full: true },
    ],
  },
  {
    key: "plans",
    title: "Membership plans",
    singular: "plan",
    description: "Pricing cards in the membership section.",
    titleField: "name",
    subtitleField: "price",
    defaults: { name: "", price: "", period: "/ month", description: "", features: [], highlighted: false },
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "price", label: "Price", type: "text" },
      { name: "period", label: "Period", type: "text" },
      { name: "highlighted", label: "Highlight as most popular", type: "toggle" },
      { name: "description", label: "Description", type: "text", full: true },
      { name: "features", label: "Features", type: "list", full: true },
    ],
  },
  {
    key: "stats",
    title: "Numbers",
    singular: "stat",
    description: "Animated counters.",
    titleField: "label",
    subtitleField: "value",
    defaults: { value: 0, suffix: "", label: "" },
    fields: [
      { name: "value", label: "Value", type: "number" },
      { name: "suffix", label: "Suffix", type: "text", placeholder: "+ / % / yrs" },
      { name: "label", label: "Label", type: "text", full: true },
    ],
  },
  {
    key: "features",
    title: "Technology",
    singular: "feature",
    description: "Bento grid of technology highlights. The first one is shown large.",
    titleField: "title",
    imageField: "image",
    defaults: { title: "", text: "", icon: "Sparkles", image: "" },
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "text", label: "Text", type: "textarea", full: true },
      { name: "image", label: "Image (used on the large tile)", type: "image", full: true },
    ],
  },
  {
    key: "steps",
    title: "Visit steps",
    singular: "step",
    description: "The stacking cards in 'Your visit'.",
    titleField: "title",
    imageField: "image",
    defaults: { title: "", text: "", image: "" },
    fields: [
      { name: "title", label: "Title", type: "text", full: true },
      { name: "text", label: "Text", type: "textarea", full: true },
      { name: "image", label: "Image", type: "image", full: true },
    ],
  },
];
