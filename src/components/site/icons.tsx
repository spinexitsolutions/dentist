import {
  Activity, Award, Baby, Clock, Droplets, Gem, Heart, Leaf, Microscope, Radar, ScanFace, ShieldCheck, Siren, Smile, Sparkles,
  Star, Stethoscope, Sun, Syringe, Zap, type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Activity, Award, Baby, Clock, Droplets, Gem, Heart, Leaf, Microscope, Radar, ScanFace, ShieldCheck, Siren, Smile, Sparkles,
  Star, Stethoscope, Sun, Syringe, Zap,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const I = ICONS[name] ?? Sparkles;
  return <I className={className} strokeWidth={1.5} />;
}

type P = { className?: string };
export const InstagramIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
export const FacebookIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" /></svg>
);
export const YoutubeIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" /></svg>
);
export const LinkedinIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6.9 8.8H3.7V20h3.2V8.8zM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.3 13.6c0-3-1.6-5-4.3-5-1.5 0-2.5.8-2.9 1.6V8.8H10V20h3.2v-5.8c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.2v-6.4z" /></svg>
);
export const WhatsappIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3l-.4-.2z" /></svg>
);

export function ToothMark({ className }: P) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" className={className}>
      <path d={TOOTH_PATH} />
    </svg>
  );
}

export const TOOTH_PATH =
  "M30 12C18 12 12 22 12 34c0 14 6 22 10 32 3 8 4 22 10 24 6 2 8-10 10-18 2-8 4-12 8-12s6 4 8 12c2 8 4 20 10 18 6-2 7-16 10-24 4-10 10-18 10-32 0-12-6-22-18-22-8 0-12 4-20 4s-12-4-20-4z";
