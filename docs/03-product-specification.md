# Amani Tech — Analysis & Product Specification (v1.0)

Inputs analysed: `01-website-architecture.md`, `02-content-strategy.md`, Master Development Prompt.
Reference sites reviewed for pattern only (Narrtech structure, FDM/Collabera dual-audience nav, Naukri job discovery). No layouts, branding or code copied.

---

## 1. Architecture Analysis

**Consistency check — documents vs prompt**

| Area | Doc | Prompt | Result |
|---|---|---|---|
| Sitemap | §2 | §28 | Aligned. Prompt's `/jobs/[category]` and `/jobs/[job-slug]` collide at the same depth → resolved as `/jobs/category/[category]` (see §15 Q1). |
| Public nav | §3.1 | §27 | Aligned. "Insights" and "Career Advice" implemented as blog category filters, not separate CMS modules. |
| Admin nav | §3.3 | §26 | Aligned. Added Statistics and FAQ under CMS (prompt §24 requires them). |
| Job fields | — | §6 | All 19 fields carried into schema. |
| Application fields | §4.7 | §11 | Aligned. |
| Employer form | §4.9 | §17 | Aligned. |
| Vendor | §4.10 | §19 | Aligned, lightweight. |
| Testimonials | §4.15 | §20 | Aligned. |
| CMS | §8 | §24 | Aligned. |
| Candidate portal | §4.17 | §29 | Aligned, lightweight. |
| Trust content | Content §15 | §35 | All stats/logos/reviews flagged [CONFIRM]; stats section has a visibility toggle so it can ship hidden. |

No material conflicts. Open questions are in §15.

---

## 2. Final Sitemap

As defined in `01-website-architecture.md` §2. 22 public routes, 1 candidate route, 17 admin routes.

---

## 3. Page Inventory

| # | Route | Template | Data source | Auth |
|---|---|---|---|---|
| 1 | `/` | Home | CMS + jobs + testimonials + blog | — |
| 2 | `/about` | About | CMS | — |
| 3 | `/services` | Services | CMS services | — |
| 4 | `/services/[slug]` | ServiceDetail | CMS services | — |
| 5 | `/jobs` | JobSearch | jobs, categories | — |
| 6 | `/jobs/category/[c]` | JobSearch (preset) | jobs, categories | — |
| 7 | `/jobs/category/[c]/[s]` | JobSearch (preset) | jobs, categories | — |
| 8 | `/jobs/[slug]` | JobDetail | jobs | — |
| 9 | `/register` | CandidateForm | — | — |
| 10 | `/login` | Login | — | — |
| 11 | `/employers` | Employers + EmployerForm | CMS | — |
| 12 | `/vendor-registration` | VendorForm | — | — |
| 13 | `/blog` | BlogIndex | blogs | — |
| 14 | `/blog/[slug]` | BlogPost | blogs | — |
| 15 | `/careers` | Careers | CMS + career_openings | — |
| 16 | `/careers/[slug]` | CareerDetail | career_openings | — |
| 17 | `/contact` | Contact | CMS footer/contact | — |
| 18 | `/faqs` | FAQ | CMS faq | — |
| 19 | `/write-a-review` | ReviewForm | — | — |
| 20 | `/privacy` · `/terms` | Legal | CMS | — |
| 21 | `/candidate/dashboard` | CandidateDashboard | candidates, applications | CANDIDATE |
| 22 | `/admin/*` | Admin (17 screens) | all | ADMIN |

---

## 4. Functional Scope (V1)

**In scope**: job CRUD + lifecycle (draft/publish/unpublish/pause/close/feature/delete) · dynamic categories/subcategories (CRUD, activate, reorder) · public search/filter/sort · job detail · apply with resume upload · candidate registration/login · confirmation email · admin application management + CSV · candidates list + CSV · employer enquiry form + JD upload · employer lead management (status, notes, CSV) · vendor registration + moderation · testimonial submission + moderation + feature · blog CMS · careers CMS · homepage/footer/FAQ/statistics CMS · admin dashboard · contact form · SEO (metadata, sitemap, robots, JobPosting schema) · security baseline · accessibility baseline.

**Out of scope**: ATS pipeline automation · CRM · HRMS · AI matching · resume parsing · payroll · employer/vendor portals · interview scheduling · job alerts · messaging.

---

## 5. CMS Scope

Defined in `01-website-architecture.md` §8. Implementation model: one `website_sections` row per section key (`hero`, `trust_band`, `statistics`, `services`, `how_it_works`, `why_us`, `employer_cta`, `faq`, `footer`, `privacy`, `terms`) storing a validated JSON payload + `is_visible`. Ordered collections (logos, services, stats, FAQs) live inside the payload with an `order` key. Images go through `website_assets`.

Admin CMS UI is section-by-section with a live preview link, Save and "Unsaved changes" guard.

---

## 6. Candidate Flow

```
/jobs ──search/filter──▶ card ──▶ /jobs/[slug] ──Apply Now──▶ Apply modal
   Step 1 Personal (name, email, phone, location)
   Step 2 Professional (IT/Non-IT, category, subcategory, experience, current title)
   Step 3 Resume (PDF/DOC/DOCX ≤ 5 MB) + consent
 ──Submit──▶ POST /api/applications
   ├─ candidate upsert by email
   ├─ resume stored (private)
   ├─ application created (SUBMITTED)
   └─ registrationEmail sent
 ──▶ Success screen ──▶ /candidate/dashboard (after password set) or Browse jobs
```

Logged-in candidates see steps 1–2 prefilled and can reuse the stored resume.

---

## 7. Employer Flow

```
/employers ──Request Talent──▶ #request-talent form
   Contact (name, work email, phone, company, designation)
   Requirement (type, title, positions, location, work mode, experience, timeline)
   Details (JD text, requirements) + optional JD upload
 ──Submit──▶ POST /api/employer-enquiries (NEW) ──▶ employerEnquiryEmail (to admin + acknowledgement to employer)
 ──▶ Success + "What happens next" (reference id)
Admin: /admin/employers ──▶ status NEW → CONTACTED → IN_DISCUSSION → CONVERTED / CLOSED, notes, CSV
```

---

## 8. Admin Flow

| Module | Actions |
|---|---|
| Dashboard | 8 metrics, recent applications, recent employer enquiries, pending testimonials, recent jobs |
| Jobs | list (search, status filter, category filter) · create · edit · save draft · publish · unpublish · pause · close · feature · delete (soft → ARCHIVED) |
| Categories | create/edit/delete/activate/reorder category and subcategory |
| Applications | list (search, filter by job/status/category/date) · detail drawer · resume download · status change · export CSV |
| Candidates | list · detail · export CSV |
| Employers | list · detail drawer · status · notes · export CSV |
| Vendors | list · approve/reject · notes · export CSV |
| Testimonials | approve/reject/edit/delete/feature |
| Blog | list · editor · draft/preview/publish/unpublish/feature |
| Careers | list · editor · publish/close/delete |
| CMS | per-section editors |
| Settings | site settings, admin users, change password |

---

## 9. Database Model

Relational (PostgreSQL). All tables: `id` (uuid), `created_at`, `updated_at`. Soft delete via status where relevant.

```
users              id, email, password_hash, role (ADMIN|EDITOR|CANDIDATE), name, is_active, last_login_at
candidates         id, user_id?, name, email (unique), phone, location, profile_type (IT|NON_IT),
                   category_id, subcategory_id, experience_years, current_title, resume_id, source
resumes            id, candidate_id, storage_key, original_name, mime, size_bytes, uploaded_at
categories         id, name, slug, is_active, sort_order
subcategories      id, category_id, name, slug, is_active, sort_order
jobs               id, title, slug, company_name, description, category_id, subcategory_id,
                   location, experience_min, experience_max, salary_min, salary_max, salary_currency,
                   salary_period, work_mode (ONSITE|HYBRID|REMOTE), employment_type (FULL_TIME|CONTRACT|PART_TIME|INTERNSHIP),
                   skills text[], qualification, responsibilities, requirements, benefits,
                   job_source, application_deadline, is_featured, status, published_at, created_by
applications       id, job_id, candidate_id, resume_id, status, applied_at, notes
employer_enquiries id, full_name, work_email, phone, company_name, designation, requirement_type,
                   job_title, positions, location, work_mode, experience_required, joining_timeline,
                   job_description, requirements, jd_file_key, status, internal_notes jsonb[]
vendor_enquiries   id, company, contact_person, email, phone, location, services text[], specialization,
                   years_experience, website, additional_info, document_key, status, internal_notes
testimonials       id, name, designation, company, photo_key, rating (1–5), review, status, is_featured, approved_at
blog_categories    id, name, slug
blogs              id, title, slug, content (rich), excerpt, featured_image_key, author_id, category_id,
                   tags text[], seo_title, seo_description, status, is_featured, published_at
career_openings    id, position, slug, department, location, work_mode, experience, description,
                   responsibilities, requirements, benefits, application_instructions, status, published_at
website_sections   id, key (unique), payload jsonb, is_visible, updated_by
website_assets     id, storage_key, alt, mime, width, height
site_settings      id, key (unique), value
contact_messages   id, name, email, phone, audience, message, status
activity_logs      id, user_id, action, entity, entity_id, meta jsonb, created_at
```

Indexes: `jobs(status, published_at)`, `jobs(category_id, subcategory_id)`, `jobs(slug)`, full-text on `jobs(title, company_name, skills, location)`, `applications(job_id)`, `applications(candidate_id)`, `candidates(email)`.

---

## 10. API Requirements

Public
```
GET  /api/jobs?q&location&category&subcategory&experience&salaryMin&workMode&type&posted&sort&page
GET  /api/jobs/[slug]
GET  /api/categories                      (active, with subcategories and counts)
POST /api/applications                    (multipart: fields + resume)   rate-limited
POST /api/candidates/register             (multipart)                     rate-limited
POST /api/auth/login · POST /api/auth/logout · POST /api/auth/forgot
POST /api/employer-enquiries              (multipart, optional JD)        rate-limited
POST /api/vendor-enquiries                (multipart)                     rate-limited
POST /api/testimonials                    (multipart, optional photo)     rate-limited
POST /api/contact                                                         rate-limited
GET  /api/blog?category&page · GET /api/blog/[slug]
GET  /api/careers · GET /api/careers/[slug]
GET  /api/cms/[section]                   (public payloads only)
```

Candidate (auth)
```
GET  /api/candidate/me · PATCH /api/candidate/me · PUT /api/candidate/resume
GET  /api/candidate/applications
```

Admin (auth, role ADMIN)
```
CRUD /api/admin/jobs  + POST /api/admin/jobs/[id]/{publish|unpublish|pause|close|feature}
CRUD /api/admin/categories · /api/admin/subcategories  + PATCH reorder
GET  /api/admin/applications (+ filters) · PATCH status · GET /api/admin/applications/export.csv
GET  /api/admin/candidates · GET export.csv
GET  /api/admin/employer-enquiries · PATCH status/notes · GET export.csv
GET  /api/admin/vendor-enquiries · PATCH status/notes · GET export.csv
GET  /api/admin/testimonials · PATCH approve/reject/feature · PUT edit · DELETE
CRUD /api/admin/blog · /api/admin/careers
GET/PUT /api/admin/cms/[section]
GET/PUT /api/admin/settings
GET  /api/admin/dashboard
GET  /api/admin/files/[key]               (signed, resumes/JDs)
```

Cross-cutting: Zod validation, JSON error shape `{ error: { code, message, fields? } }`, rate limiting on all public POSTs, CSRF token for cookie-auth mutations, file validation (extension + MIME sniff + size), signed URLs for private files.

---

## 11. Design Direction & Design System

**Feeling**: premium staffing brand + modern SaaS + job marketplace. Calm, confident, human.

### Colour
| Token | Value | Use |
|---|---|---|
| `--navy-900` | `#0B2545` | Headings, nav, dark sections |
| `--navy-700` | `#13315C` | Secondary buttons, hover |
| `--navy-100` | `#E8EEF7` | Tints |
| `--green-600` | `#0E9F6E` | Primary CTA (candidate actions) |
| `--green-700` | `#0C8A5F` | CTA hover |
| `--green-50`  | `#E6F6EF` | Success tints, badges |
| `--amber-500` | `#F59E0B` | Featured, ratings |
| `--red-600`   | `#DC2626` | Errors |
| `--bg`        | `#F7F8FA` | Page background |
| `--surface`   | `#FFFFFF` | Cards |
| `--text`      | `#151B26` | Body |
| `--muted`     | `#5C6675` | Secondary text |
| `--border`    | `#E3E7ED` | Borders |

Contrast: all text pairs ≥ 4.5:1 (green-600 on white used only for ≥ 18 px or bold; white on green-600 for buttons = 4.6:1).

### Typography
- Headings: **Manrope** 700/800 · Body: **Inter** 400/500/600
- Scale: 12 · 13 · 14 · 16 · 18 · 20 · 24 · 30 · 38 · 48 · 60 (fluid via `clamp`)
- Line height: headings 1.15, body 1.6

### Spacing, radius, shadow
- 4 px base; section padding 64/96 px (mobile/desktop)
- Radius: 8 (inputs, buttons), 12 (cards), 16 (panels), 999 (pills)
- Shadows: `sm 0 1px 2px rgba(11,37,69,.06)` · `md 0 4px 16px rgba(11,37,69,.08)` · `lg 0 12px 32px rgba(11,37,69,.12)`

### Components
Buttons (primary green / secondary navy / outline / ghost; sm/md/lg) · Inputs (44 px min height, focus ring navy) · Badges (status colours) · Job card · Filter rail · Chips · Tabs · Accordion (`<details>`) · Modal · Drawer · Toast · Pagination · Skeleton · Empty state.

### Breakpoints
480 · 768 · 1024 · 1280 · 1440. Mobile-first.

### Motion
Fade-up reveal on scroll (IntersectionObserver), hero staged entrance, card hover lift (2 px + shadow), counters, testimonial carousel, logo marquee. All disabled under `prefers-reduced-motion`.

### Imagery
No stock photography in V1. Hero uses a product-composed visual (job card + application confirmation + recruiter note). About/Careers sections reserve slots for real team photography [CONFIRM]. Icons: inline SVG, 1.5 px stroke, consistent set.

### Admin
Separate palette: slate sidebar `#0F172A`, light workspace, Inter only, denser spacing, tables, badges, drawers, toasts.

---

## 12. Content Hierarchy

Per `02-content-strategy.md` §17: Eyebrow → H1 → Sub → Primary CTA → Supporting → Trust → Final CTA. Home has 13 sections; each maps to one of the five questions.

---

## 13. SEO Architecture

- Per-page `<title>`, meta description, canonical, Open Graph, Twitter card (from content doc §16)
- `JobPosting` JSON-LD on job pages (title, description, datePosted, validThrough, employmentType, hiringOrganization, jobLocation, baseSalary when present)
- `Organization` + `WebSite` (SearchAction) on home; `BreadcrumbList` on detail pages; `Article` on blog posts; `FAQPage` on /faqs
- `sitemap.xml` generated from published jobs, categories, blog, careers, static pages; `robots.txt` disallows `/admin`, `/candidate`, `/api`
- Category and subcategory pages indexable; filtered `/jobs?…` URLs `noindex,follow`; closed jobs return 410 after 30 days
- Clean slugs: `senior-java-developer-hyderabad-{shortid}`

---

## 14. Environment Variables (`.env.example`)

```env
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/amani_tech

# Auth
JWT_SECRET=
SESSION_COOKIE_NAME=amani_session

# Email (SMTP)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM="Amani Tech <no-reply@amanitech.in>"
ADMIN_NOTIFICATION_EMAIL=

# File storage (S3-compatible: AWS S3 / Cloudflare R2 / MinIO)
STORAGE_PROVIDER=s3
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
MAX_UPLOAD_MB=5

# Rate limiting
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_MAX_REQUESTS=5
```

Cloudinary is not used (S3-compatible storage keeps resumes private with signed URLs; Cloudinary is image-oriented). Swap in if Amani Tech already has an account.

---

## 15. Ambiguities & Questions

| # | Question | Assumption used in the prototype |
|---|---|---|
| Q1 | `/jobs/[category]` vs `/jobs/[job-slug]` collide. Use `/jobs/category/[c]`? | Yes — `/jobs/category/[c]/[s]` |
| Q2 | Company location, phone, email, hours? | Hyderabad placeholders [CONFIRM] |
| Q3 | Can we state "no fees for job seekers" and a "one business day" employer response? | Shown, flagged [CONFIRM] |
| Q4 | Statistics: which figures are verified? | Illustrative numbers; section can be hidden via CMS |
| Q5 | Client logos available? | None shown; industry chips instead |
| Q6 | Should candidates set a password at application time, or only on `/register`? | Optional password step after application success |
| Q7 | Is salary shown publicly on every job, or can admin hide it ("Not disclosed")? | Optional; card shows "Not disclosed" when empty |
| Q8 | Career openings: apply via email instructions or an in-site form? | Instructions text (per prompt field list) |
| Q9 | "Insights" and "Career Advice" as blog categories — acceptable? | Yes |
| Q10 | Preferred production stack? | Recommendation deferred to post-prototype (§55); leaning Next.js + PostgreSQL + Prisma + S3 + Nodemailer |

---

## 16. Prototype Scope (Phase 3)

Static HTML/CSS/vanilla JS in `/prototype`. Sample data in `assets/js/data.js` simulates the database (categories, jobs, blogs, careers, testimonials, FAQs). Search, filters, sort, pagination, apply modal, form validation, upload validation, toasts, drawers, CSV export and CMS editors work client-side to validate UX. No backend.

---

## 17. Brand Update — client input (18 Sep 2026)

Supersedes the colour and logo rows of §11.

| Element | Decision |
|---|---|
| Name & tagline | **amani tech** (lowercase wordmark) · **TECHNOLOGY \| TALENT \| TRAINING** — shown under the wordmark in the header (≥1440 px) and footer, in page titles and email headers |
| Symbol | Abstract bird in forward/upward flight (two swept wing shapes), electric blue, `LogoMark` in `web/components/Icon.tsx`; favicon `web/app/icon.svg` |
| Primary — Deep Indigo | `--navy-900 #141A4A` · 800 `#1B2260` · 700 `#242D78` · 600 `#2F3A9A` · 100 `#E6E8F5` · 50 `#F3F4FA` — headings, nav, dark sections, wordmark |
| Accent — Electric Blue | `--accent-600 #2563EB` · 700 `#1D4ED8` · 100 `#DBEAFE` · 50 `#EFF4FF` — CTAs, links, icons, bird, focus ring |
| Background | White surfaces on `#F7F8FA` page; two-colour identity, no other brand hues |
| Semantic only | `--success-*` (green) kept strictly for approved/published/success states; amber for featured/ratings; red for errors |
| Type weight | Manrope 800 for wordmark and headings (unchanged — already heavy) |
| Contrast | `#2563EB` on white 5.2:1; white on `#2563EB` 5.2:1; `#141A4A` on white 14.6:1 |

Tagline note: "Training" is now a stated pillar, so a **Training & Upskilling** service was added (seed + CMS-editable) so the site delivers on the promise.
