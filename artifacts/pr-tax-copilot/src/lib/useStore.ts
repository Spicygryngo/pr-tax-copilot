import { useEffect, useSyncExternalStore } from "react";
import { getChecklist, getDocuments, getProfile, getSession, onStoreChange } from "./store";

export function useStore() {
  const subscribe = (cb: () => void) => onStoreChange(cb);

  const session = useSyncExternalStore(subscribe, getSession, () => null);
  const profile = useSyncExternalStore(subscribe, getProfile, () => null);
  const checklist = useSyncExternalStore(subscribe, getChecklist, () => []);
  const documents = useSyncExternalStore(subscribe, getDocuments, () => []);

  return { session, profile, checklist, documents };
}

export function useRequireSession(redirectTo = "/login") {
  const { session } = useStore();
  useEffect(() => {
    if (typeof window !== "undefined" && session === null) {
      window.location.replace(redirectTo);
    }
  }, [session, redirectTo]);
  return session;
}
