import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { createSeed } from "./seed";
import type { CollectionKey, DB, Settings } from "./types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

type Store = { db: DB | null; writable: boolean; loading: Promise<DB> | null; queue: Promise<void> };
const g = globalThis as unknown as { __ivoryStore?: Store };
const store: Store = g.__ivoryStore ?? (g.__ivoryStore = { db: null, writable: true, loading: null, queue: Promise.resolve() });

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Fill in any keys missing from stored data (e.g. after an upgrade). */
function deepDefaults<T>(base: T, stored: unknown): T {
  if (!isObj(base) || !isObj(stored)) return (stored ?? base) as T;
  const out: Record<string, unknown> = { ...stored };
  for (const [k, v] of Object.entries(base)) {
    out[k] = k in stored ? deepDefaults(v, stored[k]) : v;
  }
  return out as T;
}

function load(): Promise<DB> {
  if (store.db) return Promise.resolve(store.db);
  if (!store.loading) store.loading = loadFromDisk().finally(() => (store.loading = null));
  return store.loading;
}

async function loadFromDisk(): Promise<DB> {
  const seed = createSeed();
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    const db = { ...seed, ...parsed } as DB;
    db.settings = deepDefaults(seed.settings, parsed.settings);
    // make sure newly added sections show up in the list
    const keys = new Set(db.settings.sections.map((s) => s.key));
    for (const s of seed.settings.sections) if (!keys.has(s.key)) db.settings.sections.push(s);
    store.db = db;
  } catch {
    store.db = seed;
    await persist();
  }
  return store.db!;
}

/** Writes are serialised through a queue and written atomically. */
function persist(): Promise<void> {
  store.queue = store.queue.then(async () => {
    if (!store.writable || !store.db) return;
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tmp = `${DB_FILE}.${process.pid}.${Date.now()}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(store.db, null, 2));
      await fs.rename(tmp, DB_FILE);
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
        // Read-only filesystem (e.g. serverless). Keep working in memory.
        store.writable = false;
      }
      console.warn("[db] could not persist, keeping data in memory:", (e as Error).message);
    }
  });
  return store.queue;
}

export async function getDB(): Promise<DB> {
  return load();
}

export async function getSettings(): Promise<Settings> {
  return (await load()).settings;
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const db = await load();
  db.settings = { ...db.settings, ...patch };
  await persist();
  return db.settings;
}

export async function list<K extends CollectionKey>(key: K): Promise<DB[K]> {
  return (await load())[key];
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export async function insert<K extends CollectionKey>(key: K, item: Partial<DB[K][number]>) {
  const db = await load();
  const rec = { ...item, id: (item as { id?: string }).id || uid(key.slice(0, 4)) } as DB[K][number];
  (db[key] as DB[K][number][]).unshift(rec);
  await persist();
  return rec;
}

export async function update<K extends CollectionKey>(key: K, id: string, patch: Partial<DB[K][number]>) {
  const db = await load();
  const arr = db[key] as DB[K][number][];
  const i = arr.findIndex((r) => r.id === id);
  if (i < 0) return null;
  arr[i] = { ...arr[i], ...patch, id };
  await persist();
  return arr[i];
}

export async function remove<K extends CollectionKey>(key: K, id: string) {
  const db = await load();
  const arr = db[key] as DB[K][number][];
  const i = arr.findIndex((r) => r.id === id);
  if (i < 0) return false;
  arr.splice(i, 1);
  await persist();
  return true;
}

export async function replaceCollection<K extends CollectionKey>(key: K, items: DB[K]) {
  const db = await load();
  db[key] = items;
  await persist();
  return items;
}

export async function resetDemo() {
  store.db = createSeed();
  await persist();
}
