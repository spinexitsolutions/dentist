"use client";

import { useCallback, useEffect, useState } from "react";
import type { CollectionKey, DB } from "@/lib/types";

async function req<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  const r = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (r.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Request failed");
  return j as T;
}

export const api = {
  get: <T,>(u: string) => req<T>(u),
  post: <T,>(u: string, b?: unknown) => req<T>(u, "POST", b),
  put: <T,>(u: string, b: unknown) => req<T>(u, "PUT", b),
  patch: <T,>(u: string, b: unknown) => req<T>(u, "PATCH", b),
  del: <T,>(u: string) => req<T>(u, "DELETE"),
};

export function useCollection<K extends CollectionKey>(key: K) {
  type Item = DB[K][number];
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.get<Item[]>(`/api/admin/${key}`));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = async (data: Partial<Item>) => {
    const rec = await api.post<Item>(`/api/admin/${key}`, data);
    setItems((x) => [rec, ...x]);
    return rec;
  };
  const save = async (id: string, data: Partial<Item>) => {
    const rec = await api.put<Item>(`/api/admin/${key}/${id}`, data);
    setItems((x) => x.map((i) => (i.id === id ? rec : i)));
    return rec;
  };
  const remove = async (id: string) => {
    await api.del(`/api/admin/${key}/${id}`);
    setItems((x) => x.filter((i) => i.id !== id));
  };
  const reorder = async (next: Item[]) => {
    setItems(next);
    await api.patch(`/api/admin/${key}`, next);
  };
  return { items, loading, reload, create, save, remove, reorder, setItems };
}
