"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, Stat, Disclaimer } from "@/components/ui";
import { useStore } from "@/lib/useStore";

// Trial users get a watermarked PREVIEW with locked detail (build plan section 16).
// Screenshot prevention is intentionally NOT attempted; we blur/lock instead.
const IS_TRIAL = true;

export default function ReportsPage() {
  const { profile, documents, checklist } = useStore();

  if (!profile) {
    return (
      <>
        <AppHeader title="Reports" />
        <div className="p-8">
          <Card>
            <p className="text-sm text-ink-body">Complete the intake wizard to generate reports.</p>
            <Link href="/onboarding" className="btn-accent mt-4">Start intake wizard</Link>
          </Card>
        </div>
      </>
    );
  }

  const accepted = documents.filter((d) => d.status === "accepted" || d.status === "included_in_report");
  const income = accepted
    .filter((d) => d.category === "income")
    .reduce((s, d) => s + (d.amount ?? 0), 0);
  const expenses = accepted
    .filter((d) => d.category === "business_expense")
    .reduce((s, d) => s + (d.amount ?? 0), 0);

  return (
    <>
      <AppHeader
        title="Reports"
        subtitle="CPA-ready packet, filing guidance, and Act 60 compliance"
        action={<Pill tone={IS_TRIAL ? "yellow" : "green"}>{IS_TRIAL ? "Trial preview" : "Full access"}</Pill>}
      />
      <div className="space-y-6 p-8">
        <Card title="Accountant-ready packet (preview)">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Documents accepted" value={accepted.length} />
            <Stat label="Checklist done" value={`${checklist.filter((c) => c.status === "done").length}/${checklist.length}`} />
            <Stat label="Est. income" value={income ? `$${income.toLocaleString()}` : "—"} />
            <Stat label="Est. expenses" value={expenses ? `$${expenses.toLocaleString()}` : "—"} />
          </div>

          {/* Locked premium detail */}
          <div className="relative mt-6">
            <div className={IS_TRIAL ? "pointer-events-none select-none blur-sm" : ""}>
              <ul className="space-y-2 text-sm text-ink-body">
                <li>• Full income summary by source and document</li>
                <li>• Itemized expense summary with deductibility notes</li>
                <li>• Document index with confidence and review status</li>
                <li>• Missing-document list and low-confidence flags</li>
                <li>• Tailored questions to ask your CPA</li>
                <li>• Deadline status and Act 60 section (if applicable)</li>
              </ul>
            </div>
            {IS_TRIAL && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="card border-accent p-5 text-center">
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">Locked</p>
                  <p className="mt-2 text-sm text-ink">Upgrade to unlock the CPA-ready packet</p>
                  <Link href="/billing" className="btn-accent mt-3">Upgrade</Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-ghost" disabled title="Available after upgrade">Export PDF (locked)</button>
            <button className="btn-ghost" disabled title="Available after upgrade">Export CSV index (locked)</button>
          </div>
          {IS_TRIAL && (
            <p className="mt-3 font-mono text-[11px] text-ink-muted">
              Preview is watermarked and export-disabled on the trial. No line-item calculations shown.
            </p>
          )}
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { t: "CPA / Bookkeeper packet", d: "Profile, income & expense summaries, document index, questions for your CPA." },
            { t: "Filing guidance packet", d: "Where to go, which portal, what to bring, links — with a verify-before-filing notice." },
            { t: "Act 60 compliance packet", d: "Decree details, annual items, evidence, and attorney/CPA review questions." },
          ].map((r) => (
            <Card key={r.t} title={r.t}>
              <p className="text-sm text-ink-muted">{r.d}</p>
              <button className="btn-ghost mt-4 w-full" disabled={IS_TRIAL}>{IS_TRIAL ? "Locked on trial" : "Generate"}</button>
            </Card>
          ))}
        </div>

        <Disclaimer />
      </div>
    </>
  );
}
