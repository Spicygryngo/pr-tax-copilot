import { generateChecklist } from "./checklist";
import type { ChecklistItem, TaxDocument, UserTaxProfile } from "./types";

const KEYS = {
  profile:   "prtc.profile",
  checklist: "prtc.checklist",
  documents: "prtc.documents",
  session:   "prtc.session",
} as const;

const CHANGE_EVENT = "prtc:store-change";

// ---------------------------------------------------------------------------
// Stable-reference snapshot cache
// useSyncExternalStore requires getSnapshot() to return the same reference
// when nothing has changed. JSON.parse always creates new objects, which
// causes React to think the store changed every render → infinite loop.
// We solve this by keeping the last serialized string per key. If the raw
// string is identical we return the previously parsed object.
// ---------------------------------------------------------------------------
const _cache = new Map<string, { raw: string; value: unknown }>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      // Key is absent — return a stable fallback reference.
      const entry = _cache.get(key);
      if (entry && entry.raw === "__absent__") return entry.value as T;
      _cache.set(key, { raw: "__absent__", value: fallback });
      return fallback;
    }
    const cached = _cache.get(key);
    if (cached && cached.raw === raw) return cached.value as T;
    const value = JSON.parse(raw) as T;
    _cache.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  // Invalidate the cache entry so the next read sees fresh data.
  _cache.delete(key);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function onStoreChange(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export interface LocalSession {
  userId: string;
  email: string;
}

export function getSession(): LocalSession | null {
  return read<LocalSession | null>(KEYS.session, null);
}

export function signIn(email: string): LocalSession {
  const session: LocalSession = {
    userId: `local_${btoa(email).slice(0, 12)}`,
    email,
  };
  write(KEYS.session, session);
  return session;
}

export function signOut(): void {
  write(KEYS.session, null);
}

export function getProfile(): UserTaxProfile | null {
  return read<UserTaxProfile | null>(KEYS.profile, null);
}

export function saveProfile(profile: UserTaxProfile): void {
  write(KEYS.profile, profile);
  const existing = getChecklist();
  const statusById = new Map(existing.map((i) => [i.id, i]));
  const regenerated = generateChecklist(profile).map((item) => {
    const prev = statusById.get(item.id);
    return prev
      ? {
          ...item,
          status: prev.status,
          linkedDocumentId: prev.linkedDocumentId,
          notes: prev.notes,
          completedAt: prev.completedAt,
        }
      : item;
  });
  write(KEYS.checklist, regenerated);
}

export function getChecklist(): ChecklistItem[] {
  return read<ChecklistItem[]>(KEYS.checklist, []);
}

export function setChecklistStatus(
  id: string,
  status: ChecklistItem["status"]
): void {
  const items = getChecklist().map((i) =>
    i.id === id
      ? {
          ...i,
          status,
          completedAt: status === "done" ? new Date().toISOString() : null,
        }
      : i
  );
  write(KEYS.checklist, items);
}

export function getDocuments(): TaxDocument[] {
  return read<TaxDocument[]>(KEYS.documents, []);
}

export function getDocument(id: string): TaxDocument | undefined {
  return getDocuments().find((d) => d.id === id);
}

export function addDocument(doc: TaxDocument): void {
  write(KEYS.documents, [doc, ...getDocuments()]);
}

export function updateDocument(id: string, patch: Partial<TaxDocument>): void {
  const docs = getDocuments().map((d) =>
    d.id === id
      ? { ...d, ...patch, updatedAt: new Date().toISOString() }
      : d
  );
  write(KEYS.documents, docs);
}

export function deleteDocument(id: string): void {
  write(KEYS.documents, getDocuments().filter((d) => d.id !== id));
}

export function deleteAllData(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => {
    window.localStorage.removeItem(k);
    _cache.delete(k);
  });
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}
