"use client";

// Authenticated Act 60 compliance workspace. Lives at /act60 (not /act-60) to
// avoid colliding with the public marketing page at /act-60.

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, Disclaimer } from "@/components/ui";
import { useStore } from "@/lib/useStore";
import { setChecklistStatus } from "@/lib/store";
import { countdown, deadlinesForUser } from "@/lib/deadlines";

export default function Act60Workspace() {
  const { profile, checklist, documents } = useStore();

  if (!profile) {
    return (
      <>
        <AppHeader title="Act 60" />
        <div className="p-8">
          <Card>
            <p className="text-sm text-ink-body">Complete the intake wizard first.</p>
            <Link href="/onboarding" className="btn-accent mt-4">Start intake wizard</Link>
          </Card>
        </div>
      </>
    );
  }

  if (!profile.taxpayerTypes.includes("act60") && !profile.hasAct60) {
    return (
      <>
        <AppHeader title="Act 60" subtitle="Not enabled for your profile" />
        <div className="p-8">
          <Card>
            <p className="text-sm text-ink-body">
              You didn't indicate an Act 60 decree during intake. If you hold a decree, update your
              profile to unlock the Act 60 compliance workspace.
            </p>
            <Link href="/onboarding" className="btn-ghost mt-4">Update profile</Link>
          </Card>
        </div>
      </>
    );
  }

  const act60Items = checklist.filter((c) => c.category === "act60");
  const act60Deadline = deadlinesForUser(profile.filingYear, ["act60"]).find((d) => d.id.includes("act60"));
  const decreeDocs = documents.filter((d) => d.documentType === "act60_decree" || d.documentType === "act60_annual_report");

  return (
    <>
      <AppHeader
        title="Act 60 compliance"
        subtitle={profile.act60Type ? `Decree: ${profile.act60Type}` : "Decree type not set"}
        action={<Pill tone="accent">{act60Items.filter((i) => i.status === "done").length}/{act60Items.length} done</Pill>}
      />
      <div className="space-y-6 p-8">
        {act60Deadline && (
          <Card title="Annual report deadline">
            {(() => {
              const c = countdown(act60Deadline.dueDate);
              const tone = c.state === "overdue" ? "red" : c.state === "warning" ? "yellow" : "green";
              return (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg text-ink">{act60Deadline.name}</p>
                    <p className="mt-1 text-xs text-ink-muted">{act60Deadline.penaltyNote}</p>
                  </div>
                  <div className="text-right">
                    <Pill tone={tone}>{c.label}</Pill>
                    <p className="mt-1 font-mono text-xs text-ink-muted">{act60Deadline.dueDate}</p>
                  </div>
                </div>
              );
            })()}
          </Card>
        )}

        <Card title="Compliance checklist">
          <ul className="divide-y divide-border">
            {act60Items.map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3">
                <button
                  onClick={() => setChecklistStatus(item.id, item.status === "done" ? "todo" : "done")}
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border text-bg ${item.status === "done" ? "border-accent bg-accent" : "border-border-strong"}`}
                >
                  {item.status === "done" ? "✓" : ""}
                </button>
                <div>
                  <span className={`text-sm ${item.status === "done" ? "text-ink-muted line-through" : "text-ink"}`}>{item.title}</span>
                  <p className="mt-1 text-xs text-ink-muted">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Decree & compliance documents">
          {decreeDocs.length === 0 ? (
            <p className="text-sm text-ink-muted">No Act 60 documents uploaded yet. <Link href="/documents" className="text-accent">Upload your decree →</Link></p>
          ) : (
            <ul className="space-y-2 text-sm">
              {decreeDocs.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <span className="text-ink">{d.fileName}</span>
                  <Link href={`/documents/${d.id}`} className="text-accent hover:underline">Open</Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Disclaimer>
          <span className="font-mono uppercase text-accent">Education only.</span> Act 60 compliance
          carries real legal and financial consequences. Have a qualified CPA and/or attorney review
          your decree obligations and filings. Verify all dates and requirements with DDEC and Hacienda.
        </Disclaimer>
      </div>
    </>
  );
}
