import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./ui";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/act-60", label: "Act 60" },
  { href: "/for-contractors", label: "Contractors" },
  { href: "/for-business-owners", label: "Business" },
  { href: "/for-employees", label: "Employees" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-ink-muted hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink-muted hover:text-ink">
            Log in
          </Link>
          <Link href="/signup" className="btn-accent">
            Start 7-Day Trial
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-ink-muted">
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </Link>
          ))}
        </div>
        <p className="max-w-3xl leading-relaxed">
          <span className="font-mono uppercase text-accent">Education only.</span> Puerto Rico Tax
          Copilot helps you organize documents, understand concepts, track deadlines, and prepare an
          accountant-ready packet. It is not a CPA, attorney, enrolled agent, tax preparer, or an
          official Hacienda/DDEC/IRS filing system, and it does not file taxes. Final tax decisions
          and filings require your review and/or a qualified professional. Verify all dates and
          obligations with Hacienda, DDEC, and SURI.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} Puerto Rico Tax Copilot.</p>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}

export function AudiencePage({
  eyebrow,
  title,
  blurb,
  bullets,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  bullets: string[];
}) {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-body">{blurb}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="card flex items-start gap-3 p-4 text-sm text-ink-body">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-accent" />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex gap-3">
          <Link href="/signup" className="btn-accent">Start 7-Day Trial</Link>
          <Link href="/features" className="btn-ghost">See How It Works</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
