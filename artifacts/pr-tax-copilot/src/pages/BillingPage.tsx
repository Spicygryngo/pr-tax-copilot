import { Link } from "wouter";
import { AppHeader, Card, Pill } from "../components/ui-primitives";

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
                <div className="font-mono text-xs uppercase tracking-widest text-ink-muted">{t.name}</div>
                <div className="mt-2 font-serif text-2xl text-ink">{t.price}</div>
                <button className="btn-accent mt-3 w-full text-sm" disabled>Coming soon</button>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs text-ink-muted">
            Stripe subscriptions arrive in Phase 7. Upgrade options will be enabled then.
          </p>
        </Card>

        <Card title="What's included in the trial">
          <ul className="space-y-2 text-sm text-ink-body">
            <li>• Personalized checklist from the intake wizard</li>
            <li>• Up to 10 document uploads with mock extraction</li>
            <li>• Readiness score and deadline countdown</li>
            <li>• AI advisor (abstaining until Phase 5)</li>
            <li>• Watermarked preview of the CPA-ready packet</li>
          </ul>
          <Link href="/dashboard" className="btn-ghost mt-4">Back to dashboard</Link>
        </Card>
      </div>
    </>
  );
}
