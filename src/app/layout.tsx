import type { Metadata, Viewport } from "next";
import { Anybody, Instrument_Sans } from "next/font/google";
import { getSettings } from "@/lib/db";
import "./globals.css";

export const dynamic = "force-dynamic";

const display = Anybody({ variable: "--font-bricolage", subsets: ["latin"], weight: "variable", axes: ["wdth"], display: "swap" });
const body = Instrument_Sans({ variable: "--font-onest", subsets: ["latin"], weight: "variable", axes: ["wdth"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s.seo.title, template: `%s — ${s.brand.name}` },
    description: s.seo.description,
    openGraph: { title: s.seo.title, description: s.seo.description, images: [s.hero.image], type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: "#F4F7FA",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  const vars = { "--accent": s.brand.accent, "--pop": s.brand.pop, "--ink": s.brand.ink, "--paper": s.brand.paper } as React.CSSProperties;
  return (
    <html lang="en" suppressHydrationWarning style={vars} className={`${display.variable} ${body.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
