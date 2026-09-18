# Amani Tech — Website Architecture Document (v1.0)

Status: Draft for review · Owner: Product/Architecture · Source-of-truth priority: 1

---

## 1. Purpose

Amani Tech is a staffing and recruitment company. The website is a **corporate site + job discovery marketplace + candidate application system + employer enquiry system + admin CMS**. It is not an ATS, CRM or HRMS.

Three audiences, three journeys:

| Audience | Goal | Primary conversion |
|---|---|---|
| Candidate | Find and apply for a job | Job application / registration |
| Employer | Get staffing support | Staffing requirement enquiry |
| Admin (Amani Tech staff) | Manage jobs, leads, content | — |

Secondary audience: staffing partners / vendors (lightweight registration only).

---

## 2. Complete Sitemap

### 2.1 Public

```
/                                  Home
/about                             About Amani Tech
/services                          Staffing services (overview)
/services/[service-slug]           Service detail (6 services)
/jobs                              Job search (marketplace)
/jobs/category/[category]          Category listing (indexable)
/jobs/category/[category]/[sub]    Subcategory listing (indexable)
/jobs/[job-slug]                   Job detail
/register                          Candidate registration
/login                             Candidate login
/employers                         Employers landing + requirement form
/vendor-registration               Become a staffing partner
/blog                              Blog index (filters: Insights, Career Advice, Company News)
/blog/[slug]                       Article
/careers                           Work at Amani Tech
/careers/[slug]                    Career opening detail
/contact                           Contact
/faqs                              FAQs
/write-a-review                    Submit a testimonial
/privacy                           Privacy policy
/terms                             Terms of use
```

### 2.2 Candidate portal (authenticated)

```
/candidate/dashboard               Profile · Applications · Resume
```

### 2.3 Admin (authenticated, role = ADMIN)

```
/admin/login
/admin                             Dashboard
/admin/jobs                        All jobs
/admin/jobs/new                    Create job
/admin/jobs/[id]/edit              Edit job
/admin/categories                  Categories & subcategories
/admin/applications                Applications
/admin/candidates                  Candidates
/admin/employers                   Employer enquiries (leads)
/admin/vendors                     Vendor enquiries
/admin/testimonials                Testimonial moderation
/admin/blog                        Blog posts
/admin/blog/new · /admin/blog/[id]/edit
/admin/careers                     Career openings
/admin/careers/new · /admin/careers/[id]/edit
/admin/cms                         Website CMS (Hero, Trust Band, Services, Statistics, FAQ, Footer)
/admin/settings                    Site settings, admin users
```

### 2.4 System

```
/sitemap.xml   /robots.txt   /api/*
```

---

## 3. Navigation Structure

### 3.1 Public header

```
[Logo]  Home · About · Services · Find Jobs · Employers · Resources ▾ · Careers · Contact     [Candidate Login] [Register] [Request Talent]
```

- **Resources** dropdown → Blog · Insights (`/blog?category=insights`) · Career Advice (`/blog?category=career-advice`) · FAQs
- **Request Talent** is the employer CTA, visually distinct (outlined navy) from the candidate CTA (filled green).
- Header is sticky and compacts on scroll.
- Mobile: hamburger → full-height drawer; CTAs pinned at the bottom.

### 3.2 Public footer

Four columns + bottom bar:

1. Brand: logo, one-line description, contact (address, phone, email), social links
2. For Job Seekers: Find Jobs · Browse Categories · Register · Login · Career Advice · FAQs
3. For Employers: Request Talent · Services · Become a Partner · Contact
4. Company: About · Careers · Blog · Contact · Write a Review

Bottom bar: © year · Privacy · Terms.

### 3.3 Admin sidebar

```
Dashboard
Jobs
  ├── All Jobs
  ├── Create Job
  └── Categories
Applications
Candidates
Employers
Vendors
Testimonials
Blog
Careers
Website CMS
  ├── Hero
  ├── Trust Band
  ├── Services
  ├── Statistics
  ├── FAQ
  └── Footer
Settings
```

Admin header: page title, global search, notification count (pending testimonials + new leads), admin menu.

---

## 4. Page & Section Hierarchy

### 4.1 Home `/`

1. Hero — heading, subheading, job search (keyword + location), popular searches, trust micro-line, brand visual
2. Trust Band — "Trusted by employers across industries" (logos when supplied; industry chips until then)
3. Statistics — 4 CMS-managed counters (section visibility toggle)
4. Browse by Category — dynamic category tiles with live job counts
5. Services — 6 staffing services (CMS ordered)
6. How It Works — tabbed: For job seekers / For employers (4 steps each)
7. Featured Jobs — auto from published + featured jobs (max 6)
8. Why Amani Tech — 4 differentiators
9. Testimonials — approved + featured, carousel
10. Employer CTA band — "Looking for the right talent?"
11. Latest from the Blog — 3 posts
12. FAQ — top 6 (CMS)
13. Final CTA — Register / Request Talent
14. Footer

### 4.2 About `/about`

Hero (who we are) → Our story → What we do (candidates / employers) → Values (4) → How we work → CTA band.

### 4.3 Services `/services`

Hero → 6 service cards (link to detail) → Engagement models (Contract / Permanent / Project) → Industries served → Process (4 steps) → Employer CTA.

### 4.4 Service detail `/services/[slug]`

Hero → Overview → What is included → Who it is for → Process → Related services → Request Talent CTA.

### 4.5 Jobs `/jobs`

- Search bar (keyword, location, Search)
- Desktop: left filter rail (sticky) · right results
- Results header: count, applied-filter chips, sort (Relevance / Newest / Salary high→low)
- Job cards (list) · pagination
- Mobile: search → Filter button (drawer) + Sort → cards
- States: loading skeleton, empty ("No jobs match…"), error

Filters: Category → Subcategory (nested), Location, Experience (bands), Salary (minimum), Work Mode, Employment Type, Date Posted.

### 4.6 Category / subcategory listing

Same layout as `/jobs`, filter pre-applied, indexable H1 ("Software Development jobs"), optional CMS intro text.

### 4.7 Job detail `/jobs/[slug]`

- Header card: title, company, location, meta chips (experience, salary, work mode, type), posted date, deadline, **Apply Now**
- Body: Description · Responsibilities · Requirements · Qualification · Benefits · Skills
- Sidebar: Job overview (category, subcategory, source, deadline), Apply card, Similar jobs
- Mobile: sticky bottom Apply bar
- Apply → modal (Personal · Professional · Resume) → success state → confirmation email
- Structured data: `JobPosting`

### 4.8 Register `/register` · Login `/login`

Register: same form as application, without a job link. Login: email + password, forgot password.

### 4.9 Employers `/employers`

Hero "Looking for the Right Talent?" + Request Talent → What we offer → How it works (4 steps) → Why employers choose us → Requirement form (anchor `#request-talent`) → What happens next → Employer FAQ → Partner CTA.

### 4.10 Vendor registration `/vendor-registration`

Hero "Become a Staffing Partner" → Who we partner with → Form → What happens next.

### 4.11 Blog `/blog` · `/blog/[slug]`

Index: featured post, category filter (All / Insights / Career Advice / Company News), grid, pagination. Article: hero image, meta, body, tags, author, related posts, CTA.

### 4.12 Careers `/careers` · `/careers/[slug]`

Hero → Why Amani Tech → Culture → Growth → Benefits → Life at Amani Tech → Current openings (CMS) → Opening detail: description, responsibilities, requirements, benefits, application instructions.

### 4.13 Contact `/contact`

Contact details, office hours, general enquiry form, quick paths (Job seekers → Register; Employers → Request Talent).

### 4.14 FAQs `/faqs`

Grouped: Job seekers · Employers · Partners · General.

### 4.15 Write a Review `/write-a-review`

Form: name, designation, company, photo (optional), rating, review → "pending moderation" notice.

### 4.16 Privacy · Terms

Static long-form, CMS-editable.

### 4.17 Candidate dashboard `/candidate/dashboard`

Profile summary · My applications (job, date, status) · Resume (view/replace) · Edit basic details.

---

## 5. User Journeys

### 5.1 Candidate journey

```
Land (Home / Category / Job via search engine)
 → Search or browse
 → Filter / sort results
 → Open job detail
 → Apply Now
 → Fill Personal · Professional · Resume (or log in to prefill)
 → Submit → success screen + confirmation email
 → (optional) set password → candidate dashboard
 → Amani Tech recruiter reviews → contacts candidate (offline)
```

Alternate entry: Register (no job) → confirmation email → dashboard.

### 5.2 Employer journey

```
Land (Home / Employers / Services)
 → Understand offering
 → Request Talent (header CTA, hero CTA, band CTA)
 → Requirement form (contact · requirement · details · optional JD upload)
 → Submit → success + "what happens next"
 → Admin receives lead (status NEW) → contacts employer within stated SLA
```

### 5.3 Vendor journey

```
Footer / Employers page → Become a Partner → form → success → Admin approves / rejects
```

### 5.4 Reviewer journey

```
Footer → Write a Review → form → PENDING → Admin approves → live (featured → homepage)
```

### 5.5 Admin journey

```
Login → Dashboard (metrics + recent activity)
 → Jobs: create draft → publish → feature / pause / close
 → Categories: create / edit / reorder / deactivate
 → Applications: search, filter, view drawer (resume download), change status, export CSV
 → Candidates: search, view, export CSV
 → Employers: view lead, change status, add notes, export
 → Vendors: approve / reject / notes / export
 → Testimonials: approve / reject / edit / feature / delete
 → Blog / Careers: create → preview → publish / unpublish / close
 → CMS: edit homepage sections → save → live
```

---

## 6. Information Architecture

```
Amani Tech
├── Corporate   (About, Services, Contact, Careers, Blog)
├── Marketplace (Jobs, Categories, Job detail, Apply)
├── Candidate   (Register, Login, Dashboard)
├── Employer    (Employers page, Requirement form)
├── Partner     (Vendor registration)
├── Trust       (Testimonials, Reviews, FAQs, Privacy, Terms)
└── Admin       (Dashboard, Jobs, Categories, Applications, Candidates,
                 Employers, Vendors, Testimonials, Blog, Careers, CMS, Settings)
```

### Page-to-page relationships

- Home → Jobs (search) · Categories → Jobs (pre-filtered) · Featured jobs → Job detail
- Job detail → Apply (modal) → Success → Dashboard
- Job detail → Similar jobs → Job detail
- Services → Service detail → Employers#request-talent
- Employers → Requirement form (inline) · Vendor registration
- Blog → Article → Related → Jobs / Employers CTA
- Careers → Opening → Application instructions
- Footer → Write a Review · FAQs · Privacy · Terms

---

## 7. Functional Areas

| Area | Data type | Owner |
|---|---|---|
| Jobs & categories | Job data | Admin |
| Applications & candidates | Application data | Users |
| Employer enquiries | Application data | Users |
| Vendor enquiries | Application data | Users |
| Testimonials | Application data → moderated | Users / Admin |
| Blog, Careers, Homepage, Footer, FAQ, Statistics, Privacy, Terms | CMS content | Admin |
| Email (registration, application, employer, vendor, review) | System | System |
| Auth (candidate, admin) | System | System |

---

## 8. CMS Areas

| Section | Fields |
|---|---|
| Hero | heading, subheading, image, background style, primary CTA text/url, secondary CTA text/url |
| Trust Band | heading, logos[] (image, alt, order), visibility |
| Statistics | items[] (number, suffix, label, order, visibility), section visibility |
| Services | items[] (title, short description, long description, image, icon, CTA text/url, order, visibility) |
| How It Works | candidate steps[], employer steps[] |
| Why Amani Tech | items[] (title, description, icon) |
| Featured Jobs | automatic (published + featured) |
| Testimonials | automatic (approved + featured) |
| Employer CTA band | heading, text, CTA |
| FAQ | items[] (question, answer, group, order) |
| Footer | address, phone, email, hours, social links[], nav links[] |
| Legal | privacy body, terms body |
| Site settings | site name, default SEO, email from-name, contact recipients, SLA text |

---

## 9. Portal Structure

- **Candidate portal**: lightweight — profile, applications with status, resume. No messaging or job alerts in V1.
- **Admin portal**: full sidebar application. Roles: ADMIN (all) and EDITOR (CMS, blog, careers, testimonials only) — the schema supports EDITOR; UI ships ADMIN only in V1.
- **No employer portal** and **no vendor portal** in V1.

---

## 10. Status Model

| Entity | Statuses |
|---|---|
| Job | DRAFT, PUBLISHED, PAUSED, CLOSED, ARCHIVED |
| Application | SUBMITTED, REVIEWING, SHORTLISTED, REJECTED, CLOSED |
| Employer enquiry | NEW, CONTACTED, IN_DISCUSSION, CONVERTED, CLOSED |
| Vendor enquiry | PENDING, APPROVED, REJECTED |
| Testimonial | PENDING, APPROVED, REJECTED |
| Blog post | DRAFT, PUBLISHED, UNPUBLISHED |
| Career opening | DRAFT, PUBLISHED, CLOSED |
