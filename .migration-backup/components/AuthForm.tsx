"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo, Disclaimer } from "./ui";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getProfile, signIn } from "@/lib/store";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    // LOCAL MODE: create a local session. In production this calls
    // supabase.auth.signInWithPassword / signUp instead.
    signIn(email.trim().toLowerCase());
    const hasProfile = getProfile();
    window.location.assign(isSignup || !hasProfile ? "/onboarding" : "/dashboard");
  }

  return (
    <div className="grid-backdrop flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-md p-8">
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
        <h1 className="mt-6 text-3xl">{isSignup ? "Start your 7-day trial" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {isSignup
            ? "No credit card for the trial. You can organize documents and see a preview report."
            : "Log in to your tax cockpit."}
        </p>

        {!isSupabaseConfigured() && (
          <p className="mt-4 border border-border-strong bg-panel p-3 font-mono text-xs text-ink-muted">
            LOCAL MODE — Supabase is not configured. Auth and data persist in your browser only.
            Set NEXT_PUBLIC_SUPABASE_URL / ANON_KEY to enable real accounts.
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-ink-muted">Local mode ignores the password field.</p>
          </div>
          <button type="submit" className="btn-accent w-full" disabled={busy}>
            {busy ? "…" : isSignup ? "Create account & start trial" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-sm text-ink-muted">
          {isSignup ? (
            <>Already have an account? <Link href="/login" className="text-accent">Log in</Link></>
          ) : (
            <>New here? <Link href="/signup" className="text-accent">Start a trial</Link></>
          )}
        </p>
        <div className="mt-6">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
