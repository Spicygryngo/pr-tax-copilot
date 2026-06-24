# Puerto Rico Tax Copilot

**Education-only** AI tax-organization and document-prep assistant for Puerto Rico taxpayers.
It helps users organize documents, understand what they may owe and why, track deadlines, and
prepare an accountant-ready packet. It does **not** file taxes and is **not** a CPA, attorney,
enrolled agent, tax preparer, or an official Hacienda/DDEC/IRS system.

This repository is the **MVP scaffold covering build-plan Phases 1–3**:

- **Phase 1 — App shell:** Next.js + TypeScript + Tailwind, dark "encrypted-terminal" design
  system, public marketing site, auth, dashboard layout.
- **Phase 2 — Intake + checklist:** the 11-question intake wizard, a deterministic checklist
  generator keyed to taxpayer profile, a 0–100 readiness score, and dashboard cards.
- **Phase 3 — Document vault:** upload, list, detail page, and the full status workflow
  (uploaded → processing → extracted/needs-review → accepted/rejected → included-in-report),
  backed by a mock extraction endpoint that swaps to real OpenAI by setting `OPENAI_API_KEY`.

Phases 4–8 (real AI extraction, advisor RAG, deadline emails, reports/paywall, Act 60 premium)
are present as clearly-labeled stubs so the routes and architecture are in place.

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # unit tests for the deterministic core (checklist/readiness/deadlines)
npm run build     # production build
```

### Local mode vs. Supabase

The app runs **fully in local mode** out of the box: auth and all data persist in the browser's
`localStorage`, so you can walk signup → intake → checklist → upload → review → dashboard without
any backend. This is intentional MVP scaffolding, not the production data path.

To enable the real backend, set the Supabase env vars (see `.env.example`) and apply
`supabase/schema.sql`. The data-access seam is isolated in `lib/store.ts`; implement the same
function signatures against Supabase (with the RLS policies in the schema) and the rest of the app
is unchanged. `lib/supabase.ts` exposes `isSupabaseConfigured()` for the switch.

### Environment variables

See `.env.example`. None are required for Phases 1–3 in local mode.

- `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL` — enable real document extraction (Phase 4). Without a
  key, `/api/extract` returns a deterministic mock so the review workflow is demoable.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` —
  Supabase auth/storage/Postgres. **The service-role key is server-only and must never reach the
  browser.**
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — subscriptions (Phase 7).

## Architecture notes

- **Deterministic core is separated from UI** (OpenTax-style): `lib/checklist.ts`,
  `lib/readiness.ts`, `lib/deadlines.ts`, `lib/nextAction.ts` are pure and unit-tested.
- **Extraction** lives behind `/api/extract` (server-side only) so API keys never reach the client.
- **Compliance posture is baked in:** every sensitive surface carries an education-only disclaimer,
  deadlines are flagged `requiresVerification`, estimates are labeled "not final tax due," and the
  advisor abstains rather than invent Puerto Rico tax law.

## Design system

Dark near-black cockpit. Background `#060606`, cards `#1f1f1f`, panels `#252525`, accent signal-lime
`#c5ff4a`. Serif headings (PT Serif, light), Inter Tight body, JetBrains Mono for labels/terminals.
Sharp 0px cards, 4px buttons. Tokens live in `tailwind.config.ts` and `app/globals.css`.

## Status

MVP scaffold. Not production-hardened. Do not treat any output as filing-ready tax advice.
