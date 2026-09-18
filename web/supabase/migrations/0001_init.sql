-- Amani Tech — Supabase schema (run in SQL editor or `supabase db push`)
-- Tables · enums · triggers · RLS · storage buckets
-- Safe to re-run: every statement skips or replaces what already exists.

create extension if not exists pgcrypto;

-- ---------- Enums ----------
do $$ begin create type job_status as enum ('DRAFT','PUBLISHED','PAUSED','CLOSED','ARCHIVED'); exception when duplicate_object then null; end $$;
do $$ begin create type application_status as enum ('SUBMITTED','REVIEWING','SHORTLISTED','REJECTED','CLOSED'); exception when duplicate_object then null; end $$;
do $$ begin create type enquiry_status as enum ('NEW','CONTACTED','IN_DISCUSSION','CONVERTED','CLOSED'); exception when duplicate_object then null; end $$;
do $$ begin create type review_status as enum ('PENDING','APPROVED','REJECTED'); exception when duplicate_object then null; end $$;
do $$ begin create type content_status as enum ('DRAFT','PUBLISHED','UNPUBLISHED','CLOSED'); exception when duplicate_object then null; end $$;

-- ---------- Helpers ----------
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- Profiles (mirrors auth.users; role drives admin access) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'CANDIDATE' check (role in ('ADMIN','EDITOR','CANDIDATE')),
  created_at timestamptz not null default now()
);

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('ADMIN','EDITOR'));
$$;

-- ---------- Taxonomy ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  unique (category_id, slug)
);

-- ---------- Jobs ----------
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  company_name text not null,
  description text not null default '',
  category_id uuid references categories(id) on delete set null,
  subcategory_id uuid references subcategories(id) on delete set null,
  location text not null,
  work_mode text not null default 'On-site' check (work_mode in ('On-site','Hybrid','Remote')),
  employment_type text not null default 'Full-time' check (employment_type in ('Full-time','Contract','Part-time','Internship')),
  exp_min int not null default 0,
  exp_max int not null default 0,
  salary_min numeric(8,2),
  salary_max numeric(8,2),
  skills text[] not null default '{}',
  qualification text,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  job_source text,
  application_deadline date,
  is_featured boolean not null default false,
  status job_status not null default 'DRAFT',
  published_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists jobs_status_published_idx on jobs (status, published_at desc);
create index if not exists jobs_category_idx on jobs (category_id, subcategory_id);
-- array_to_string() is STABLE, so it cannot appear in an index expression; skills get their own GIN index instead.
create index if not exists jobs_search_idx on jobs using gin (to_tsvector('english', title || ' ' || company_name || ' ' || location));
create index if not exists jobs_skills_idx on jobs using gin (skills);
drop trigger if exists jobs_updated_at on jobs;
create trigger jobs_updated_at before update on jobs for each row execute function set_updated_at();

-- ---------- Candidates & applications ----------
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  phone text not null,
  location text not null,
  profile_type text not null default 'IT' check (profile_type in ('IT','Non-IT')),
  category_id uuid references categories(id) on delete set null,
  subcategory_id uuid references subcategories(id) on delete set null,
  experience text,
  current_title text,
  resume_path text,               -- storage key in bucket "resumes"
  resume_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists candidates_updated_at on candidates;
create trigger candidates_updated_at before update on candidates for each row execute function set_updated_at();

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  resume_path text,
  resume_name text,
  status application_status not null default 'SUBMITTED',
  internal_note text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);
create index if not exists applications_job_idx on applications (job_id);
create index if not exists applications_candidate_idx on applications (candidate_id);
drop trigger if exists applications_updated_at on applications;
create trigger applications_updated_at before update on applications for each row execute function set_updated_at();

-- ---------- Leads ----------
create table if not exists employer_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('REQ-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 10000)::text, 4, '0')),
  full_name text not null,
  work_email text not null,
  phone text not null,
  company_name text not null,
  designation text not null,
  requirement_type text not null,
  job_title text not null,
  positions int not null default 1,
  location text not null,
  work_mode text not null,
  experience_required text not null,
  joining_timeline text not null,
  job_description text not null,
  requirements text,
  jd_path text,                   -- storage key in bucket "documents"
  status enquiry_status not null default 'NEW',
  notes jsonb not null default '[]',   -- [{by, at, text}]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists employer_enquiries_updated_at on employer_enquiries;
create trigger employer_enquiries_updated_at before update on employer_enquiries for each row execute function set_updated_at();

create table if not exists vendor_enquiries (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  location text not null,
  services text[] not null default '{}',
  specialization text not null,
  years_experience text not null,
  website text,
  additional_info text,
  document_path text,
  status review_status not null default 'PENDING',
  notes jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists vendor_enquiries_updated_at on vendor_enquiries;
create trigger vendor_enquiries_updated_at before update on vendor_enquiries for each row execute function set_updated_at();

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  audience text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Testimonials ----------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  company text not null,
  photo_path text,
  rating int not null check (rating between 1 and 5),
  review text not null,
  status review_status not null default 'PENDING',
  is_featured boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Content ----------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',            -- markdown
  cover_image text,                             -- URL or storage path
  author text not null default 'Amani Tech Editorial',
  category text not null default 'Insights' check (category in ('Insights','Career Advice','Company News')),
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  read_minutes int not null default 5,
  is_featured boolean not null default false,
  status content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists blog_posts_updated_at on blog_posts;
create trigger blog_posts_updated_at before update on blog_posts for each row execute function set_updated_at();

create table if not exists career_openings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  position text not null,
  department text not null,
  location text not null,
  work_mode text not null default 'On-site',
  experience text not null,
  description text not null default '',
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  application_instructions text not null default '',
  status content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists career_openings_updated_at on career_openings;
create trigger career_openings_updated_at before update on career_openings for each row execute function set_updated_at();

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  long_description text not null default '',
  icon text not null default 'briefcase',
  image text,
  roles text[] not null default '{}',
  cta_text text not null default 'Learn more',
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  "group" text not null default 'General',
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- Homepage sections & settings: one JSON payload per key
create table if not exists site_content (
  key text primary key,
  payload jsonb not null default '{}',
  is_visible boolean not null default true,
  updated_at timestamptz not null default now()
);
drop trigger if exists site_content_updated_at on site_content;
create trigger site_content_updated_at before update on site_content for each row execute function set_updated_at();

-- ---------- Row-level security ----------
alter table profiles enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table jobs enable row level security;
alter table candidates enable row level security;
alter table applications enable row level security;
alter table employer_enquiries enable row level security;
alter table vendor_enquiries enable row level security;
alter table contact_messages enable row level security;
alter table testimonials enable row level security;
alter table blog_posts enable row level security;
alter table career_openings enable row level security;
alter table services enable row level security;
alter table faqs enable row level security;
alter table site_content enable row level security;

-- Own profile; admins see all
drop policy if exists "profiles: own or admin" on profiles;
create policy "profiles: own or admin" on profiles for select using (id = auth.uid() or is_admin());
drop policy if exists "profiles: admin update" on profiles;
create policy "profiles: admin update" on profiles for update using (is_admin());

-- Public read of published/active content
drop policy if exists "categories: public read" on categories;
create policy "categories: public read" on categories for select using (is_active or is_admin());
drop policy if exists "subcategories: public read" on subcategories;
create policy "subcategories: public read" on subcategories for select using (is_active or is_admin());
drop policy if exists "jobs: public read published" on jobs;
create policy "jobs: public read published" on jobs for select using (status = 'PUBLISHED' or is_admin());
drop policy if exists "testimonials: public read approved" on testimonials;
create policy "testimonials: public read approved" on testimonials for select using (status = 'APPROVED' or is_admin());
drop policy if exists "blog: public read published" on blog_posts;
create policy "blog: public read published" on blog_posts for select using (status = 'PUBLISHED' or is_admin());
drop policy if exists "careers: public read published" on career_openings;
create policy "careers: public read published" on career_openings for select using (status = 'PUBLISHED' or is_admin());
drop policy if exists "services: public read" on services;
create policy "services: public read" on services for select using (is_active or is_admin());
drop policy if exists "faqs: public read" on faqs;
create policy "faqs: public read" on faqs for select using (is_active or is_admin());
drop policy if exists "site_content: public read" on site_content;
create policy "site_content: public read" on site_content for select using (true);

-- Candidates see and edit their own record and applications
drop policy if exists "candidates: own read" on candidates;
create policy "candidates: own read" on candidates for select using (user_id = auth.uid() or is_admin());
drop policy if exists "candidates: own update" on candidates;
create policy "candidates: own update" on candidates for update using (user_id = auth.uid() or is_admin());
drop policy if exists "applications: own read" on applications;
create policy "applications: own read" on applications for select
  using (is_admin() or exists (select 1 from candidates c where c.id = candidate_id and c.user_id = auth.uid()));

-- Admin full access (public form inserts go through the server with the service role)
drop policy if exists "categories: admin" on categories;
create policy "categories: admin" on categories for all using (is_admin()) with check (is_admin());
drop policy if exists "subcategories: admin" on subcategories;
create policy "subcategories: admin" on subcategories for all using (is_admin()) with check (is_admin());
drop policy if exists "jobs: admin" on jobs;
create policy "jobs: admin" on jobs for all using (is_admin()) with check (is_admin());
drop policy if exists "candidates: admin" on candidates;
create policy "candidates: admin" on candidates for all using (is_admin()) with check (is_admin());
drop policy if exists "applications: admin" on applications;
create policy "applications: admin" on applications for all using (is_admin()) with check (is_admin());
drop policy if exists "employer_enquiries: admin" on employer_enquiries;
create policy "employer_enquiries: admin" on employer_enquiries for all using (is_admin()) with check (is_admin());
drop policy if exists "vendor_enquiries: admin" on vendor_enquiries;
create policy "vendor_enquiries: admin" on vendor_enquiries for all using (is_admin()) with check (is_admin());
drop policy if exists "contact_messages: admin" on contact_messages;
create policy "contact_messages: admin" on contact_messages for all using (is_admin()) with check (is_admin());
drop policy if exists "testimonials: admin" on testimonials;
create policy "testimonials: admin" on testimonials for all using (is_admin()) with check (is_admin());
drop policy if exists "blog: admin" on blog_posts;
create policy "blog: admin" on blog_posts for all using (is_admin()) with check (is_admin());
drop policy if exists "careers: admin" on career_openings;
create policy "careers: admin" on career_openings for all using (is_admin()) with check (is_admin());
drop policy if exists "services: admin" on services;
create policy "services: admin" on services for all using (is_admin()) with check (is_admin());
drop policy if exists "faqs: admin" on faqs;
create policy "faqs: admin" on faqs for all using (is_admin()) with check (is_admin());
drop policy if exists "site_content: admin" on site_content;
create policy "site_content: admin" on site_content for all using (is_admin()) with check (is_admin());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('resumes',   'resumes',   false, 5242880, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('documents', 'documents', false, 5242880, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('media',     'media',     true,  3145728, array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media: admin write" on storage.objects;
create policy "media: admin write" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
drop policy if exists "private files: admin read" on storage.objects;
create policy "private files: admin read" on storage.objects for select using (bucket_id in ('resumes','documents') and public.is_admin());
drop policy if exists "resumes: own read" on storage.objects;
create policy "resumes: own read" on storage.objects for select
  using (bucket_id = 'resumes' and exists (select 1 from candidates c where c.user_id = auth.uid() and c.resume_path = name));

-- ---------- Dashboard metrics (single round-trip) ----------
create or replace function admin_metrics() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active_jobs',           (select count(*) from jobs where status = 'PUBLISHED'),
    'applications',          (select count(*) from applications),
    'candidates',            (select count(*) from candidates),
    'pending_testimonials',  (select count(*) from testimonials where status = 'PENDING'),
    'employer_enquiries',    (select count(*) from employer_enquiries),
    'vendor_enquiries',      (select count(*) from vendor_enquiries),
    'published_blogs',       (select count(*) from blog_posts where status = 'PUBLISHED'),
    'career_openings',       (select count(*) from career_openings where status = 'PUBLISHED'),
    'new_leads',             (select count(*) from employer_enquiries where status = 'NEW'),
    'new_applications',      (select count(*) from applications where status = 'SUBMITTED')
  ) where is_admin();
$$;

-- ---------- Make the first admin ----------
-- After signing up through /admin/login → "Create account" (or the Supabase dashboard), run:
-- update profiles set role = 'ADMIN' where email = 'you@amanitech.in';
