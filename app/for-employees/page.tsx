import { AudiencePage } from "@/components/marketing";

export default function ForEmployeesPage() {
  return (
    <AudiencePage
      eyebrow="For employees"
      title="W-2PR season, handled before it starts"
      blurb="Upload your 499R-2 / W-2PR and withholding forms. We organize dependents, deductions, and credits, then hand your CPA a clean packet — with SURI filing guidance you verify before you file."
      bullets={[
        "Upload W-2PR / 499R-2 and withholding forms",
        "Track dependents, deductions, and credits",
        "Review withholding for under/over-payment",
        "Form 480 income statements if you have them",
        "Guided SURI filing instructions (verify before filing)",
        "Accountant-ready packet for final review",
      ]}
    />
  );
}
