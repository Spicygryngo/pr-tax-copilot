// Core domain types for Puerto Rico Tax Copilot.
// Mirrors the MVP database schema (build plan section 18) so the localStorage
// store and a future Supabase backend share the same shapes.

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
  // A user may be more than one profile type (e.g. contractor + Act 60).
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
  // Extraction summary fields (populated in Phase 4; nullable in 1-3).
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
  dueDate: string; // ISO date
  recurrenceRule: string;
  sourceUrl: string;
  penaltyNote: string;
  requiresVerification: boolean;
  warningDays: number[];
}

export type ReadinessStatus = "on_track" | "incomplete" | "overdue";

export interface ReadinessResult {
  score: number; // 0-100
  status: ReadinessStatus;
  breakdown: { label: string; weight: number; earned: number }[];
}
