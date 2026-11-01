import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Studio admin", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return (
    <div className="relative min-h-dvh bg-paper text-ink">
      {/* soft orbit backdrop shared by every admin screen */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-[20vmax] -top-[20vmax] size-[60vmax] rounded-full bg-pop/35 blur-3xl" />
        <div className="absolute -right-[12vmax] -top-[12vmax] size-[44vmax] rounded-full border border-ink/[.06]" />
        <div className="absolute -right-[4vmax] -top-[4vmax] size-[28vmax] rounded-full border border-dashed border-ink/[.06]" />
      </div>
      <div className="relative">
        <ToastProvider>{children}</ToastProvider>
      </div>
    </div>
  );
}
