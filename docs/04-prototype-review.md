# Amani Tech — HTML Prototype: Review Notes (Phase 3)

## What was built

Static HTML / CSS / vanilla JS in `/prototype`. No build step, no dependencies. Open `prototype/index.html` in a browser.

| Area | Pages |
|---|---|
| Public (20) | index, about, services, service-detail, jobs, job-detail, register, login, employers, vendor-registration, blog, blog-post, careers, career-detail, contact, faqs, write-a-review, privacy, terms, candidate-dashboard |
| Admin (16) | login, dashboard, jobs, job-form, categories, applications, candidates, employers, vendors, testimonials, blog, blog-editor, careers, career-editor, cms, settings |

`assets/js/data.js` simulates the database (6 categories / 26 subcategories, 17 jobs, 6 posts, 4 openings, 6 testimonials, 12 FAQs, 8 applications, 5 employer leads, 3 vendor leads). Everything data-driven on the site renders from it — categories are not hardcoded in any page.

## What actually works (client-side)

- Job search: keyword + location, 8 filter groups (category → subcategory, location, experience bands, minimum salary, work mode, employment type, date posted), 3 sort orders, pagination, applied-filter chips, URL state (shareable links), skeleton loading, empty state.
- Job detail: rendered from slug, similar roles, sticky mobile Apply bar, `JobPosting` JSON-LD injected.
- Apply: 3-step modal (Personal → Professional → Resume), per-step validation, category/subcategory cascade, drag-and-drop upload with type/size validation and progress, consent, loading, success with email echo. Add `?fail=1` to any form page to see the server-error state.
- Registration, employer requirement, vendor, contact, review, login: same validation/loading/success/error pattern.
- Admin: sidebar + topbar, dashboard metrics, jobs table with publish/unpublish/pause/close/feature/delete (confirm dialogs), job form with skills tag input and draft/publish, category manager (add/rename/reorder/activate/delete with guards), applications table with filters + detail drawer + status change, candidates, employer and vendor lead drawers with status + notes + approve/reject, testimonial moderation, blog and careers lists + editors, CMS section editors with live hero preview and unsaved-changes indicator, settings. **CSV export downloads a real file** from the current filtered set.
- Toasts, modals, drawers, confirm dialogs, empty states, loading states, mobile nav, filter drawer, `prefers-reduced-motion` respected.

## Verification performed

- All 36 pages rendered headlessly (Edge, DevTools protocol) at 320 / 390 / 768 / 1024 / 1440 px: **0 horizontal overflow, 0 JavaScript errors** on every page.
- Link audit: 0 broken internal links, 0 duplicate IDs, every page has a title.
- Full apply flow executed programmatically to the success state.

## Self-critique and fixes applied during iteration

| Found | Fix |
|---|---|
| Nav wrapped "Find Jobs" at 1440; header overflowed at 1024–1280 | Desktop nav now ≥1200 px with tightened spacing 1200–1439; hamburger below |
| Jobs / job detail / legal / auth pages lost side gutters on mobile | Gutter restored via `var(--gutter)` |
| "Remote · Remote" on cards | Work mode suppressed when equal to location |
| Hero "17 open roles" was hardcoded | Now computed from published jobs |
| Grid items overflowing on narrow screens (tables, stat tiles) | `min-width:0` on grid children |
| Hero visual cards collided at 1024–1279 | Scaled card widths, hid the stat card in that range |
| Status badges and dates wrapping in admin tables | `nowrap` |

## Conversion review (§54)

**Candidate** — Land → understand "Find Jobs" (hero search + nav + featured jobs) → search → filter → scan (cards show title, company, location, mode, experience, salary, type, skills, posted, featured) → open → understand (description, responsibilities, requirements, qualification, benefits, overview) → apply (2-minute modal) → confirmation (success + email). ✔

**Employer** — Header "Request Talent" (outlined, distinct from green candidate CTA) → /employers hero states the offer → services, process, why-us → form with contact / requirement / details / JD upload → success states reference number and next steps. ✔

**Trust** — Verified employers, no-fee line, human recruiters, moderated testimonials with name/designation/company, visible address/phone/hours in footer and contact page, privacy/terms, explicit status meanings on the dashboard, no fabricated logos. Statistics are illustrative and can be hidden from the CMS. ✔

## Known limitations (by design, prototype)

- No persistence: admin changes live in memory until refresh.
- "Download resume" and file uploads are simulated (validation is real; transfer is not).
- Blog article body is a single template; only metadata is per-post.
- Photo slots on About / Careers await real photography.
- Login accepts any input (redirects to dashboard) — authentication is Phase 4.

## Awaiting Amani Tech

All items marked **[CONFIRM]** in `02-content-strategy.md` §2, §3.3, §15 — address, phone, email, fee policy wording, response-time promise, statistics, client logos, testimonials, benefits list.

## Recommended next step

On approval of this prototype, convert to **Next.js (App Router) + TypeScript + PostgreSQL + Prisma + S3-compatible storage + Nodemailer**, per `03-product-specification.md` §10–14. Rationale: server-rendered job and category pages for SEO, one codebase for public + admin + API, first-class file upload and auth patterns, and the CMS payloads map directly to the `website_sections` model already specified.
