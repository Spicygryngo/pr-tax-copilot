"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Stat, Pill, Disclaimer } from "@/components/ui";
import { useStore } from "@/lib/useStore";

// Estimate panel (build plan section 12D). Directional only — never final tax due.
export default function EstimatePage() {
  const { profile, documents } = useStore();

  if (!profile) {
    return (
      <>
        <AppHeader title="Estimate" />
        <div className="p-8">
          <Card>
            <p className="text-sm text-ink-body">Complete the intake wizard first.</p>
            <Link href="/onboarding" className="btn-accent mt-4">Start intake wizard</Link>
          </Card>
        </div>
      </>
    );
  }

  const accepted = documents.filter((d) => d.status === "accepted" || d.status === "included_in_report");
  const income = accepted.filter((d) => d.category === "income").reduce((s, d) => s + (d.amount ?? 0), 0);
  const expenses = accepted.filter((d) => d.category === "business_expense").reduce((s, d) => s + (d.amount ?? 0), 0);
  const taxable = Math.max(0, income - expenses);
  const hasData = accepted.length > 0;

  return (
    <>
      <AppHeader
        title="Estimated obligation"
        subtitle="Directional range — not final tax due"
        action={<Pill tone={hasData ? "yellow" : "muted"}>{hasData ? "Low confidence" : "No data"}</Pill>}
      />
      <div className="space-y-6 p-8">
        <Card title="Estimate inputs (from accepted documents)">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Est. income" value={income ? `$${income.toLocaleString()}` : "—"} />
            <Stat label="Est. deductible" value={expenses ? `$${expenses.toLocaleString()}` : "—"} />
            <Stat label="Est. taxable" value={hasData ? `$${taxable.toLocaleString()}` : "—"} />
            <Stat label="Confidence" value={hasData ? "Low" : "—"} hint={hasData ? "few documents" : "upload docs"} />
          </div>
        </Card>

        <Card title="Why this estimate exists">
          <ul className="space-y-2 text-sm text-ink-body">
            <li>• Built only from documents you've reviewed and accepted.</li>
            <li>• Does not apply Puerto Rico tax brackets, credits, or Act 60 treatment — that arrives with the deterministic rules engine (OpenTax-style) in a later phase.</li>
            <li>• Missing income or expense documents will change this materially.</li>
          </ul>
          <Link href="/documents" className="btn-ghost mt-4">Add more documents</Link>
        </Card>

        <Disclaimer>
          <span className="font-mono uppercase text-accent">Not final tax due.</span> This is an
          educational, directional estimate from your uploaded records. Your actual liability depends
          on the full Puerto Rico tax code and your complete records. A qualified CPA must determine
          final amounts.
        </Disclaimer>
      </div>
    </>
  );
}
