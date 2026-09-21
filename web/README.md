# Amani Tech — Production Web App

Next.js 15 (App Router, TypeScript, Server Actions) + Supabase (Postgres, Auth, Storage) + framer-motion. The production site, data-driven, with real auth, uploads, email and an admin panel.

## 1. Create the Supabase project

1. [supabase.com](https://supabase.com) → New project. Note the **Project URL**, **anon key** and **service_role key** (Project Settings → API).
2. SQL Editor → run `supabase/migrations/0001_init.sql` (tables, RLS, storage buckets, `admin_metrics()`), then `0002_candidate_profile.sql` (profile photo, skills, education, work history), then `0003_job_logo.sql` (company logo on jobs). Run any later numbered files in order.
3. SQL Editor → run `supabase/seed.sql` (categories, 17 jobs, services, FAQs, posts, openings, homepage content, sample leads). Skip it for an empty production database.
4. Authentication → URL Configuration → add `http://localhost:3000/auth/callback` (and your production domain) to **Redirect URLs**. For development you may disable "Confirm email" under Authentication → Providers → Email.

## 2. Configure and run

```bash
cp .env.example .env.local     # fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev                    # http://localhost:3000
```

Email is optional: leave `EMAIL_HOST` blank and confirmations are logged instead of sent. Fill the SMTP block to send real mail (Gmail app password, SES, Resend SMTP, etc.).

## 3. Make yourself admin

Sign up once at `/register` (or create a user in Authentication → Users), then in the SQL Editor:

```sql
update profiles set role = 'ADMIN' where email = 'you@amanitech.in';
```

Sign in at `/admin/login`.

## What is where

```
app/(site)/…          public pages (server components) — home, jobs, job detail, employers, blog, careers, forms, dashboard
app/admin/(panel)/…   admin panel — dashboard, jobs, categories, applications, candidates, employers, vendors, testimonials, blog, careers, CMS, settings
app/api/admin/export  CSV exports (admin only)
lib/queries.ts        all public reads (RLS-scoped)
lib/actions/public.ts server actions for public forms (zod validation, rate limit, file validation, email)
lib/actions/admin.ts  server actions for admin mutations (role-checked)
lib/email.ts          transactional emails (nodemailer)
lib/files.ts          upload validation (ext + MIME + size), private buckets, signed URLs, CSV
components/…          UI (design system classes from app/globals.css, motion wrappers, forms)
supabase/             migrations + seed
middleware.ts         session refresh + /admin and /candidate gating
```

## Security model

- Public reads go through RLS (`published`/`approved`/`active` only). Admin reads/writes require `profiles.role IN ('ADMIN','EDITOR')` via `is_admin()`.
- Public form submissions run on the server with the service role after zod validation and per-IP rate limiting; the browser never holds the service key.
- Resumes and JDs live in **private** buckets; admins fetch them through 5-minute signed URLs.
- Security headers are set in `next.config.ts`.

## Deploy

Vercel: import the `web` folder, add the env vars, deploy. Set `NEXT_PUBLIC_APP_URL` to the live domain and add `https://<domain>/auth/callback` to Supabase redirect URLs.

`vercel.json` pins functions to Mumbai (`bom1`), next to the Supabase project — leave it unless the database moves. Public content is served from the Next data cache (5 min, purged on every admin save), so pages do not hit Supabase per request; signed-in sessions are verified locally against the project signing keys.

## Before launch

- Replace Unsplash placeholder photos (hero, about, careers, services, blog covers) with licensed or in-house photography — hero image and service images are editable in **Admin → Website CMS**.
- Verify every fact marked **[CONFIRM]** in `../docs/02-content-strategy.md` (address, phone, statistics, fee policy, response SLA) and edit in **Admin → Website CMS** / **Settings**.
- Delete seed testimonials and leads (`delete from testimonials; delete from employer_enquiries; delete from vendor_enquiries;`) before going live.
