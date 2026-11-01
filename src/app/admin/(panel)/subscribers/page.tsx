"use client";

import { Download, Trash2 } from "lucide-react";
import { useCollection } from "@/components/admin/api";
import { Button, Card, Empty, PageTitle, useToast } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default function Subscribers() {
  const { items, loading, remove } = useCollection("subscribers");
  const toast = useToast();
  const exportCsv = () => {
    const csv = "email,subscribed_at\n" + items.map((s) => `${s.email},${s.createdAt}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "subscribers.csv";
    a.click();
  };
  return (
    <>
      <PageTitle
        title="Subscribers"
        subtitle={`${items.length} newsletter subscribers`}
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!items.length}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />
      {loading ? (
        <Card className="h-40 animate-pulse" />
      ) : items.length === 0 ? (
        <Empty title="No subscribers yet" text="Visitors can subscribe from the website footer." />
      ) : (
        <Card className="divide-y divide-black/5 p-0">
          {items.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="font-medium">{s.email}</p>
                <p className="text-xs text-black/40">{formatDate(s.createdAt)}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  await remove(s.id);
                  toast("Removed");
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
