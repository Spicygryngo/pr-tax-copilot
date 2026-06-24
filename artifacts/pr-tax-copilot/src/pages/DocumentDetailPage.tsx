import { useParams, Link } from "wouter";
import { AppHeader, Card, Pill, Disclaimer } from "../components/ui-primitives";
import { DocStatusPill } from "../components/DocStatusPill";
import { getDocument, updateDocument } from "../lib/store";
import { useStore } from "../lib/useStore";
import type { DocumentStatus } from "../lib/types";

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { documents } = useStore();
  const doc = documents.find((d) => d.id === id) ?? getDocument(id ?? "");

  if (!doc) {
    return (
      <>
        <AppHeader title="Document" />
        <div className="p-8">
          <Card>
            <p className="text-sm text-ink-muted">Document not found.</p>
            <Link href="/documents" className="btn-ghost mt-4">Back to vault</Link>
          </Card>
        </div>
      </>
    );
  }

  function setStatus(status: DocumentStatus) {
    updateDocument(doc!.id, { status });
  }

  return (
    <>
      <AppHeader
        title={doc.fileName}
        subtitle={`${doc.documentType.replace(/_/g, " ")} · ${doc.taxYear}`}
        action={<DocStatusPill status={doc.status} />}
      />
      <div className="space-y-6 p-8">
        <Card title="Document details">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
            <div>
              <div className="label">File name</div>
              <div className="text-ink">{doc.fileName}</div>
            </div>
            <div>
              <div className="label">Type</div>
              <div className="text-ink">{doc.documentType.replace(/_/g, " ")}</div>
            </div>
            <div>
              <div className="label">Tax year</div>
              <div className="text-ink">{doc.taxYear}</div>
            </div>
            <div>
              <div className="label">Amount</div>
              <div className="text-ink font-mono">{doc.amount != null ? `${doc.currency ?? "USD"} ${doc.amount.toLocaleString()}` : "—"}</div>
            </div>
            <div>
              <div className="label">Confidence</div>
              <div className="text-ink font-mono">{doc.confidence != null ? `${Math.round(doc.confidence * 100)}%` : "—"}</div>
            </div>
            <div>
              <div className="label">Category</div>
              <div className="text-ink">{doc.category?.replace(/_/g, " ") ?? "—"}</div>
            </div>
            {doc.vendor && (
              <div>
                <div className="label">Vendor / Issuer</div>
                <div className="text-ink">{doc.vendor}</div>
              </div>
            )}
          </div>
          {doc.summary && (
            <div className="mt-4">
              <div className="label">Extraction summary</div>
              <p className="mt-1 text-sm text-ink-muted">{doc.summary}</p>
            </div>
          )}
        </Card>

        <Card title="Status timeline">
          <div className="flex flex-wrap gap-2">
            {(["uploaded", "processing", "extracted", "needs_review", "accepted", "included_in_report"] as DocumentStatus[]).map((s) => (
              <Pill key={s} tone={doc.status === s ? "accent" : "muted"}>{s.replace(/_/g, " ")}</Pill>
            ))}
          </div>
        </Card>

        <Card title="Review actions">
          <div className="flex flex-wrap gap-3">
            <button
              className="btn-accent"
              onClick={() => setStatus("accepted")}
              disabled={doc.status === "accepted"}
            >
              Accept document
            </button>
            <button
              className="btn-ghost"
              onClick={() => setStatus("needs_review")}
              disabled={doc.status === "needs_review"}
            >
              Mark for review
            </button>
            <button
              className="btn border border-status-red/60 text-status-red hover:bg-status-red/10"
              onClick={() => setStatus("rejected")}
              disabled={doc.status === "rejected"}
            >
              Reject
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Only accepted documents count toward the estimate and CPA packet.
          </p>
        </Card>

        <div className="flex gap-3">
          <Link href="/documents" className="btn-ghost">Back to vault</Link>
        </div>

        <Disclaimer />
      </div>
    </>
  );
}
