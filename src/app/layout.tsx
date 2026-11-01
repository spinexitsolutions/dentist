import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, Geist_Mono } from "next/font/google";
import { getSettings } from "@/lib/db";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s.seo.title, template: `%s — ${s.brand.name}` },
    description: s.seo.description,
    openGraph: { title: s.seo.title, description: s.seo.description, images: [s.hero.image], type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: "#F4F2EE",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  const vars = { "--accent": s.brand.accent, "--ink": s.brand.ink, "--paper": s.brand.paper } as React.CSSProperties;
  return (
    <html lang="en" suppressHydrationWarning style={vars} className={`${inter.variable} ${instrument.variable} ${mono.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
