import type { ChecklistItem, ReadinessResult, ReadinessStatus, TaxDocument, UserTaxProfile } from "./types";

interface ReadinessInput {
  profile: UserTaxProfile | null;
  checklist: ChecklistItem[];
  documents: TaxDocument[];
  hasOverdueDeadline?: boolean;
}

function ratio(done: number, total: number): number {
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, done / total));
}

export function computeReadiness(input: ReadinessInput): ReadinessResult {
  const { profile, checklist, documents, hasOverdueDeadline } = input;

  const requiredItems = checklist.filter((c) => c.required);
  const requiredDone = requiredItems.filter((c) => c.status === "done").length;

  const requiredDocItems = requiredItems.filter((c) => /upload/i.test(c.title));
  const requiredDocsLinked = requiredDocItems.filter((c) => c.linkedDocumentId || c.status === "done").length;

  const reviewed = documents.filter((d) => d.status === "accepted" || d.status === "included_in_report").length;
  const reviewable = documents.filter((d) => d.status !== "rejected").length;

  const breakdown = [
    { label: "Profile complete", weight: 20, earned: profile ? 20 : 0 },
    { label: "Required checklist items", weight: 30, earned: Math.round(ratio(requiredDone, requiredItems.length) * 30) },
    { label: "Required documents uploaded", weight: 25, earned: Math.round(ratio(requiredDocsLinked, requiredDocItems.length) * 25) },
    { label: "Documents reviewed", weight: 15, earned: Math.round(ratio(reviewed, reviewable) * 15) },
    { label: "Has any documents", weight: 10, earned: documents.length > 0 ? 10 : 0 },
  ];

  const score = breakdown.reduce((sum, b) => sum + b.earned, 0);

  let status: ReadinessStatus;
  if (hasOverdueDeadline) {
    status = "overdue";
  } else if (score >= 80) {
    status = "on_track";
  } else {
    status = "incomplete";
  }

  return { score, status, breakdown };
}
