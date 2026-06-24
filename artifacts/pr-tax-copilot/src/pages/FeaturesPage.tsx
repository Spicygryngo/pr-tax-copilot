import { MarketingShell } from "../components/MarketingLayout";

const FEATURES = [
  { t: "Document vault", d: "Upload receipts, invoices, bank/credit statements, W-2PR, Forms 480, 1099s, payroll, IVU/SUT records, SURI screenshots, and Act 60 decrees. Every file is owned by you and private." },
  { t: "AI extraction (Phase 4)", d: "We read each document, classify it, pull the vendor/date/amount, assign a tax category, and flag low-confidence items for your review before anything is trusted." },
  { t: "Personalized checklist", d: "Answer the intake wizard once and get a required/optional checklist tuned to whether you're an employee, contractor, business owner, or Act 60 holder." },
  { t: "Readiness score", d: "A single 0–100% number tells you how prepared you are — profile, required documents, reviewed items, and acknowledged deadlines." },
  { t: "Deadline countdown", d: "Live countdowns for Hacienda, DDEC, and SURI obligations: green before, yellow inside 14 days, red once overdue. Dates flagged for verification." },
  { t: "AI advisor with citations", d: "Ask Puerto Rico tax-education questions. The assistant answers with citations from a versioned knowledge base — or abstains and tells you to ask a CPA." },
  { t: "Accountant-ready packet", d: "Generate a CPA/bookkeeper packet: profile summary, income & expense summaries, document index, missing items, and questions to ask your professional." },
  { t: "Act 60 compliance", d: "Track your decree's annual report deadline, fee obligations, and donation evidence, then produce a compliance packet for attorney/CPA review." },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">How it works</p>
        <h1 className="mt-3 text-4xl md:text-5xl">A tax intelligence cockpit</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-body">
          Everything you need to walk into tax season organized — and walk into your CPA's office
          with a clean, complete packet.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.t} className="card p-6">
              <h3 className="text-xl">{f.t}</h3>
              <p className="mt-2 text-sm text-ink-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
