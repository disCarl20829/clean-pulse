# CleanPulse

Systemized solid waste monitoring system for delayed collection — Innovathon 2026.

## Stack
- Frontend: React (Vite) + Mapbox GL JS (map + heatmap visualization)
- Backend: Node.js + Express + Mapbox Geocoding API v6 (reverse geocoding)
- Database/Auth/Storage: Supabase (Postgres, Auth, Storage)

## Setup

### 1. Supabase
1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` then `supabase/policies.sql`.
3. Create a Storage bucket named `report-photos` (public read).
4. In Authentication > Settings, consider turning **off** "Confirm email" for
   local dev/demo — it lets the Create Account flow finish in one step. If
   left on, users confirm via email link, and their `profiles` row is
   created automatically the next time they log in with a valid session.
   Accounts can also be created manually: add a row to `auth.users`, then a
   matching row to `profiles` with a `role` of `resident`,
   `barangay_official`, `garbage_collector`, or `lgu_admin`.

### 2. Mapbox
1. Create a free account at mapbox.com (no credit card needed).
2. Go to your Account page and copy your **default public token**
   (starts with `pk.`) — use it for both `VITE_MAPBOX_TOKEN` (frontend)
   and `MAPBOX_ACCESS_TOKEN` (backend). Free tier covers 50,000 map
   loads/month and 100,000 geocoding requests/month.

### 3. Backend
```bash
cd backend
cp .env.example .env   # fill in Supabase + Mapbox token
npm install
npm run dev             # http://localhost:4000
```

### 4. Frontend
```bash
cd frontend
cp .env.example .env    # fill in Supabase + Mapbox token + API base URL
npm install
npm run dev              # http://localhost:5173
```

## Pages
- **Report** — pinpoint/tap location, reverse-geocoded address, garbage type
  (Philippine RA 9003 categories), intensity (low → dangerous), description,
  photo, and two required agreements (false-report policy, RA 9003 notice).
- **Overview** — heatmap of garbage hotspots by intensity.
- **Logs** — full report table, filterable/sortable by status, type, location.
- **Recently Collected** — resolved-report feed with Recent/Location/Intensity
  filters; map only shown for `garbage_collector` accounts.

## Roles
`resident` (report only) · `barangay_official` · `garbage_collector` ·
`lgu_admin` — the latter three can view Overview/Logs and update report status.
