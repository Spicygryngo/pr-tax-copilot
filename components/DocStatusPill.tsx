import { Pill } from "./ui";
import type { DocumentStatus } from "@/lib/types";

const MAP: Record<DocumentStatus, { tone: "accent" | "green" | "yellow" | "red" | "muted"; label: string }> = {
  uploaded: { tone: "muted", label: "uploaded" },
  processing: { tone: "yellow", label: "processing" },
  extracted: { tone: "accent", label: "extracted" },
  needs_review: { tone: "yellow", label: "needs review" },
  accepted: { tone: "green", label: "accepted" },
  rejected: { tone: "red", label: "rejected" },
  included_in_report: { tone: "green", label: "in report" },
};

export function DocStatusPill({ status }: { status: DocumentStatus }) {
  const { tone, label } = MAP[status];
  return <Pill tone={tone}>{label}</Pill>;
}
