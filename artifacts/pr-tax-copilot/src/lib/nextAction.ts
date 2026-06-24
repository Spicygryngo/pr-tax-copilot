import type { ChecklistItem, TaxDocument, UserTaxProfile } from "./types";

export interface NextAction {
  title: string;
  detail: string;
  cta: string;
  href: string;
}

interface Input {
  profile: UserTaxProfile | null;
  checklist: ChecklistItem[];
  documents: TaxDocument[];
}

export function nextBestAction({ profile, checklist, documents }: Input): NextAction {
  if (!profile) {
    return {
      title: "Complete your taxpayer profile",
      detail: "The intake wizard tailors your checklist, deadlines, and dashboard.",
      cta: "Start intake wizard",
      href: "/onboarding",
    };
  }

  const lowConfidence = documents.filter(
    (d) => d.status === "needs_review" || (d.confidence !== null && d.confidence !== undefined && d.confidence < 0.6)
  );
  if (lowConfidence.length > 0) {
    return {
      title: `Review ${lowConfidence.length} low-confidence document${lowConfidence.length > 1 ? "s" : ""}`,
      detail: "These were extracted with low confidence and need your confirmation before they count.",
      cta: "Review documents",
      href: "/documents",
    };
  }

  const missingUpload = checklist.find((c) => c.required && c.status !== "done" && /upload/i.test(c.title));
  if (missingUpload) {
    return {
      title: missingUpload.title,
      detail: missingUpload.description,
      cta: "Go to documents",
      href: "/documents",
    };
  }

  const nextRequired = checklist.find((c) => c.required && c.status !== "done");
  if (nextRequired) {
    return {
      title: nextRequired.title,
      detail: nextRequired.description,
      cta: "Open checklist",
      href: "/checklist",
    };
  }

  return {
    title: "Generate your accountant packet",
    detail: "Your required items are complete. Produce the CPA-ready packet for final review.",
    cta: "Go to reports",
    href: "/reports",
  };
}
