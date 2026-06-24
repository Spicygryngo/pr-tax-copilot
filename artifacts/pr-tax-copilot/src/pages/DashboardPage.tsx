import { Link } from "wouter";
import { AppHeader, Card, Pill, ProgressBar, Stat, Disclaimer } from "../components/ui-primitives";
import { useStore } from "../lib/useStore";
import { computeReadiness } from "../lib/readiness";
import { countdown, deadlinesForUser } from "../lib/deadlines";
import { nextBestAction } from "../lib/nextAction";

export default function DashboardPage() {
  const { profile, checklist, documents } = useStore();

  const deadlines = profile ? deadlinesForUser(profile.filingYear, profile.taxpayerTypes) : [];
  const hasOverdue = deadlines.some((d) => countdown(d.dueDate).state === "overdue");
  const readiness = computeReadiness({ profile, checklist, documents, hasOverdueDeadline: hasOverdue });

  const readinessTone = readiness.status === "on_track" ? "green" : readiness.status === "overdue" ? "red" : "yellow";

  const byStatus = (s: string) => documents.filter((d) => d.status === s).length;
  const needsReview = byStatus("needs_review") + byStatus("extracted");
  const accepted = byStatus("accepted") + byStatus("included_in_report");

  const action = nextBestAction({ profile, checklist, documents });

  if (!profile) {
    return (
      <>
        <AppHeader title="Dashboard" />
        <div className="p-8">
          <Card title="Finish setup">
            <p className="text-sm text-ink-body">
              Complete the intake wizard to generate your personalized checklist, deadlines, and
              readiness score.
            </p>
            <Link href="/onboarding" className="btn-accent mt-4">Start intake wizard</Link>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="Dashboard"
        subtitle={`Filing year ${profile.filingYear} · ${profile.taxpayerTypes.join(", ")}`}
        action={<Pill tone={readinessTone}>{readiness.status.replace("_", " ")}</Pill>}
      />

      <div className="space-y-6 p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Tax readiness score" className="lg:col-span-2">
            <div className="flex items-end gap-4">
              <span className="font-serif text-6xl text-ink">{readiness.score}</span>
              <span className="mb-2 text-ink-muted">/ 100</span>
            </div>
            <div className="mt-4">
              <ProgressBar value={readiness.score} tone={readinessTone} />
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {readiness.breakdown.map((b) => (
                <div key={b.label} className="flex items-center justify-between text-xs">
                  <span className="text-ink-muted">{b.label}</span>
                  <span className="font-mono text-ink-body">{b.earned}/{b.weight}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Next best action">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-lg text-ink">{action.title}</p>
                <p className="mt-2 text-sm text-ink-muted">{action.detail}</p>
              </div>
              <Link href={action.href} className="btn-accent mt-4 w-full">
                {action.cta}
              </Link>
            </div>
          </Card>
        </div>

        <Card title="Deadline countdown">
          {deadlines.length === 0 ? (
            <p className="text-sm text-ink-muted">No deadlines for your profile yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {deadlines.map((d) => {
                const c = countdown(d.dueDate);
                const tone = c.state === "overdue" ? "red" : c.state === "warning" ? "yellow" : "green";
                return (
                  <div key={d.id} className="panel p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-ink">{d.name}</p>
                        <p className="mt-0.5 text-xs text-ink-muted">{d.agency}</p>
                      </div>
                      <Pill tone={tone}>{c.label}</Pill>
                    </div>
                    <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-ink-muted">
                      <span>Due {d.dueDate}</span>
                      {d.requiresVerification && <span className="text-status-yellow">verify date</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-4 font-mono text-[11px] text-ink-muted">
            Dates are general rules — confirm with Hacienda / DDEC / SURI. Penalties may apply; verify with a CPA.
          </p>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Document completeness">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Total" value={documents.length} />
              <Stat label="Needs review" value={needsReview} />
              <Stat label="Accepted" value={accepted} />
              <Stat label="Checklist done" value={`${checklist.filter((c) => c.status === "done").length}/${checklist.length}`} />
            </div>
            <Link href="/documents" className="btn-ghost mt-4">Open document vault</Link>
          </Card>

          <Card title="Estimated obligation">
            <p className="text-sm text-ink-body">
              An estimate appears here once you upload and review income and expense documents. This
              is <span className="text-accent">not final tax due</span> — it is a directional range
              with a confidence level and the missing data that could change it.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat label="Est. income" value="—" />
              <Stat label="Est. deductible" value="—" />
              <Stat label="Confidence" value="Low" hint="needs documents" />
            </div>
            <p className="mt-3 font-mono text-[11px] text-ink-muted">Full liability explanation unlocks after trial.</p>
          </Card>
        </div>

        <Disclaimer />
      </div>
    </>
  );
}
