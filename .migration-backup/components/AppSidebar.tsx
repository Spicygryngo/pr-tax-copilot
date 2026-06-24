"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, Pill } from "./ui";
import { signOut } from "@/lib/store";
import { useStore } from "@/lib/useStore";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "◆" },
  { href: "/advisor", label: "AI Advisor", icon: "✦" },
  { href: "/documents", label: "Documents", icon: "▤" },
  { href: "/checklist", label: "Checklist", icon: "☑" },
  { href: "/calendar", label: "Calendar", icon: "◷" },
  { href: "/estimate", label: "Estimate", icon: "∑" },
  { href: "/act60", label: "Act 60", icon: "§" },
  { href: "/reports", label: "Reports", icon: "▦" },
];

const FOOTER_NAV = [
  { href: "/settings", label: "Settings" },
  { href: "/billing", label: "Billing" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { session, profile } = useStore();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40">
      <div className="border-b border-border p-5">
        <Link href="/dashboard">
          <Logo small />
        </Link>
        <div className="mt-3">
          <Pill tone="accent">Trial</Pill>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-btn px-3 py-2 text-sm transition-colors ${
                active ? "bg-panel text-ink" : "text-ink-muted hover:bg-panel/50 hover:text-ink"
              }`}
            >
              <span className={`font-mono text-xs ${active ? "text-accent" : ""}`}>{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {FOOTER_NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="block rounded-btn px-3 py-2 text-sm text-ink-muted hover:text-ink"
          >
            {n.label}
          </Link>
        ))}
        <div className="mt-2 truncate px-3 text-xs text-ink-muted">
          {session?.email ?? "—"}
        </div>
        <button
          onClick={() => {
            signOut();
            window.location.assign("/login");
          }}
          className="mt-2 w-full rounded-btn px-3 py-2 text-left text-sm text-ink-muted hover:text-status-red"
        >
          Sign out
        </button>
        {profile && (
          <div className="mt-2 px-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            FY {profile.filingYear}
          </div>
        )}
      </div>
    </aside>
  );
}
