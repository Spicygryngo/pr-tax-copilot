import { AudiencePage } from "@/components/marketing";

export default function ForBusinessOwnersPage() {
  return (
    <AudiencePage
      eyebrow="For business owners"
      title="Reconcile income, expenses, payroll, and IVU/SUT"
      blurb="Upload business bank statements, invoices, receipts, payroll, and IVU/SUT records. We reconcile income and expenses and produce a bookkeeper/CPA handoff packet — with merchant obligations flagged."
      bullets={[
        "Business bank and credit statements",
        "Invoices and receipts",
        "Payroll documents",
        "IVU/SUT collection and remittance records",
        "Merchant registration & obligation review",
        "Bookkeeper and CPA handoff packets",
      ]}
    />
  );
}
