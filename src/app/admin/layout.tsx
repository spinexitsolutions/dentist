import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Studio admin", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-[#F5F5F7] text-ink" style={{ ["--paper" as string]: "#F5F5F7" }}>
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
