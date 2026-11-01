"use client";

import { Reorder, useDragControls } from "framer-motion";
import { Copy, ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { CONTENT, ICON_OPTIONS, type FieldDef } from "@/lib/admin-schema";
import type { CollectionKey } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { Icon } from "@/components/site/icons";
import { useCollection } from "./api";
import { Button, Card, Drawer, Empty, FieldWrap, ImageField, ListField, PageTitle, Toggle, inputBase, useToast } from "./ui";

type Rec = Record<string, unknown> & { id: string };

const PREVIEW: Partial<Record<CollectionKey, string>> = {
  services: "/services",
  doctors: "/team",
  gallery: "/gallery",
  posts: "/blog",
  testimonials: "/#testimonials",
  faqs: "/#faq",
  plans: "/#pricing",
  stats: "/#stats",
  features: "/#technology",
  steps: "/#process",
};

function FieldInput({ f, value, onChange, record }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void; record: Rec }) {
  switch (f.type) {
    case "textarea":
      return <textarea rows={f.name === "content" ? 12 : 4} className={inputBase} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
    case "number":
      return <input type="number" className={inputBase} value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
    case "toggle":
      return <Toggle checked={!!value} onChange={onChange} label={value ? "On" : "Off"} />;
    case "image":
      return <ImageField value={(value as string) ?? ""} onChange={onChange} />;
    case "list":
      return <ListField value={(value as string[]) ?? []} onChange={onChange} />;
    case "date":
      return <input type="date" className={inputBase} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "icon":
      return (
        <div className="flex flex-wrap gap-1.5">
          {ICON_OPTIONS.map((n) => (
            <button key={n} type="button" title={n} onClick={() => onChange(n)} className={cn("grid size-9 place-items-center rounded-xl transition", value === n ? "bg-ink text-white" : "bg-black/[.04] hover:bg-black/10")}>
              <Icon name={n} className="size-4" />
            </button>
          ))}
        </div>
      );
    case "slug":
      return (
        <div className="flex gap-2">
          <input className={inputBase} value={(value as string) ?? ""} onChange={(e) => onChange(slugify(e.target.value))} />
          {f.from && (
            <Button type="button" variant="outline" size="sm" className="!h-auto" onClick={() => onChange(slugify(String(record[f.from!] ?? "")))}>
              Generate
            </Button>
          )}
        </div>
      );
    default:
      return <input className={inputBase} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
  }
}

function Row({ item, def, onOpen, onDuplicate, onCommit }: { item: Rec; def: (typeof CONTENT)[number]; onOpen: () => void; onDuplicate: () => void; onCommit: () => void }) {
  const controls = useDragControls();
  const img = def.imageField ? (item[def.imageField] as string) : "";
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} onDragEnd={onCommit} className="list-none" whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)" }}>
      <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-3 shadow-sm ring-1 ring-black/5">
        <button onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none px-1 text-black/25 active:cursor-grabbing" aria-label="Drag to reorder">
          <GripVertical className="size-4" />
        </button>
        {def.imageField && (
          <span className="size-12 shrink-0 overflow-hidden rounded-xl bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {img && <img src={img} alt="" className="size-full object-cover" />}
          </span>
        )}
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="truncate font-medium">{String(item[def.titleField] || "Untitled")}</p>
          {def.subtitleField && <p className="truncate text-sm text-black/50">{String(item[def.subtitleField] ?? "")}</p>}
        </button>
        {"published" in item && !item.published && <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-black/50">Draft</span>}
        {"featured" in item && !!item.featured && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] text-accent-deep">Featured</span>}
        <Button size="sm" variant="ghost" onClick={onDuplicate} aria-label="Duplicate">
          <Copy className="size-3.5" />
        </Button>
        <Button size="sm" variant="outline" onClick={onOpen}>
          Edit
        </Button>
      </div>
    </Reorder.Item>
  );
}

export default function ContentEditor({ collection }: { collection: CollectionKey }) {
  const def = CONTENT.find((c) => c.key === collection)!;
  const { items, loading, create, save, remove, reorder, setItems } = useCollection(collection);
  const [edit, setEdit] = useState<Rec | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const list = items as unknown as Rec[];
  const latest = useRef<Rec[] | null>(null);

  const submit = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      const data = { ...edit };
      if ("slug" in data && !data.slug && def.titleField) data.slug = slugify(String(data[def.titleField] ?? ""));
      if (data.id) await save(data.id, data as never);
      else {
        const { id: _omit, ...rest } = data;
        void _omit;
        // new items go to the end of the list
        const rec = (await create(rest as never)) as unknown as Rec;
        const next = [...list, rec];
        await reorder(next as never);
      }
      toast(`${def.singular[0].toUpperCase() + def.singular.slice(1)} saved`);
      setEdit(null);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle
        title={def.title}
        subtitle={def.description}
        actions={
          <>
            {PREVIEW[collection] && (
              <a href={PREVIEW[collection]} target="_blank">
                <Button variant="outline">
                  Preview <ExternalLink className="size-3.5" />
                </Button>
              </a>
            )}
            <Button onClick={() => setEdit({ ...(def.defaults as Rec), id: "" })}>
              <Plus className="size-4" /> Add {def.singular}
            </Button>
          </>
        }
      />
      {loading ? (
        <Card className="h-48 animate-pulse" />
      ) : list.length === 0 ? (
        <Empty title={`No ${def.title.toLowerCase()} yet`} action={<Button onClick={() => setEdit({ ...(def.defaults as Rec), id: "" })}>Add the first one</Button>} />
      ) : (
        <>
          <p className="mb-2 text-xs text-black/40">Drag the handle to change the order on the website.</p>
          <Reorder.Group
            axis="y"
            values={list}
            onReorder={(v) => {
              latest.current = v;
              setItems(v as never);
            }}
            className="space-y-2"
          >
            {list.map((it) => (
              <Row
                key={it.id}
                item={it}
                def={def}
                onOpen={() => setEdit({ ...it })}
                onCommit={() => {
                  if (latest.current) reorder(latest.current as never).then(() => toast("Order saved"));
                  latest.current = null;
                }}
                onDuplicate={async () => {
                  const { id: _omit, ...rest } = it;
                  void _omit;
                  const copy = { ...rest, [def.titleField]: `${String(it[def.titleField])} (copy)` } as Record<string, unknown>;
                  if ("slug" in copy) copy.slug = `${copy.slug}-copy`;
                  await create(copy as never);
                  toast("Duplicated");
                }}
              />
            ))}
          </Reorder.Group>
        </>
      )}

      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? `Edit ${def.singular}` : `New ${def.singular}`}
        wide
        footer={
          <>
            {edit?.id && (
              <Button
                variant="danger"
                className="mr-auto"
                onClick={async () => {
                  if (!confirm(`Delete this ${def.singular}?`)) return;
                  await remove(edit.id);
                  setEdit(null);
                  toast("Deleted");
                }}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button onClick={submit} loading={saving}>
              Save changes
            </Button>
          </>
        }
      >
        {edit && (
          <div className="grid gap-5 sm:grid-cols-2">
            {def.fields.map((f) => (
              <FieldWrap key={f.name} label={f.label} help={f.help} className={f.full || f.type === "textarea" || f.type === "image" || f.type === "list" ? "sm:col-span-2" : ""}>
                <FieldInput f={f} value={edit[f.name]} record={edit} onChange={(v) => setEdit((e) => (e ? { ...e, [f.name]: v } : e))} />
              </FieldWrap>
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
}
