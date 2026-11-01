import { notFound } from "next/navigation";
import { CONTENT } from "@/lib/admin-schema";
import ContentEditor from "@/components/admin/ContentEditor";

export default async function Page({ params }: PageProps<"/admin/content/[collection]">) {
  const { collection } = await params;
  const def = CONTENT.find((c) => c.key === collection);
  if (!def) notFound();
  return <ContentEditor key={def.key} collection={def.key} />;
}
