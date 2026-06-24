-- Puerto Rico Tax Copilot — MVP schema (build plan section 18)
-- Run in the Supabase SQL editor. Row-level security isolates every user's rows.
-- The app runs in local mode without this; apply it to enable the real backend.

create extension if not exists "uuid-ossp";
create extension if not exists vector; -- pgvector for knowledge_chunks

-- ---------------------------------------------------------------------------
-- user_tax_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.user_tax_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filing_year int not null,
  language_preference text not null default 'en',
  taxpayer_types text[] not null default '{}',
  full_year_resident boolean not null default false,
  filing_status text not null default 'individual',
  has_suri boolean not null default false,
  has_act60 boolean not null default false,
  act60_type text,
  has_business boolean not null default false,
  collects_ivu boolean not null default false,
  has_payroll boolean not null default false,
  has_bank_statements boolean not null default false,
  has_cpa boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, filing_year)
);

-- ---------------------------------------------------------------------------
-- documents + extractions
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tax_year int not null,
  file_name text not null,
  file_path text not null,           -- private storage path; serve via signed URL
  mime_type text,
  document_type text not null default 'unknown',
  status text not null default 'uploaded',
  confidence numeric,
  review_status text,
  accountant_ready boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_extractions (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  raw_text text,
  summary text,
  extracted_json jsonb,
  amount numeric,
  date date,
  vendor text,
  category text,
  confidence numeric,
  requires_review boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- checklist_items
-- ---------------------------------------------------------------------------
create table if not exists public.checklist_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tax_year int not null,
  title text not null,
  description text,
  category text,
  required boolean not null default false,
  status text not null default 'todo',
  due_date date,
  linked_document_id uuid references public.documents(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- deadlines + user_deadlines (deadlines are global, no RLS needed for read)
-- ---------------------------------------------------------------------------
create table if not exists public.deadlines (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  jurisdiction text,
  agency text,
  user_type text[],
  due_date date,
  recurrence_rule text,
  source_url text,
  penalty_note text,
  requires_verification boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_deadlines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deadline_id uuid not null references public.deadlines(id) on delete cascade,
  status text not null default 'pending',
  acknowledged boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- knowledge base (admin-ingested; readable by authenticated users)
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_sources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  agency text,
  jurisdiction text,
  url text,
  tax_year int,
  retrieved_at timestamptz,
  source_type text,
  text text,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_chunks (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references public.knowledge_sources(id) on delete cascade,
  chunk_text text not null,
  citation_label text,
  embedding vector(1536),
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- reports + audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tax_year int,
  report_type text,
  status text not null default 'draft',
  report_json jsonb,
  pdf_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  actor uuid,
  action text not null,
  resource text,
  resource_id uuid,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row-level security: each user sees only their own rows.
-- ---------------------------------------------------------------------------
alter table public.user_tax_profiles enable row level security;
alter table public.documents enable row level security;
alter table public.document_extractions enable row level security;
alter table public.checklist_items enable row level security;
alter table public.user_deadlines enable row level security;
alter table public.reports enable row level security;
alter table public.audit_logs enable row level security;

create policy "own profiles" on public.user_tax_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own documents" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own extractions" on public.document_extractions
  for all using (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  );

create policy "own checklist" on public.checklist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own user_deadlines" on public.user_deadlines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own reports" on public.reports
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own audit logs (read)" on public.audit_logs
  for select using (auth.uid() = user_id);

-- Global tables readable by any authenticated user.
alter table public.deadlines enable row level security;
alter table public.knowledge_sources enable row level security;
alter table public.knowledge_chunks enable row level security;

create policy "read deadlines" on public.deadlines for select using (true);
create policy "read knowledge_sources" on public.knowledge_sources for select using (true);
create policy "read knowledge_chunks" on public.knowledge_chunks for select using (true);
