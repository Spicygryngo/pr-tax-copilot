"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { useRequireSession } from "@/lib/useStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
