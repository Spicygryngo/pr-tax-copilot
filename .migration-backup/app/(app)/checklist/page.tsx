"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, ProgressBar } from "@/components/ui";
import { useStore } from "@/lib/useStore";
import { setChecklistStatus } from "@/lib/store";
import type { ChecklistItem } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  profile: "Profile",
  shared: "General",
  employee: "Employee",
  contractor: "Contractor",
  business_owner: "Business owner",
  act60: "Act 60",
};

export default function ChecklistPage() {
  const { profile, checklist } = useStore();

  if (!profile) {
    return (
      <>
        <AppHeader title="Checklist" />
        <div className="p-8">
          <Card>
            <p className="text-sm text-ink-body">Complete the intake wizard to generate your checklist.</p>
            <Link href="/onboarding" className="btn-accent mt-4">Start intake wizard</Link>
          </Card>
        </div>
      </>
    );
  }

  const done = checklist.filter((c) => c.status === "done").length;
  const requiredDone = checklist.filter((c) => c.required && c.status === "done").length;
  const requiredTotal = checklist.filter((c) => c.required).length;

  // Group by category, required first.
  const groups = checklist.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <>
      <AppHeader
        title="Checklist"
        subtitle={`${done}/${checklist.length} complete · ${requiredDone}/${requiredTotal} required`}
        action={<Pill tone={requiredDone === requiredTotal ? "green" : "yellow"}>{Math.round((done / Math.max(1, checklist.length)) * 100)}%</Pill>}
      />
      <div className="space-y-6 p-8">
        <Card>
          <ProgressBar value={(done / Math.max(1, checklist.length)) * 100} tone="accent" />
        </Card>

        {Object.entries(groups).map(([cat, items]) => (
          <Card key={cat} title={CATEGORY_LABEL[cat] ?? cat}>
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-4 py-3">
                  <button
                    onClick={() => setChecklistStatus(item.id, item.status === "done" ? "todo" : "done")}
                    aria-label="toggle"
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border text-bg ${
                      item.status === "done" ? "border-accent bg-accent" : "border-border-strong"
                    }`}
                  >
                    {item.status === "done" ? "✓" : ""}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${item.status === "done" ? "text-ink-muted line-through" : "text-ink"}`}>
                        {item.title}
                      </span>
                      {item.required ? (
                        <Pill tone="muted">required</Pill>
                      ) : (
                        <Pill tone="muted">optional</Pill>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{item.description}</p>
                  </div>
                  {/upload/i.test(item.title) && (
                    <Link href="/documents" className="btn-ghost shrink-0 text-xs">Upload</Link>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
