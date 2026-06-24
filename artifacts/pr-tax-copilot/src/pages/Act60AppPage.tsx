import { Link } from "wouter";
import { AppHeader, Card, Pill, Disclaimer } from "../components/ui-primitives";
import { useStore } from "../lib/useStore";

export default function Act60AppPage() {
  const { profile } = useStore();

  return (
    <>
      <AppHeader
        title="Act 60"
        subtitle="Decree compliance tracker"
        action={<Pill tone="muted">Phase 3</Pill>}
      />
      <div className="space-y-6 p-8">
        {!profile?.hasAct60 ? (
          <Card>
            <p className="text-sm text-ink-body">
              No Act 60 decree on file. If you have an Act 60 decree, go to Settings and update your profile.
            </p>
            <Link href="/onboarding" className="btn-ghost mt-4">Update profile</Link>
          </Card>
        ) : (
          <>
            <Card title="Decree status">
              <div className="flex items-center gap-3">
                <Pill tone="yellow">Pending upload</Pill>
                <span className="text-sm text-ink-muted">Decree type: {profile.act60Type || "not specified"}</span>
              </div>
              <p className="mt-3 text-sm text-ink-body">
                Upload your Act 60 decree document to unlock the full compliance checklist and annual report tracking.
              </p>
              <Link href="/documents" className="btn-accent mt-4">Upload decree</Link>
            </Card>

            <Card title="Annual compliance items">
              <ul className="space-y-3 text-sm">
                {[
                  { t: "DDEC annual report", d: "Due April 15 of the following year (verify with DDEC).", done: false },
                  { t: "Annual charitable donation", d: "Required donation under your decree. Upload proof.", done: false },
                  { t: "Hacienda/SURI tax filing", d: "Standard PR income tax return. Verify requirements with CPA.", done: false },
                  { t: "Annual fee payment", d: "Annual fee obligations under your decree. Verify with DDEC/attorney.", done: false },
                ].map((item) => (
                  <li key={item.t} className="panel p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-ink">{item.t}</span>
                      <Pill tone={item.done ? "green" : "muted"}>{item.done ? "done" : "pending"}</Pill>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{item.d}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        <Disclaimer>
          <span className="font-mono uppercase text-accent">Verify before relying.</span> Act 60
          compliance requirements vary by decree type and year. Confirm all obligations with your
          attorney and DDEC before relying on any date or checklist item shown here.
        </Disclaimer>
      </div>
    </>
  );
}
