"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, Disclaimer } from "@/components/ui";

// Phase 7 stub. Stripe subscriptions wire in later; this shows trial status and
// the upgrade surface.
const TIERS = [
  { name: "Individual", price: "$19/mo" },
  { name: "Contractor", price: "$39/mo" },
  { name: "Business", price: "$79/mo" },
  { name: "Act 60 Premium", price: "$129/mo" },
];

export default function BillingPage() {
  return (
    <>
      <AppHeader title="Billing" subtitle="Trial status and plans" action={<Pill tone="yellow">Trial</Pill>} />
      <div className="space-y-6 p-8">
        <Card title="Current plan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-ink">Free Trial</p>
              <p className="mt-1 text-sm text-ink-muted">
                Limited uploads, partial dashboard, watermarked preview report, no exports.
              </p>
            </div>
            <Pill tone="yellow">7 days</Pill>
          </div>
        </Card>

        <Card title="Upgrade">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t) => (
              <div key={t.name} className="panel p-4">
                <p className="text-base text-ink">{t.name}</p>
                <p className="mt-1 font-serif text-2xl text-ink">{t.price}</p>
                <button className="btn-accent mt-4 w-full" disabled title="Stripe wires in Phase 7">
                  Upgrade (soon)
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-ink-muted">
            Stripe checkout (STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET) is wired in Phase 7.
          </p>
          <Link href="/pricing" className="btn-ghost mt-4">Compare plans</Link>
        </Card>

        <Disclaimer />
      </div>
    </>
  );
}
