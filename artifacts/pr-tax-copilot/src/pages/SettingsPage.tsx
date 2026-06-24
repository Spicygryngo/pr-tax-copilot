import { Link } from "wouter";
import { AppHeader, Card, Stat, Disclaimer } from "../components/ui-primitives";
import { useStore } from "../lib/useStore";
import { deleteAllData, saveProfile } from "../lib/store";
import type { Language } from "../lib/types";

export default function SettingsPage() {
  const { session, profile } = useStore();

  function setLanguage(language: Language) {
    if (!profile) return;
    saveProfile({ ...profile, languagePreference: language, updatedAt: new Date().toISOString() });
  }

  return (
    <>
      <AppHeader title="Settings" subtitle={session?.email} />
      <div className="space-y-6 p-8">
        <Card title="Account">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Email" value={<span className="text-base">{session?.email ?? "—"}</span>} />
            <Stat label="Filing year" value={profile?.filingYear ?? "—"} />
            <Stat label="Profile types" value={<span className="text-base">{profile?.taxpayerTypes.join(", ") || "—"}</span>} />
          </div>
        </Card>

        {profile && (
          <Card title="Language preference">
            <div className="flex gap-2">
              {(["en", "es", "bilingual"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`btn flex-1 border ${profile.languagePreference === l ? "border-accent text-accent" : "border-border-strong text-ink-body"}`}
                >
                  {l === "en" ? "English" : l === "es" ? "Español" : "Bilingual"}
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card title="Privacy & data">
          <ul className="space-y-2 text-sm text-ink-body">
            <li>• Your documents are private to your account. We never train AI on your documents.</li>
            <li>• Production uses row-level security and signed URLs; no public document links.</li>
            <li>• Document access is audit-logged.</li>
          </ul>
          <Link href="/onboarding" className="btn-ghost mt-4">Edit tax profile</Link>
        </Card>

        <Card title="Danger zone">
          <p className="text-sm text-ink-muted">
            Delete your profile, checklist, and all documents. This cannot be undone.
          </p>
          <button
            className="btn mt-4 border border-status-red/60 text-status-red hover:bg-status-red/10"
            onClick={() => {
              if (confirm("Delete all your data? This cannot be undone.")) {
                deleteAllData();
                window.location.assign("/login");
              }
            }}
          >
            Delete account & all documents
          </button>
        </Card>

        <Disclaimer />
      </div>
    </>
  );
}
