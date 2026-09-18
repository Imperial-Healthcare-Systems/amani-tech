# Amani Tech — Website & Recruitment Platform

Premium staffing-company website + job discovery marketplace + candidate application system + employer enquiry system + admin CMS.

## Project phases

| Phase | Status | Where |
|---|---|---|
| 1. Discovery documents | Done | `docs/01-website-architecture.md`, `docs/02-content-strategy.md` |
| 2. Product specification | Done | `docs/03-product-specification.md` |
| 3. HTML prototype (UX / visual / content validation) | Done, superseded by `web/` (folder removed) | notes in `docs/04-prototype-review.md` |
| 4. Production build — Next.js 15 + Supabase | **Done — ready to configure** | `web/` · setup in `web/README.md` |

## Quick start (production app)

```
cd web
cp .env.example .env.local        # add Supabase URL + keys
npm install && npm run dev        # http://localhost:3000
```

Run `web/supabase/migrations/0001_init.sql` then `web/supabase/seed.sql` in the Supabase SQL editor first. Full steps, admin promotion and deploy notes: [web/README.md](web/README.md).

## Structure

```
docs/           Architecture, content strategy, specification, prototype review
web/            Next.js app (App Router, TypeScript) + Supabase schema/seed
```

## Content status

Sample jobs, testimonials, statistics, leads and contact details are illustrative seed data. Items marked **[CONFIRM]** in `docs/02-content-strategy.md` must be verified by Amani Tech and edited via the admin CMS before launch. Photography is Unsplash placeholder imagery to be replaced.
