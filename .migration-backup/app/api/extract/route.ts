import { NextResponse } from "next/server";
import { EXTRACTION_SYSTEM_PROMPT, mockExtract, type ExtractionResult } from "@/lib/extract";
import type { DocumentType } from "@/lib/types";

// POST /api/extract
// Body: { fileName: string, hintType?: DocumentType }
// Returns an ExtractionResult. Uses the real OpenAI call when OPENAI_API_KEY is
// set; otherwise returns a deterministic mock so the workflow is demoable.
//
// SECURITY: this runs server-side only. The OpenAI key never reaches the client.
export async function POST(req: Request) {
  let body: { fileName?: string; hintType?: DocumentType };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const fileName = body.fileName?.trim();
  if (!fileName) {
    return NextResponse.json({ error: "fileName_required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const result = mockExtract(fileName, body.hintType);
    return NextResponse.json({ result, mode: "mock" });
  }

  // --- Real extraction (Phase 4) ---------------------------------------
  // Wiring left explicit so it can be enabled by setting OPENAI_API_KEY.
  // For files you would pass the document image/text; here we send the
  // filename context as a placeholder until the storage signed-URL fetch
  // is wired in Phase 4.
  try {
    const model = process.env.OPENAI_TEXT_MODEL || "gpt-5.5";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: `Document file name: ${fileName}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`openai_${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as ExtractionResult;
    return NextResponse.json({ result: parsed, mode: "openai" });
  } catch (err) {
    // Fail safe to mock so the UX never blocks; flag for review.
    const result = mockExtract(fileName, body.hintType);
    result.requires_human_review = true;
    return NextResponse.json({ result, mode: "mock_fallback", error: String(err) });
  }
}
