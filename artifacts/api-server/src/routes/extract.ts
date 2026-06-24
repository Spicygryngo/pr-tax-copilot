import { Router } from "express";

const router = Router();

interface ExtractionResult {
  document_type: string;
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

function mockExtract(fileName: string, hintType?: string): ExtractionResult {
  const lower = fileName.toLowerCase();
  let document_type = hintType ?? "unknown";
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
  const confidence = 0.5 + Math.abs(h % 50) / 100;

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
    extracted_text_summary: `Mock extraction for "${fileName}". Set OPENAI_API_KEY to enable real OCR/vision extraction.`,
    possible_tax_relevance: relevanceFor(document_type),
  };
}

function categoryFor(t: string): string | null {
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

function relevanceFor(t: string): string {
  switch (t) {
    case "receipt":
    case "invoice":
      return "Potential deductible business expense — confirm category with your CPA.";
    case "w2pr_499r2":
    case "form_480":
    case "form_1099":
      return "Reported income document.";
    case "act60_decree":
      return "Act 60 compliance document.";
    default:
      return "Relevance unclear — flagged for human review.";
  }
}

router.post("/extract", async (req, res) => {
  const { fileName, hintType } = req.body as { fileName?: string; hintType?: string };

  if (!fileName) {
    res.status(400).json({ error: "fileName is required" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a Puerto Rico tax document classifier. Given a file name, extract metadata and return JSON with these fields:
document_type (one of: receipt, invoice, bank_statement, credit_card_statement, income_statement, w2pr_499r2, form_480, form_1099, payroll, ivu_sut, suri_screenshot, act60_decree, act60_annual_report, donation_proof, prior_year_return, cpa_notes, business_registration, unknown),
tax_year (string or null), issuer (string or null), recipient (string or null), date (ISO string or null),
amount (number or null), currency (string, default "USD"), payment_method (string or null),
category (string or null), deductibility_note (string or null), confidence (0-1 float),
requires_human_review (boolean), extracted_text_summary (string), possible_tax_relevance (string or null).
Return ONLY valid JSON.`,
          },
          {
            role: "user",
            content: `File name: "${fileName}". Hint type: ${hintType ?? "unknown"}. Classify and extract metadata.`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const raw = completion.choices[0]?.message?.content;
      if (raw) {
        const result = JSON.parse(raw);
        res.json({ result });
        return;
      }
    } catch (err) {
      console.error("OpenAI extraction failed, falling back to mock:", err);
    }
  }

  res.json({ result: mockExtract(fileName, hintType) });
});

export default router;
