import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const db = await getDB();
  const counts = {
    appointments: db.appointments.filter((a) => a.status === "pending").length,
    leads: db.leads.filter((l) => l.status === "new").length,
  };
  return (
    <AdminShell email={session.email} brand={db.settings.brand.name} counts={counts}>
      {children}
    </AdminShell>
  );
}
