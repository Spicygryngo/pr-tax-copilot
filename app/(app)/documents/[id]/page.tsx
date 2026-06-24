"use client";

import { use } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, Stat, Disclaimer } from "@/components/ui";
import { DocStatusPill } from "@/components/DocStatusPill";
import { useStore } from "@/lib/useStore";
import { deleteDocument, updateDocument } from "@/lib/store";
import type { DocumentStatus } from "@/lib/types";

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { documents } = useStore();
  const doc = documents.find((d) => d.id === id);

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
    updateDocument(doc!.id, {
      status,
      accountantReady: status === "accepted" || status === "included_in_report",
    });
  }

  const lowConfidence = doc.confidence != null && doc.confidence < 0.6;

  return (
    <>
      <AppHeader
        title={doc.fileName}
        subtitle={`${doc.documentType.replace(/_/g, " ")} · tax year ${doc.taxYear}`}
        action={<DocStatusPill status={doc.status} />}
      />
      <div className="space-y-6 p-8">
        {lowConfidence && (
          <div className="border border-status-yellow/40 bg-panel p-4 text-sm text-status-yellow">
            Low extraction confidence ({Math.round((doc.confidence ?? 0) * 100)}%). Please verify the
            fields below before accepting.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Extracted fields" className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Type" value={doc.documentType.replace(/_/g, " ")} />
              <Stat label="Amount" value={doc.amount != null ? `${doc.currency ?? "USD"} ${doc.amount.toLocaleString()}` : "—"} />
              <Stat label="Confidence" value={doc.confidence != null ? `${Math.round(doc.confidence * 100)}%` : "—"} />
              <Stat label="Vendor / issuer" value={doc.vendor || "—"} />
              <Stat label="Category" value={doc.category || "—"} />
              <Stat label="Tax year" value={doc.taxYear} />
            </div>
            {doc.summary && (
              <div className="terminal mt-4">
                <span className="text-ink-muted">AI summary →</span> {doc.summary}
              </div>
            )}
          </Card>

          <Card title="Review workflow">
            <p className="text-xs text-ink-muted">
              Accept once the extracted data is correct. Reject if it's wrong or irrelevant.
            </p>
            <div className="mt-4 space-y-2">
              <button className="btn-accent w-full" onClick={() => setStatus("accepted")} disabled={doc.status === "accepted"}>
                Accept
              </button>
              <button className="btn-ghost w-full" onClick={() => setStatus("needs_review")}>
                Mark needs review
              </button>
              <button
                className="btn-ghost w-full"
                onClick={() => setStatus("included_in_report")}
                disabled={doc.status !== "accepted"}
                title={doc.status !== "accepted" ? "Accept first" : ""}
              >
                Include in report
              </button>
              <button className="btn w-full border border-status-red/50 text-status-red hover:bg-status-red/10" onClick={() => setStatus("rejected")}>
                Reject
              </button>
            </div>
            <button
              className="mt-4 w-full text-xs text-ink-muted hover:text-status-red"
              onClick={() => {
                deleteDocument(doc.id);
                window.location.assign("/documents");
              }}
            >
              Delete document
            </button>
          </Card>
        </div>

        <Card title="Status timeline">
          <div className="flex flex-wrap gap-2">
            {(["uploaded", "processing", "extracted", "needs_review", "accepted", "included_in_report"] as DocumentStatus[]).map((s) => (
              <Pill key={s} tone={doc.status === s ? "accent" : "muted"}>{s.replace(/_/g, " ")}</Pill>
            ))}
          </div>
        </Card>

        <Disclaimer />
      </div>
    </>
  );
}
