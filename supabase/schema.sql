-- CleanPulse database schema
-- Run in Supabase SQL editor

create extension if not exists "uuid-ossp";

-- Roles: resident, barangay_official, garbage_collector, lgu_admin
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('resident', 'barangay_official', 'garbage_collector', 'lgu_admin')),
  barangay text,
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references profiles(id) on delete set null,

  lat double precision not null,
  lng double precision not null,
  formatted_address text,
  barangay text,
  city text,
  province text,

  garbage_type text not null check (
    garbage_type in ('biodegradable', 'non_biodegradable', 'recyclable', 'residual', 'hazardous')
  ),
  intensity text not null check (
    intensity in ('low', 'moderate', 'high', 'severe', 'dangerous')
  ),
  description text,
  photo_url text,

  status text not null default 'unresolved' check (
    status in ('unresolved', 'resolved', 'archived')
  ),
  status_updated_by uuid references profiles(id),
  status_updated_at timestamptz,

  agreed_no_false_report boolean not null default false,
  agreed_ph_law boolean not null default false,

  created_at timestamptz default now()
);

create index if not exists idx_reports_status on reports(status);
create index if not exists idx_reports_barangay on reports(barangay);
create index if not exists idx_reports_created_at on reports(created_at desc);

-- Optional: flag log for false reports
create table if not exists report_flags (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid references reports(id) on delete cascade,
  flagged_by uuid references profiles(id),
  reason text,
  created_at timestamptz default now()
);
