"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getChecklist, getDocuments, getProfile, getSession, onStoreChange } from "./store";

// Subscribe a component to local-store changes. Returns a snapshot of everything
// the dashboard needs. Uses useSyncExternalStore for tear-free reads.
export function useStore() {
  const subscribe = (cb: () => void) => onStoreChange(cb);

  const session = useSyncExternalStore(subscribe, getSession, () => null);
  const profile = useSyncExternalStore(subscribe, getProfile, () => null);
  const checklist = useSyncExternalStore(subscribe, getChecklist, () => []);
  const documents = useSyncExternalStore(subscribe, getDocuments, () => []);

  return { session, profile, checklist, documents };
}

// Redirect helper for app pages when there is no local session.
export function useRequireSession(redirectTo = "/login") {
  const { session } = useStore();
  useEffect(() => {
    if (typeof window !== "undefined" && session === null) {
      // brief delay so first paint isn't a flash; localStorage is sync anyway
      window.location.replace(redirectTo);
    }
  }, [session, redirectTo]);
  return session;
}
