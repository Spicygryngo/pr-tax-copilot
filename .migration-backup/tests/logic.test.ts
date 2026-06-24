import { test } from "node:test";
import assert from "node:assert/strict";
import { generateChecklist } from "../lib/checklist";
import { computeReadiness } from "../lib/readiness";
import { countdown, deadlinesForUser } from "../lib/deadlines";
import type { UserTaxProfile } from "../lib/types";

function makeProfile(over: Partial<UserTaxProfile> = {}): UserTaxProfile {
  const now = new Date().toISOString();
  return {
    id: "p1",
    userId: "u1",
    filingYear: 2025,
    languagePreference: "en",
    taxpayerTypes: ["employee"],
    fullYearResident: true,
    filingStatus: "individual",
    hasSuri: true,
    hasAct60: false,
    hasBusiness: false,
    collectsIvu: false,
    hasPayroll: false,
    hasBankStatements: false,
    hasCpa: false,
    createdAt: now,
    updatedAt: now,
    ...over,
  };
}

test("employee checklist includes W-2PR upload and is non-empty", () => {
  const items = generateChecklist(makeProfile());
  assert.ok(items.length > 0);
  assert.ok(items.some((i) => /W-2PR/i.test(i.title)));
  // profile-complete item always present
  assert.ok(items.some((i) => i.category === "profile"));
});

test("checklist de-duplicates shared items across multiple profile types", () => {
  const items = generateChecklist(
    makeProfile({ taxpayerTypes: ["contractor", "business_owner"] })
  );
  const receipts = items.filter((i) => i.title === "Upload receipts");
  assert.equal(receipts.length, 1, "Upload receipts should appear once");
});

test("conditional IVU item added when collectsIvu and not business owner", () => {
  const items = generateChecklist(
    makeProfile({ taxpayerTypes: ["contractor"], collectsIvu: true })
  );
  assert.ok(items.some((i) => /IVU\/SUT/i.test(i.title)));
});

test("act60 profile generates act60 checklist and deadline", () => {
  const items = generateChecklist(makeProfile({ taxpayerTypes: ["act60"], hasAct60: true }));
  assert.ok(items.some((i) => i.category === "act60"));
  const dls = deadlinesForUser(2025, ["act60"]);
  assert.ok(dls.some((d) => d.id.includes("act60")));
});

test("readiness score is 0-100 and rises as items complete", () => {
  const profile = makeProfile();
  const checklist = generateChecklist(profile);
  const empty = computeReadiness({ profile, checklist, documents: [] });
  assert.ok(empty.score >= 0 && empty.score <= 100);

  const allDone = checklist.map((c) => ({ ...c, status: "done" as const }));
  const better = computeReadiness({ profile, checklist: allDone, documents: [] });
  assert.ok(better.score > empty.score);
});

test("readiness with no profile scores low and is incomplete", () => {
  const r = computeReadiness({ profile: null, checklist: [], documents: [] });
  assert.ok(r.score < 80);
  assert.equal(r.status, "incomplete");
});

test("countdown returns overdue for past dates and ok for far-future", () => {
  const past = countdown("2000-01-01");
  assert.equal(past.state, "overdue");
  assert.ok(past.daysRemaining < 0);

  const future = countdown("2999-01-01");
  assert.equal(future.state, "ok");
});

test("countdown warns inside 14 days", () => {
  const soon = new Date();
  soon.setDate(soon.getDate() + 5);
  const iso = soon.toISOString().slice(0, 10);
  const c = countdown(iso);
  assert.equal(c.state, "warning");
});
