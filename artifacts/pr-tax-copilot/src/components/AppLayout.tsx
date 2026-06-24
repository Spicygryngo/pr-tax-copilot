import { AppSidebar } from "./AppSidebar";
import { useRequireSession } from "../lib/useStore";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const session = useRequireSession();

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-ink-muted">
        Redirecting to log in…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
