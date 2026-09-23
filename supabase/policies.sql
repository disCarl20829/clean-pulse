-- Row Level Security policies for CleanPulse
-- Run after schema.sql

alter table profiles enable row level security;
alter table reports enable row level security;
alter table report_flags enable row level security;

-- PROFILES: users can read their own profile; admins/officials can read all
create policy "read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "officials read all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('barangay_official', 'garbage_collector', 'lgu_admin')
    )
  );

create policy "users update own profile"
  on profiles for update
  using (auth.uid() = id);

-- REPORTS: any authenticated user can create a report
create policy "authenticated users create reports"
  on reports for insert
  with check (auth.uid() = reporter_id);

-- Residents see only their own reports; staff roles see everything
create policy "residents view own reports"
  on reports for select
  using (
    reporter_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('barangay_official', 'garbage_collector', 'lgu_admin')
    )
  );

-- Only staff roles can update status
create policy "staff update report status"
  on reports for update
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('barangay_official', 'garbage_collector', 'lgu_admin')
    )
  );

-- Note: this app's backend uses the Supabase service_role key for most
-- writes (bypassing RLS) after its own auth.middleware checks the JWT and role.
-- These policies are the safety net in case the frontend ever talks to
-- Supabase directly with the anon key.
