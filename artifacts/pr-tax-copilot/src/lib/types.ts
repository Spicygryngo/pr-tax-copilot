export type TaxpayerType =
  | "employee"
  | "contractor"
  | "business_owner"
  | "act60";

export type Language = "en" | "es" | "bilingual";

export type FilingStatus =
  | "individual"
  | "married"
  | "business_entity"
  | "both";

export interface UserTaxProfile {
  id: string;
  userId: string;
  filingYear: number;
  languagePreference: Language;
  taxpayerTypes: TaxpayerType[];
  fullYearResident: boolean;
  filingStatus: FilingStatus;
  hasSuri: boolean;
  hasAct60: boolean;
  act60Type?: string;
  hasBusiness: boolean;
  collectsIvu: boolean;
  hasPayroll: boolean;
  hasBankStatements: boolean;
  hasCpa: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "extracted"
  | "needs_review"
  | "accepted"
  | "rejected"
  | "included_in_report";

export const DOCUMENT_TYPES = [
  "receipt",
  "invoice",
  "bank_statement",
  "credit_card_statement",
  "income_statement",
  "w2pr_499r2",
  "form_480",
  "form_1099",
  "payroll",
  "ivu_sut",
  "suri_screenshot",
  "act60_decree",
  "act60_annual_report",
  "donation_proof",
  "prior_year_return",
  "cpa_notes",
  "business_registration",
  "unknown",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export interface TaxDocument {
  id: string;
  userId: string;
  taxYear: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  documentType: DocumentType;
  status: DocumentStatus;
  confidence: number | null;
  vendor?: string | null;
  amount?: number | null;
  currency?: string | null;
  category?: string | null;
  summary?: string | null;
  notes?: string | null;
  accountantReady: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ChecklistStatus = "todo" | "in_progress" | "done" | "skipped";

export interface ChecklistItem {
  id: string;
  userId: string;
  taxYear: number;
  title: string;
  description: string;
  category: TaxpayerType | "profile" | "shared";
  required: boolean;
  status: ChecklistStatus;
  dueDate?: string | null;
  linkedDocumentId?: string | null;
  notes?: string | null;
  createdAt: string;
  completedAt?: string | null;
}

export interface Deadline {
  id: string;
  name: string;
  jurisdiction: string;
  agency: string;
  userTypes: TaxpayerType[];
  dueDate: string;
  recurrenceRule: string;
  sourceUrl: string;
  penaltyNote: string;
  requiresVerification: boolean;
  warningDays: number[];
}

export type ReadinessStatus = "on_track" | "incomplete" | "overdue";

export interface ReadinessResult {
  score: number;
  status: ReadinessStatus;
  breakdown: { label: string; weight: number; earned: number }[];
}
