import Link from "next/link";
import { MarketingShell } from "@/components/marketing";

const STEPS = [
  { n: "01", t: "Upload your records", d: "Receipts, income statements, bank records, W-2PR, Forms 480, Act 60 decrees — drop them in the encrypted vault." },
  { n: "02", t: "Get organized automatically", d: "We classify documents, build a personalized checklist, and surface what's missing for your profile." },
  { n: "03", t: "Track every deadline", d: "A live countdown for each Hacienda / DDEC / SURI obligation — green before, red after." },
  { n: "04", t: "Hand off to your CPA", d: "Generate an accountant-ready packet with an income summary, document index, and questions to ask." },
];

const PROFILES = [
  { href: "/for-employees", t: "Employees", d: "W-2PR / 499R-2, withholding, dependents, SURI guidance." },
  { href: "/for-contractors", t: "Independent Contractors", d: "Form 480 income, receipts, estimated payments, expense packet." },
  { href: "/for-business-owners", t: "Business Owners", d: "Statements, payroll, IVU/SUT, bookkeeper handoff." },
  { href: "/act-60", t: "Act 60 Decree Holders", d: "Decree upload, annual report tracking, DDEC compliance." },
];

export default function HomePage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="grid-backdrop border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="inline-flex items-center gap-2 border border-border-strong px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink-muted">
            <span className="h-1.5 w-1.5 animate-pulse bg-accent" /> Education-only tax intelligence
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.05] md:text-6xl">
            Puerto Rico tax prep,{" "}
            <span className="text-accent">organized before your CPA sees it.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-body">
            Upload receipts, income statements, bank records, and Act 60 documents. Get a guided
            checklist, deadline tracker, AI education assistant, and an accountant-ready packet.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-accent">Start 7-Day Trial</Link>
            <Link href="/features" className="btn-ghost">See How It Works</Link>
          </div>
          <p className="mt-5 font-mono text-xs text-ink-muted">
            No filing on your behalf. We organize; a qualified professional reviews and files.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl">How it works</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-5">
              <div className="font-mono text-xs text-accent">{s.n}</div>
              <h3 className="mt-3 text-lg">{s.t}</h3>
              <p className="mt-2 text-sm text-ink-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Profiles */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl">Built for four kinds of Puerto Rico taxpayer</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PROFILES.map((p) => (
              <Link key={p.href} href={p.href} className="card group flex items-center justify-between p-6 hover:border-accent">
                <div>
                  <h3 className="text-xl">{p.t}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{p.d}</p>
                </div>
                <span className="font-mono text-accent opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl text-4xl">Stop dreading tax season. Start organized.</h2>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup" className="btn-accent">Start 7-Day Trial</Link>
          <Link href="/pricing" className="btn-ghost">View Pricing</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
