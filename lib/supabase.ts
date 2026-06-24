// Supabase wiring. The app runs in LOCAL MODE (localStorage) when these env
// vars are absent, so Phases 1-3 are demoable with zero backend. When the vars
// are present, swap the store implementation to read/write Supabase with RLS.
//
// Production rules (build plan section 17):
//  - Server-side service-role key NEVER reaches the browser.
//  - Documents are private; access via signed URLs only.
//  - Row-level security isolates every user's rows (see supabase/schema.sql).

import { createBrowserClient } from "@supabase/ssr";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getBrowserSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
