"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, Pill, Disclaimer } from "@/components/ui";

interface Msg {
  role: "user" | "assistant";
  content: string;
  abstained?: boolean;
}

const MODES = [
  "General PR Tax Education",
  "My Documents",
  "Deadline Guidance",
  "Act 60 Guidance",
  "Accountant Handoff",
  "Estimate Explanation",
];

// Phase 5 stub. The real advisor retrieves from a versioned knowledge base and
// answers with citations or abstains. Until the KB is ingested, the assistant
// abstains by design — it must never invent Puerto Rico tax law.
export default function AdvisorPage() {
  const [mode, setMode] = useState(MODES[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Puerto Rico Tax Copilot, an education-only assistant. I can explain concepts, your documents, checklist items, and deadlines, and help you prepare questions for a CPA. I'm not a CPA, attorney, or Hacienda. Until the knowledge base is connected, I'll abstain on specific legal/tax claims rather than guess.",
    },
  ]);

  function send() {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const reply: Msg = {
      role: "assistant",
      abstained: true,
      content:
        "I can't verify that against a cited source yet — the Puerto Rico knowledge base (Hacienda / DDEC / SURI guidance) is ingested in Phase 5. For anything specific to your situation, please confirm with a qualified CPA or the official portals. I can still help you organize documents, build your checklist, and draft questions to ask your accountant.",
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  }

  return (
    <>
      <AppHeader
        title="AI Advisor"
        subtitle="Education-only · cites sources or abstains"
        action={<Pill tone="yellow">Phase 5 preview</Pill>}
      />
      <div className="flex h-[calc(100vh-89px)] flex-col p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`pill ${mode === m ? "border-accent text-accent" : "border-border-strong text-ink-muted"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[80%] rounded-btn px-4 py-3 text-sm ${
                    m.role === "user" ? "bg-accent text-bg" : "panel text-ink-body"
                  }`}
                >
                  {m.abstained && (
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-status-yellow">
                      Cannot verify — abstaining
                    </div>
                  )}
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2 border-t border-border pt-4">
            <input
              className="input flex-1"
              placeholder={`Ask about ${mode.toLowerCase()}…`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn-accent" onClick={send}>Send</button>
          </div>
        </Card>

        <div className="mt-4">
          <Disclaimer />
        </div>
      </div>
    </>
  );
}
