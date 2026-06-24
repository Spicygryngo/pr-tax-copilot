import { AudiencePage } from "../components/MarketingLayout";

export function ForEmployeesPage() {
  return (
    <AudiencePage
      eyebrow="For employees"
      title="W-2PR, withholding, and SURI — organized."
      blurb="Upload your W-2PR / 499R-2, confirm withholding, note dependents, and walk into your CPA with a complete packet and the right questions."
      bullets={[
        "W-2PR / 499R-2 upload and review",
        "Withholding reconciliation",
        "Dependent and credit checklist",
        "SURI filing guidance (education only)",
        "CPA/accountant handoff packet",
        "Income statement checklist",
        "Personalized deadline calendar",
      ]}
    />
  );
}

export function ForContractorsPage() {
  return (
    <AudiencePage
      eyebrow="For independent contractors"
      title="Form 480, receipts, and estimated payments — tracked."
      blurb="Upload Form 480 income statements, tag receipts as deductible, track estimated payments, and generate a Schedule-style expense summary for your bookkeeper."
      bullets={[
        "Form 480 / 1099 income statement upload",
        "Receipt and invoice vault",
        "Expense categorization",
        "Estimated payment tracker",
        "Deductible expense confirmation",
        "CPA/bookkeeper handoff packet",
        "Personalized deadline calendar",
      ]}
    />
  );
}

export function ForBusinessOwnersPage() {
  return (
    <AudiencePage
      eyebrow="For business owners"
      title="Statements, payroll, IVU/SUT — ready for your bookkeeper."
      blurb="Upload business bank statements, invoices, and payroll records. Track IVU/SUT remittances, reconcile income and expenses, and hand off a clean packet to your bookkeeper or CPA."
      bullets={[
        "Business bank statement upload",
        "Invoice and receipt vault",
        "Payroll document tracking",
        "IVU/SUT remittance records",
        "Income/expense reconciliation",
        "Bookkeeper and CPA handoff packet",
        "Merchant obligation checklist",
      ]}
    />
  );
}

export function Act60Page() {
  return (
    <AudiencePage
      eyebrow="For Act 60 decree holders"
      title="Stay compliant with your decree, all year"
      blurb="Upload your Act 60 decree and we build your annual compliance checklist: DDEC annual report, Hacienda/SURI filings, donation evidence, and a calendar of key obligations — packaged for CPA/attorney review."
      bullets={[
        "Act 60 decree upload and type confirmation",
        "Annual compliance checklist",
        "DDEC annual report deadline tracking",
        "Hacienda/SURI tax filing checklist",
        "Donation and compliance evidence vault",
        "Calendar of key Act 60 obligations",
        "Act 60 compliance packet for CPA/attorney",
      ]}
    />
  );
}
