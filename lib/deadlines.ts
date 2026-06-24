// Internal deadline engine (build plan sections 12B & 14).
// NOTE: dates below are GENERAL RULES and carry requiresVerification=true.
// They are educational scaffolding, NOT authoritative filing dates.
// Always verify against Hacienda / DDEC / SURI before relying on them.

import type { Deadline, TaxpayerType } from "./types";

export function seedDeadlines(taxYear: number): Deadline[] {
  // Filing happens in the year AFTER the tax year.
  const filingYear = taxYear + 1;
  return [
    {
      id: `dl_individual_${taxYear}`,
      name: "Puerto Rico Individual Income Tax Return",
      jurisdiction: "Puerto Rico",
      agency: "Hacienda (Departamento de Hacienda)",
      userTypes: ["employee", "contractor", "business_owner", "act60"],
      dueDate: `${filingYear}-04-15`,
      recurrenceRule: "annual",
      sourceUrl: "https://www.hacienda.pr.gov/",
      penaltyNote:
        "Late filing/payment may incur interest, surcharges, and penalties. Verify with Hacienda/CPA.",
      requiresVerification: true,
      warningDays: [60, 30, 14, 7, 3, 1],
    },
    {
      id: `dl_estimated_q4_${taxYear}`,
      name: "Estimated Tax — 4th Installment",
      jurisdiction: "Puerto Rico",
      agency: "Hacienda",
      userTypes: ["contractor", "business_owner"],
      dueDate: `${filingYear}-01-15`,
      recurrenceRule: "quarterly",
      sourceUrl: "https://www.hacienda.pr.gov/",
      penaltyNote: "Underpayment of estimated tax may incur penalties. Verify with CPA.",
      requiresVerification: true,
      warningDays: [60, 30, 14, 7, 3, 1],
    },
    {
      id: `dl_ivu_monthly_${taxYear}`,
      name: "Monthly IVU/SUT Return (SURI)",
      jurisdiction: "Puerto Rico",
      agency: "Hacienda / SURI",
      userTypes: ["business_owner"],
      dueDate: `${filingYear}-01-20`,
      recurrenceRule: "monthly (20th)",
      sourceUrl: "https://suri.hacienda.pr.gov/",
      penaltyNote: "Late IVU/SUT remittance may incur penalties. Verify with Hacienda.",
      requiresVerification: true,
      warningDays: [14, 7, 3, 1],
    },
    {
      id: `dl_act60_annual_${taxYear}`,
      name: "Act 60 Annual Report (DDEC)",
      jurisdiction: "Puerto Rico",
      agency: "DDEC",
      userTypes: ["act60"],
      dueDate: `${filingYear}-04-15`,
      recurrenceRule: "annual",
      sourceUrl: "https://www.ddec.pr.gov/",
      penaltyNote:
        "Missing the Act 60 annual report can risk decree compliance. Verify with DDEC/attorney.",
      requiresVerification: true,
      warningDays: [90, 60, 30, 14, 7, 3, 1],
    },
  ];
}

export function deadlinesForUser(
  taxYear: number,
  taxpayerTypes: TaxpayerType[]
): Deadline[] {
  const set = new Set(taxpayerTypes);
  return seedDeadlines(taxYear).filter((d) =>
    d.userTypes.some((t) => set.has(t))
  );
}

export interface Countdown {
  daysRemaining: number; // negative if past due
  state: "ok" | "warning" | "overdue";
  label: string;
}

export function countdown(dueDateIso: string, now = new Date()): Countdown {
  const due = new Date(dueDateIso + "T23:59:59");
  const ms = due.getTime() - now.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { daysRemaining: days, state: "overdue", label: `${Math.abs(days)} days past due` };
  }
  if (days <= 14) {
    return { daysRemaining: days, state: "warning", label: `${days} days left` };
  }
  return { daysRemaining: days, state: "ok", label: `${days} days left` };
}
