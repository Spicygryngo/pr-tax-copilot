import Link from "next/link";
import { MarketingShell } from "@/components/marketing";
import { Pill } from "@/components/ui";

const TIERS = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    tone: "muted" as const,
    features: [
      "Personalized checklist",
      "Limited document uploads",
      "Partial dashboard + readiness score",
      "Limited AI advisor questions",
      "Trial preview report (watermarked, no export)",
    ],
    cta: "Start Trial",
  },
  {
    name: "Individual",
    price: "$19",
    period: "/mo",
    tone: "muted" as const,
    features: [
      "Employees & simple filers",
      "Full document vault",
      "Full readiness dashboard",
      "AI advisor with citations",
      "CPA-ready packet + PDF export",
    ],
    cta: "Choose Individual",
  },
  {
    name: "Contractor",
    price: "$39",
    period: "/mo",
    tone: "accent" as const,
    highlight: true,
    features: [
      "Everything in Individual",
      "Expense categorization",
      "Estimated payment tracking",
      "Schedule-style expense summary",
      "Bookkeeper/CPA handoff packet",
    ],
    cta: "Choose Contractor",
  },
  {
    name: "Business",
    price: "$79",
    period: "/mo",
    tone: "muted" as const,
    features: [
      "Everything in Contractor",
      "Payroll & IVU/SUT tracking",
      "Income/expense reconciliation",
      "Merchant obligation checklist",
      "Bookkeeper portal handoff",
    ],
    cta: "Choose Business",
  },
  {
    name: "Act 60 Premium",
    price: "$129",
    period: "/mo",
    tone: "muted" as const,
    features: [
      "Decree upload & type detection",
      "Annual compliance checklist",
      "DDEC annual report tracking",
      "Donation/compliance evidence vault",
      "Act 60 compliance packet for CPA/attorney",
    ],
    cta: "Choose Act 60",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl md:text-5xl">Pricing</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-body">
          Start with a 7-day trial. Upgrade to unlock exports, the full liability explanation, and
          the accountant-ready packet. Prices are illustrative for the MVP.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`card flex flex-col p-6 ${t.highlight ? "border-accent" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl">{t.name}</h3>
                {t.highlight && <Pill tone="accent">Popular</Pill>}
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span className="font-serif text-4xl text-ink">{t.price}</span>
                <span className="mb-1 text-sm text-ink-muted">{t.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-ink-body">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-6 ${t.highlight ? "btn-accent" : "btn-ghost"}`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 font-mono text-xs text-ink-muted">
          Stripe subscriptions arrive in Phase 7. An Accountant/Bookkeeper Portal is planned.
        </p>
      </section>
    </MarketingShell>
  );
}
