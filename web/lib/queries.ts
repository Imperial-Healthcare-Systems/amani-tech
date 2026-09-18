import { cache } from 'react';
import { createClient } from './supabase/server';
import { supabaseEnv } from './supabase/env';
import type { BlogPost, CareerOpening, Category, Faq, Job, Service, SiteContent, Testimonial } from './types';

const JOB_SELECT = '*, category:categories(name,slug), subcategory:subcategories(name,slug)';

// Mirrors seed.sql so the site is browsable before Supabase is configured (local preview, first deploy).
const DEMO_CATEGORIES = [
  ['IT & Software', 'it', ['Software Development', 'Cloud & DevOps', 'Data Engineering', 'Data Science', 'AI / ML', 'Cybersecurity', 'QA / Automation', 'ERP', 'IT Project Management']],
  ['Finance & Accounting', 'finance', ['Accounting', 'Banking', 'Financial Analysis', 'Audit']],
  ['Engineering', 'engineering', ['Mechanical', 'Civil', 'Electrical', 'Electronics']],
  ['Operations & Supply Chain', 'operations', ['Logistics', 'Procurement', 'Plant Operations']],
  ['Sales & Marketing', 'sales', ['Inside Sales', 'Field Sales', 'Digital Marketing']],
  ['HR & Administration', 'hr', ['Recruitment', 'HR Operations', 'Administration']],
].map(([name, slug, subs], i) => ({
  id: slug, name, slug, sort_order: i + 1, is_active: true,
  subcategories: (subs as string[]).map((n, j) => ({ id: `${slug}-${j}`, category_id: slug, name: n, slug: n.toLowerCase().replace(/[^a-z0-9]+/g, '-'), sort_order: j + 1, is_active: true })),
})) as unknown as Category[];

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!supabaseEnv().configured) return DEMO_CATEGORIES;
  const sb = await createClient();
  const { data } = await sb.from('categories').select('*, subcategories(*)').eq('is_active', true).order('sort_order');
  return (data || []).map((c) => ({ ...c, subcategories: (c.subcategories || []).filter((s: { is_active: boolean }) => s.is_active).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order) })) as Category[];
});

export const getPublishedJobs = cache(async (): Promise<Job[]> => {
  const sb = await createClient();
  const { data } = await sb.from('jobs').select(JOB_SELECT).eq('status', 'PUBLISHED').order('published_at', { ascending: false });
  return (data || []) as Job[];
});

export const getFeaturedJobs = cache(async (limit = 6): Promise<Job[]> => {
  const sb = await createClient();
  const { data } = await sb.from('jobs').select(JOB_SELECT).eq('status', 'PUBLISHED').eq('is_featured', true).order('published_at', { ascending: false }).limit(limit);
  return (data || []) as Job[];
});

export const getJobBySlug = cache(async (slug: string): Promise<Job | null> => {
  const sb = await createClient();
  const { data } = await sb.from('jobs').select(JOB_SELECT).eq('slug', slug).eq('status', 'PUBLISHED').maybeSingle();
  return (data as Job) || null;
});

export const getSimilarJobs = cache(async (job: Job, limit = 4): Promise<Job[]> => {
  const sb = await createClient();
  const { data } = await sb.from('jobs').select(JOB_SELECT).eq('status', 'PUBLISHED').neq('id', job.id)
    .or(`subcategory_id.eq.${job.subcategory_id},category_id.eq.${job.category_id}`).order('published_at', { ascending: false }).limit(limit);
  return (data || []) as Job[];
});

export const getJobCountsByCategory = cache(async (): Promise<Record<string, number>> => {
  const sb = await createClient();
  const { data } = await sb.from('jobs').select('category_id').eq('status', 'PUBLISHED');
  return (data || []).reduce<Record<string, number>>((acc, r) => { if (r.category_id) acc[r.category_id] = (acc[r.category_id] || 0) + 1; return acc; }, {});
});

const DEMO_SERVICES = [
  ['it-staffing', 'IT Staffing', 'Developers, cloud and DevOps engineers, data and AI specialists, QA, ERP and IT project managers — on contract or permanent terms.', 'code'],
  ['non-it-staffing', 'Non-IT Staffing', 'Finance, accounting, engineering, operations, sales and support roles across industries.', 'briefcase'],
  ['contract-staffing', 'Contract Staffing', 'Flexible, compliant workforce for project peaks, backfills and fixed-term needs.', 'clock'],
  ['permanent-recruitment', 'Permanent Recruitment', 'End-to-end hiring for full-time positions, from brief to offer acceptance.', 'usercheck'],
  ['bulk-project-hiring', 'Bulk & Project Hiring', 'Volume hiring for new sites, expansions and time-bound programmes.', 'users'],
  ['fresher-hiring', 'Fresher & Entry-Level Hiring', 'Screened graduates and early-career talent ready to start.', 'graduation'],
  ['training-upskilling', 'Training & Upskilling', 'Role-ready training for graduates and working professionals, aligned to what employers are hiring for now.', 'trend'],
].map(([slug, title, short_description, icon], i) => ({ id: slug, slug, title, short_description, long_description: '', icon, image: null, roles: [], cta_text: 'Learn more', sort_order: i + 1, is_active: true })) as Service[];

export const getServices = cache(async (): Promise<Service[]> => {
  if (!supabaseEnv().configured) return DEMO_SERVICES;
  const sb = await createClient();
  const { data } = await sb.from('services').select('*').eq('is_active', true).order('sort_order');
  return (data || []) as Service[];
});

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const sb = await createClient();
  const { data } = await sb.from('services').select('*').eq('slug', slug).maybeSingle();
  return (data as Service) || null;
});

export const getTestimonials = cache(async (featuredOnly = true): Promise<Testimonial[]> => {
  const sb = await createClient();
  let q = sb.from('testimonials').select('*').eq('status', 'APPROVED').order('approved_at', { ascending: false });
  if (featuredOnly) q = q.eq('is_featured', true);
  const { data } = await q;
  return (data || []) as Testimonial[];
});

export const getPosts = cache(async (category?: string): Promise<BlogPost[]> => {
  const sb = await createClient();
  let q = sb.from('blog_posts').select('*').eq('status', 'PUBLISHED').order('published_at', { ascending: false });
  if (category) q = q.eq('category', category);
  const { data } = await q;
  return (data || []) as BlogPost[];
});

export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const sb = await createClient();
  const { data } = await sb.from('blog_posts').select('*').eq('slug', slug).eq('status', 'PUBLISHED').maybeSingle();
  return (data as BlogPost) || null;
});

export const getOpenings = cache(async (): Promise<CareerOpening[]> => {
  const sb = await createClient();
  const { data } = await sb.from('career_openings').select('*').eq('status', 'PUBLISHED').order('published_at', { ascending: false });
  return (data || []) as CareerOpening[];
});

export const getOpening = cache(async (slug: string): Promise<CareerOpening | null> => {
  const sb = await createClient();
  const { data } = await sb.from('career_openings').select('*').eq('slug', slug).eq('status', 'PUBLISHED').maybeSingle();
  return (data as CareerOpening) || null;
});

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const sb = await createClient();
  const { data } = await sb.from('faqs').select('*').eq('is_active', true).order('sort_order');
  return (data || []) as Faq[];
});

export const getContent = cache(async <T,>(key: string, fallback: T): Promise<SiteContent<T>> => {
  const sb = await createClient();
  const { data } = await sb.from('site_content').select('*').eq('key', key).maybeSingle();
  return data ? (data as SiteContent<T>) : { key, payload: fallback, is_visible: true };
});
