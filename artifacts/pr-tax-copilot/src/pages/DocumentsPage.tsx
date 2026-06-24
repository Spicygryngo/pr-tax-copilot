import { Link } from "wouter";
import { useRef, useState } from "react";
import { AppHeader, Card, Pill } from "../components/ui-primitives";
import { DocStatusPill } from "../components/DocStatusPill";
import { useStore } from "../lib/useStore";
import { addDocument, getDocuments, getSession, updateDocument } from "../lib/store";
import { DOCUMENT_TYPES, type DocumentType, type TaxDocument } from "../lib/types";
import { mockExtract } from "../lib/extract";

const TRIAL_DOC_LIMIT = 10;

export default function DocumentsPage() {
  const { profile, documents } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hintType, setHintType] = useState<DocumentType>("unknown");
  const [busy, setBusy] = useState(false);

  const atLimit = documents.length >= TRIAL_DOC_LIMIT;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const session = getSession();
    const year = profile?.filingYear ?? new Date().getFullYear() - 1;

    for (const file of Array.from(files)) {
      // Read fresh count from localStorage on every iteration — prevents
      // the stale-closure bypass where selecting 15 files at once sneaks
      // past the limit because `documents.length` from the render closure
      // hasn't updated yet.
      const liveCount = getDocuments().length;
      if (liveCount >= TRIAL_DOC_LIMIT) break;

      const id = `doc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      const now = new Date().toISOString();
      const doc: TaxDocument = {
        id,
        userId: session?.userId ?? "local",
        taxYear: year,
        fileName: file.name,
        filePath: `local://${file.name}`,
        mimeType: file.type || "application/octet-stream",
        documentType: hintType,
        status: "processing",
        confidence: null,
        accountantReady: false,
        createdAt: now,
        updatedAt: now,
      };
      addDocument(doc);

      try {
        const base = import.meta.env.BASE_URL ?? "/";
        const apiUrl = (base.endsWith("/") ? base : base + "/") + "api/extract";
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name, hintType }),
        });
        if (res.ok) {
          const { result } = await res.json();
          updateDocument(id, {
            documentType: result.document_type,
            status: result.requires_human_review ? "needs_review" : "extracted",
            confidence: result.confidence,
            amount: result.amount,
            currency: result.currency,
            category: result.category,
            vendor: result.issuer,
            summary: result.extracted_text_summary,
          });
        } else {
          throw new Error("api_error");
        }
      } catch {
        const result = mockExtract(file.name, hintType);
        updateDocument(id, {
          documentType: result.document_type,
          status: result.requires_human_review ? "needs_review" : "extracted",
          confidence: result.confidence,
          amount: result.amount,
          currency: result.currency,
          category: result.category,
          vendor: result.issuer,
          summary: result.extracted_text_summary,
        });
      }
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <AppHeader
        title="Document vault"
        subtitle={`${documents.length} document${documents.length === 1 ? "" : "s"} · trial limit ${TRIAL_DOC_LIMIT}`}
        action={<Pill tone={atLimit ? "yellow" : "muted"}>{documents.length}/{TRIAL_DOC_LIMIT}</Pill>}
      />

      <div className="space-y-6 p-8">
        <Card title="Upload documents">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-48">
              <span className="label">Document type (optional)</span>
              <select
                className="input"
                value={hintType}
                onChange={(e) => setHintType(e.target.value as DocumentType)}
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <button
              className="btn-accent"
              disabled={busy || atLimit}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? "Processing…" : "Select files"}
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          {atLimit && (
            <p className="mt-3 font-mono text-xs text-status-yellow">
              Trial limit reached. Upgrade to upload more documents.
            </p>
          )}
          <p className="mt-3 text-xs text-ink-muted">
            Files are private to your account. In production they are stored
            encrypted with signed-URL access only — never public.
          </p>
        </Card>

        <Card title="Your documents">
          {documents.length === 0 ? (
            <p className="text-sm text-ink-muted">
              No documents yet. Upload receipts, statements, or forms to begin.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                    <th className="py-2 pr-4">File</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Confidence</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => (
                    <tr key={d.id} className="border-b border-border/60">
                      <td className="py-3 pr-4 text-ink">{d.fileName}</td>
                      <td className="py-3 pr-4 text-ink-muted">
                        {d.documentType.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 pr-4 font-mono text-ink-body">
                        {d.amount != null
                          ? `${d.currency ?? "USD"} ${d.amount.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="py-3 pr-4 font-mono text-ink-body">
                        {d.confidence != null
                          ? `${Math.round(d.confidence * 100)}%`
                          : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <DocStatusPill status={d.status} />
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/documents/${d.id}`}
                          className="text-accent hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
