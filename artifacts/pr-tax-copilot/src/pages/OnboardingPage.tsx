import { useMemo, useState } from "react";
import { Disclaimer } from "../components/ui-primitives";
import { getProfile, getSession, saveProfile } from "../lib/store";
import type { FilingStatus, Language, TaxpayerType, UserTaxProfile } from "../lib/types";

const TAXPAYER_OPTIONS: { value: TaxpayerType; label: string; desc: string }[] = [
  { value: "employee", label: "Employee", desc: "W-2PR / 499R-2 wage income" },
  { value: "contractor", label: "Independent contractor", desc: "Form 480 / 1099 income" },
  { value: "business_owner", label: "Business owner", desc: "Entity, payroll, IVU/SUT" },
  { value: "act60", label: "Act 60 decree holder", desc: "Export/individual investor decree" },
];

type YesNo = boolean | null;

export default function OnboardingPage() {
  const existing = typeof window !== "undefined" ? getProfile() : null;
  const thisYear = new Date().getFullYear();

  const [step, setStep] = useState(0);
  const [types, setTypes] = useState<TaxpayerType[]>(existing?.taxpayerTypes ?? []);
  const [filingYear, setFilingYear] = useState<number>(existing?.filingYear ?? thisYear - 1);
  const [fullYearResident, setFullYearResident] = useState<YesNo>(existing?.fullYearResident ?? null);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(existing?.filingStatus ?? "individual");
  const [hasSuri, setHasSuri] = useState<YesNo>(existing?.hasSuri ?? null);
  const [hasAct60, setHasAct60] = useState<YesNo>(existing?.hasAct60 ?? null);
  const [act60Type, setAct60Type] = useState<string>(existing?.act60Type ?? "");
  const [collectsIvu, setCollectsIvu] = useState<YesNo>(existing?.collectsIvu ?? null);
  const [hasPayroll, setHasPayroll] = useState<YesNo>(existing?.hasPayroll ?? null);
  const [hasBankStatements, setHasBankStatements] = useState<YesNo>(existing?.hasBankStatements ?? null);
  const [hasCpa, setHasCpa] = useState<YesNo>(existing?.hasCpa ?? null);
  const [language, setLanguage] = useState<Language>(existing?.languagePreference ?? "en");

  function toggleType(t: TaxpayerType) {
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  const steps = useMemo(
    () => [
      { id: "type", title: "What kind of taxpayer are you?", valid: types.length > 0 },
      { id: "basics", title: "Filing basics", valid: fullYearResident !== null },
      { id: "access", title: "Access & decrees", valid: hasSuri !== null && hasAct60 !== null },
      { id: "business", title: "Business details", valid: collectsIvu !== null && hasPayroll !== null && hasBankStatements !== null },
      { id: "support", title: "Support & language", valid: hasCpa !== null },
    ],
    [types, fullYearResident, hasSuri, hasAct60, collectsIvu, hasPayroll, hasBankStatements, hasCpa]
  );

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  function finish() {
    const session = getSession();
    const now = new Date().toISOString();
    const profile: UserTaxProfile = {
      id: existing?.id ?? `prof_${Date.now().toString(36)}`,
      userId: session?.userId ?? "local",
      filingYear,
      languagePreference: language,
      taxpayerTypes: types,
      fullYearResident: !!fullYearResident,
      filingStatus,
      hasSuri: !!hasSuri,
      hasAct60: !!hasAct60,
      act60Type: hasAct60 ? act60Type : undefined,
      hasBusiness: types.includes("business_owner"),
      collectsIvu: !!collectsIvu,
      hasPayroll: !!hasPayroll,
      hasBankStatements: !!hasBankStatements,
      hasCpa: !!hasCpa,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    saveProfile(profile);
    window.location.assign("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-ink-muted">
          <span>Intake wizard</span>
          <span>Step {step + 1} / {steps.length}</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-btn bg-panel">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h1 className="text-3xl">{current.title}</h1>

      <div className="mt-8 space-y-6">
        {current.id === "type" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {TAXPAYER_OPTIONS.map((o) => {
              const active = types.includes(o.value);
              return (
                <button
                  key={o.value}
                  onClick={() => toggleType(o.value)}
                  className={`card p-4 text-left transition-colors ${active ? "border-accent" : "hover:border-border-strong"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base text-ink">{o.label}</span>
                    <span className={`h-3 w-3 border ${active ? "border-accent bg-accent" : "border-border-strong"}`} />
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{o.desc}</p>
                </button>
              );
            })}
            <p className="col-span-full text-xs text-ink-muted">Select all that apply.</p>
          </div>
        )}

        {current.id === "basics" && (
          <>
            <Field label="Filing year">
              <select className="input" value={filingYear} onChange={(e) => setFilingYear(Number(e.target.value))}>
                {[thisYear, thisYear - 1, thisYear - 2, thisYear - 3].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </Field>
            <YesNoField label="Puerto Rico resident for the full year?" value={fullYearResident} onChange={setFullYearResident} />
            <Field label="Filing status">
              <select className="input" value={filingStatus} onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}>
                <option value="individual">Individual</option>
                <option value="married">Married</option>
                <option value="business_entity">Business entity</option>
                <option value="both">Both individual & entity</option>
              </select>
            </Field>
          </>
        )}

        {current.id === "access" && (
          <>
            <YesNoField label="Do you have SURI access?" value={hasSuri} onChange={setHasSuri} />
            <YesNoField label="Do you have Act 60 decree documents?" value={hasAct60} onChange={setHasAct60} />
            {hasAct60 && (
              <Field label="Act 60 decree type (optional)">
                <input className="input" placeholder="e.g. Export Services / Individual Resident Investor" value={act60Type} onChange={(e) => setAct60Type(e.target.value)} />
              </Field>
            )}
          </>
        )}

        {current.id === "business" && (
          <>
            <YesNoField label="Do you collect IVU/SUT?" value={collectsIvu} onChange={setCollectsIvu} />
            <YesNoField label="Do you have employees / payroll?" value={hasPayroll} onChange={setHasPayroll} />
            <YesNoField label="Do you have business bank statements?" value={hasBankStatements} onChange={setHasBankStatements} />
          </>
        )}

        {current.id === "support" && (
          <>
            <YesNoField label="Do you already have a CPA / bookkeeper?" value={hasCpa} onChange={setHasCpa} />
            <Field label="Guidance language">
              <select className="input" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                <option value="en">English</option>
                <option value="es">Spanish (Español)</option>
                <option value="bilingual">Bilingual</option>
              </select>
            </Field>
            <Disclaimer />
          </>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </button>
        {step < steps.length - 1 ? (
          <button className="btn-accent" onClick={() => setStep((s) => s + 1)} disabled={!current.valid}>
            Continue
          </button>
        ) : (
          <button className="btn-accent" onClick={finish} disabled={!current.valid}>
            Generate my checklist
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}

function YesNoField({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex gap-2">
        {[{ v: true, t: "Yes" }, { v: false, t: "No" }].map((o) => (
          <button
            key={o.t}
            onClick={() => onChange(o.v)}
            className={`btn flex-1 border ${value === o.v ? "border-accent text-accent" : "border-border-strong text-ink-body hover:border-ink-muted"}`}
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}
