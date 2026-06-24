import { AudiencePage } from "@/components/marketing";

export default function ForContractorsPage() {
  return (
    <AudiencePage
      eyebrow="For independent contractors"
      title="Every receipt, income statement, and estimated payment in one place"
      blurb="Upload Form 480 income, 1099s, bank statements, and receipts. We categorize expenses, track estimated payments, and build a Schedule-style summary your CPA can work from immediately."
      bullets={[
        "Upload Form 480 income statements and 1099s",
        "Receipt and bank-statement ingestion",
        "Automatic expense categorization (review before trust)",
        "Estimated payment tracking",
        "Self-employment obligation reminders",
        "Schedule-style expense summary + CPA packet",
      ]}
    />
  );
}
