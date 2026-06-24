// Shared presentational primitives for the cockpit UI.
import Link from "next/link";
import type { ReactNode } from "react";

export function Pill({
  tone = "muted",
  children,
}: {
  tone?: "accent" | "green" | "yellow" | "red" | "muted";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    accent: "border-accent text-accent",
    green: "border-status-green text-status-green",
    yellow: "border-status-yellow text-status-yellow",
    red: "border-status-red text-status-red",
    muted: "border-border-strong text-ink-muted",
  };
  return <span className={`pill ${tones[tone]}`}>{children}</span>;
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-5 ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              {title}
            </h3>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function ProgressBar({ value, tone = "accent" }: { value: number; tone?: "accent" | "green" | "yellow" | "red" }) {
  const colors: Record<string, string> = {
    accent: "bg-accent",
    green: "bg-status-green",
    yellow: "bg-status-yellow",
    red: "bg-status-red",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-btn bg-panel">
      <div
        className={`h-full ${colors[tone]} transition-all`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="panel p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{label}</div>
      <div className="mt-1 font-serif text-2xl text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="border-l-2 border-border-strong pl-3 text-xs leading-relaxed text-ink-muted">
      {children ?? (
        <>
          <span className="font-mono uppercase text-accent">Education only.</span>{" "}
          Puerto Rico Tax Copilot is not a CPA, attorney, enrolled agent, tax preparer,
          or an official Hacienda/DDEC/IRS filing system. Nothing here is final tax advice.
          Verify everything with a qualified professional and the official portals before filing.
        </>
      )}
    </p>
  );
}

export function CTA({ href, children, variant = "accent" }: { href: string; children: ReactNode; variant?: "accent" | "ghost" }) {
  return (
    <Link href={href} className={variant === "accent" ? "btn-accent" : "btn-ghost"}>
      {children}
    </Link>
  );
}

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className={`font-serif ${small ? "text-base" : "text-lg"} text-ink`}>
      PR<span className="text-accent">·</span>Tax{" "}
      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">Copilot</span>
    </span>
  );
}
