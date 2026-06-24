import type { DocumentType } from "./types";

export interface ExtractionResult {
  document_type: DocumentType;
  tax_year: string | null;
  issuer: string | null;
  recipient: string | null;
  date: string | null;
  amount: number | null;
  currency: string;
  payment_method: string | null;
  category: string | null;
  deductibility_note: string | null;
  confidence: number;
  requires_human_review: boolean;
  extracted_text_summary: string;
  possible_tax_relevance: string | null;
}

export function mockExtract(fileName: string, hintType?: DocumentType): ExtractionResult {
  const lower = fileName.toLowerCase();
  let document_type: DocumentType = hintType ?? "unknown";
  if (document_type === "unknown") {
    if (/receipt/.test(lower)) document_type = "receipt";
    else if (/invoice/.test(lower)) document_type = "invoice";
    else if (/bank/.test(lower)) document_type = "bank_statement";
    else if (/w-?2|499/.test(lower)) document_type = "w2pr_499r2";
    else if (/480/.test(lower)) document_type = "form_480";
    else if (/1099/.test(lower)) document_type = "form_1099";
    else if (/act\s?60|decree/.test(lower)) document_type = "act60_decree";
  }

  let h = 0;
  for (let i = 0; i < fileName.length; i++) h = (h * 31 + fileName.charCodeAt(i)) | 0;
  const amount = Math.abs(h % 250000) / 100;
  const confidence = 0.5 + (Math.abs(h % 50) / 100);

  return {
    document_type,
    tax_year: String(new Date().getFullYear() - 1),
    issuer: null,
    recipient: null,
    date: null,
    amount: document_type === "act60_decree" ? null : Number(amount.toFixed(2)),
    currency: "USD",
    payment_method: null,
    category: categoryFor(document_type),
    deductibility_note: null,
    confidence: Number(confidence.toFixed(2)),
    requires_human_review: confidence < 0.6,
    extracted_text_summary: `Mock extraction for "${fileName}". Configure OPENAI_API_KEY to enable real OCR/vision extraction.`,
    possible_tax_relevance: relevanceFor(document_type),
  };
}

function categoryFor(t: DocumentType): string | null {
  switch (t) {
    case "receipt":
    case "invoice":
      return "business_expense";
    case "bank_statement":
      return "financial_record";
    case "w2pr_499r2":
    case "form_480":
    case "form_1099":
      return "income";
    case "act60_decree":
      return "compliance";
    default:
      return null;
  }
}

function relevanceFor(t: DocumentType): string {
  switch (t) {
    case "receipt":
    case "invoice":
      return "Potential deductible business expense — confirm category with your CPA.";
    case "w2pr_499r2":
    case "form_480":
    case "form_1099":
      return "Reported income document.";
    case "act60_decree":
      return "Act 60 compliance document — feeds your annual compliance checklist.";
    default:
      return "Relevance unclear — flagged for human review.";
  }
}
