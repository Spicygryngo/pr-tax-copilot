import { Link } from "wouter";
import { AppHeader, Card, Pill, Disclaimer } from "../components/ui-primitives";
import { useStore } from "../lib/useStore";
import { countdown, deadlinesForUser } from "../lib/deadlines";

export default function CalendarPage() {
  const { profile } = useStore();

  if (!profile) {
    return (
      <>
        <AppHeader title="Calendar" />
        <div className="p-8">
          <Card>
            <p className="text-sm text-ink-body">Complete the intake wizard to see your deadline calendar.</p>
            <Link href="/onboarding" className="btn-accent mt-4">Start intake wizard</Link>
          </Card>
        </div>
      </>
    );
  }

  const deadlines = deadlinesForUser(profile.filingYear, profile.taxpayerTypes).sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate)
  );

  return (
    <>
      <AppHeader title="Calendar" subtitle="Key Puerto Rico tax obligations for your profile" />
      <div className="space-y-6 p-8">
        {deadlines.map((d) => {
          const c = countdown(d.dueDate);
          const tone = c.state === "overdue" ? "red" : c.state === "warning" ? "yellow" : "green";
          return (
            <Card key={d.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg">{d.name}</h3>
                    <Pill tone={tone}>{c.label}</Pill>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">
                    {d.agency} · {d.jurisdiction} · {d.recurrenceRule}
                  </p>
                  <p className="mt-2 text-xs text-ink-muted">{d.penaltyNote}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-ink">{d.dueDate}</div>
                  {d.requiresVerification && (
                    <div className="mt-1 font-mono text-[11px] text-status-yellow">verify with {d.agency.split(" ")[0]}</div>
                  )}
                  <a href={d.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-accent hover:underline">
                    Official source →
                  </a>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.warningDays.map((w) => (
                  <span key={w} className="font-mono text-[10px] text-ink-muted">T-{w}d</span>
                ))}
              </div>
            </Card>
          );
        })}
        <Disclaimer>
          <span className="font-mono uppercase text-accent">Verify before relying.</span> These dates
          are general rules and may change by official guidance. Confirm every date with Hacienda, DDEC, or SURI.
        </Disclaimer>
      </div>
    </>
  );
}
