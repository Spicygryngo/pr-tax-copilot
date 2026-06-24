import type { ChecklistItem, ChecklistStatus, TaxpayerType, UserTaxProfile } from "./types";

interface ChecklistTemplate {
  title: string;
  description: string;
  category: ChecklistItem["category"];
  required: boolean;
}

const PROFILE_ITEMS: ChecklistTemplate[] = [
  { title: "Complete taxpayer profile", description: "Finish the intake wizard so we can tailor your checklist, deadlines, and dashboard.", category: "profile", required: true },
  { title: "Upload prior-year tax return", description: "Last year's return helps us understand carryovers, credits, and your filing pattern.", category: "shared", required: false },
];

const EMPLOYEE_ITEMS: ChecklistTemplate[] = [
  { title: "Upload W-2PR / 499R-2", description: "Your employer wage and withholding statement(s) for the filing year.", category: "employee", required: true },
  { title: "Upload any Form 480 income statements", description: "Add 480.6 / 480.7 forms if you received non-wage income.", category: "employee", required: false },
  { title: "Add dependent information", description: "List dependents to evaluate credits and deductions you may qualify for.", category: "employee", required: false },
  { title: "Review withholding", description: "Confirm withholding amounts against your statements to spot under/over-withholding.", category: "employee", required: true },
  { title: "Review deductions & credits", description: "Note potential deductions and credits to discuss with your CPA.", category: "employee", required: false },
  { title: "Generate accountant packet", description: "Produce an accountant-ready summary of your reviewed records.", category: "employee", required: true },
  { title: "Review SURI filing instructions", description: "Read the guided steps for filing through SURI. Verify before filing.", category: "employee", required: true },
];

const CONTRACTOR_ITEMS: ChecklistTemplate[] = [
  { title: "Upload all income statements (Form 480)", description: "Add every 480 income statement you received this year.", category: "contractor", required: true },
  { title: "Upload 1099 income (if applicable)", description: "Include any US-source 1099 income.", category: "contractor", required: false },
  { title: "Upload business bank statements", description: "Bank statements let us reconcile income and expenses.", category: "contractor", required: true },
  { title: "Upload receipts", description: "Add receipts for deductible business expenses.", category: "contractor", required: true },
  { title: "Categorize expenses", description: "Review and confirm the category for each extracted expense.", category: "contractor", required: true },
  { title: "Review estimated payments", description: "Check estimated tax obligations and what you've paid so far.", category: "contractor", required: true },
  { title: "Confirm deductible expenses", description: "Flag which expenses are deductible for your CPA to verify.", category: "contractor", required: false },
  { title: "Generate CPA packet", description: "Produce a Schedule-style summary and accountant-ready packet.", category: "contractor", required: true },
];

const BUSINESS_ITEMS: ChecklistTemplate[] = [
  { title: "Upload business bank statements", description: "All business accounts for the filing year.", category: "business_owner", required: true },
  { title: "Upload invoices", description: "Customer invoices supporting reported income.", category: "business_owner", required: true },
  { title: "Upload receipts", description: "Receipts for business expenses and purchases.", category: "business_owner", required: true },
  { title: "Upload payroll documents", description: "Payroll records if you have employees.", category: "business_owner", required: false },
  { title: "Upload IVU/SUT records", description: "Sales-and-use tax (IVU/SUT) collection and remittance records.", category: "business_owner", required: false },
  { title: "Reconcile income and expenses", description: "Match deposits and expenses across statements and receipts.", category: "business_owner", required: true },
  { title: "Review merchant obligations", description: "Confirm merchant registration and IVU/SUT filing obligations.", category: "business_owner", required: false },
  { title: "Generate bookkeeper packet", description: "Produce a reconciled summary for your bookkeeper.", category: "business_owner", required: true },
  { title: "Generate CPA packet", description: "Produce the accountant-ready handoff packet.", category: "business_owner", required: true },
];

const ACT60_ITEMS: ChecklistTemplate[] = [
  { title: "Upload Act 60 decree", description: "Your signed Act 60 decree document.", category: "act60", required: true },
  { title: "Confirm decree type", description: "Identify your decree type (e.g. Export Services, Individual Resident Investor).", category: "act60", required: true },
  { title: "Upload proof of Puerto Rico residency", description: "Residency documentation if applicable to your decree.", category: "act60", required: false },
  { title: "Upload annual compliance docs", description: "Documents supporting your annual compliance obligations.", category: "act60", required: true },
  { title: "Upload donation proof (if applicable)", description: "Proof of required annual charitable donation under your decree.", category: "act60", required: false },
  { title: "Track annual report deadline", description: "Acknowledge the DDEC annual report deadline. Verify the exact date.", category: "act60", required: true },
  { title: "Track annual fee/payment obligations", description: "Note annual fees and payment obligations under your decree.", category: "act60", required: true },
  { title: "Generate Act 60 compliance packet", description: "Produce the compliance packet for CPA/attorney review.", category: "act60", required: true },
  { title: "Ask CPA/attorney to review", description: "Have a qualified professional review your Act 60 compliance before filing.", category: "act60", required: true },
];

const ITEMS_BY_TYPE: Record<TaxpayerType, ChecklistTemplate[]> = {
  employee: EMPLOYEE_ITEMS,
  contractor: CONTRACTOR_ITEMS,
  business_owner: BUSINESS_ITEMS,
  act60: ACT60_ITEMS,
};

function makeId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return `chk_${(h >>> 0).toString(36)}`;
}

export function generateChecklist(profile: UserTaxProfile): ChecklistItem[] {
  const templates: ChecklistTemplate[] = [...PROFILE_ITEMS];

  for (const t of profile.taxpayerTypes) {
    templates.push(...ITEMS_BY_TYPE[t]);
  }

  if (profile.collectsIvu && !profile.taxpayerTypes.includes("business_owner")) {
    templates.push({ title: "Upload IVU/SUT records", description: "You indicated you collect IVU/SUT. Add your collection and remittance records.", category: "shared", required: true });
  }
  if (profile.hasPayroll && !profile.taxpayerTypes.includes("business_owner")) {
    templates.push({ title: "Upload payroll documents", description: "You indicated you run payroll. Add payroll records for the filing year.", category: "shared", required: true });
  }

  const seen = new Set<string>();
  const now = new Date().toISOString();
  const items: ChecklistItem[] = [];

  for (const t of templates) {
    if (seen.has(t.title)) continue;
    seen.add(t.title);
    items.push({
      id: makeId(`${profile.userId}:${profile.filingYear}:${t.title}`),
      userId: profile.userId,
      taxYear: profile.filingYear,
      title: t.title,
      description: t.description,
      category: t.category,
      required: t.required,
      status: "todo" as ChecklistStatus,
      createdAt: now,
    });
  }

  return items;
}
