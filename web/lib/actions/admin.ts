'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { storeFile, signedUrl } from '@/lib/files';
import { lines, slugify } from '@/lib/format';
import type { ActionResult, ApplicationStatus, ContentStatus, EnquiryStatus, JobStatus, Note, ReviewStatus } from '@/lib/types';

const ok = <T,>(data?: T): ActionResult<T> => ({ ok: true, data });
const fail = (error: string, fields?: Record<string, string>): ActionResult<never> => ({ ok: false, error, fields });
const zodFields = (e: z.ZodError) => Object.fromEntries(e.issues.map(i => [String(i.path[0]), i.message]));

async function db() { await requireAdmin(); return createClient(); }
function revalidateSite() { revalidateTag('site'); ['/', '/jobs', '/blog', '/careers', '/services', '/faqs', '/employers', '/about', '/contact'].forEach(p => revalidatePath(p, 'layout')); revalidatePath('/admin', 'layout'); }

/* ---------- Jobs ---------- */
const jobSchema = z.object({
  title: z.string().trim().min(2, 'Title is required.'), company_name: z.string().trim().min(1, 'Company name is required.'), company_logo: z.string().trim().max(500).optional(),
  location: z.string().trim().min(1, 'Location is required.'), category_id: z.string().min(1, 'Select a category.'), subcategory_id: z.string().min(1, 'Select a subcategory.'),
  work_mode: z.enum(['On-site', 'Hybrid', 'Remote']), employment_type: z.enum(['Full-time', 'Contract', 'Part-time', 'Internship']),
  exp_min: z.coerce.number().int().min(0), exp_max: z.coerce.number().int().min(0),
  salary_min: z.union([z.literal(''), z.coerce.number().min(0)]), salary_max: z.union([z.literal(''), z.coerce.number().min(0)]),
  description: z.string().trim().min(20, 'Description is required (20+ characters).'), responsibilities: z.string().optional(), requirements: z.string().optional(),
  qualification: z.string().optional(), benefits: z.string().optional(), skills: z.string().optional(), job_source: z.string().optional(),
  application_deadline: z.string().min(1, 'Deadline is required.'), is_featured: z.string().optional(),
});

export async function saveJob(id: string | null, status: JobStatus, _: unknown, fd: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = jobSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please fix the highlighted fields.', zodFields(parsed.error));
  const v = parsed.data;
  const skills = (v.skills || '').split('|').map(s => s.trim()).filter(Boolean);
  if (status === 'PUBLISHED' && !skills.length) return fail('Add at least one skill before publishing.', { skills: 'Add at least one skill before publishing.' });
  const sb = await db();
  const row = {
    title: v.title, company_name: v.company_name, company_logo: v.company_logo || null, location: v.location, category_id: v.category_id, subcategory_id: v.subcategory_id,
    work_mode: v.work_mode, employment_type: v.employment_type, exp_min: v.exp_min, exp_max: Math.max(v.exp_max, v.exp_min),
    salary_min: v.salary_min === '' ? null : v.salary_min, salary_max: v.salary_max === '' ? null : v.salary_max,
    description: v.description, responsibilities: lines(v.responsibilities), requirements: lines(v.requirements), benefits: lines(v.benefits),
    qualification: v.qualification || null, skills, job_source: v.job_source || null, application_deadline: v.application_deadline,
    is_featured: v.is_featured === 'on', status, ...(status === 'PUBLISHED' ? { published_at: new Date().toISOString() } : {}),
  };
  let jobId = id;
  if (id) { const { error } = await sb.from('jobs').update(row).eq('id', id); if (error) return fail(error.message); }
  else {
    const slug = `${slugify(v.title)}-${slugify(v.location)}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await sb.from('jobs').insert({ ...row, slug }).select('id').single();
    if (error || !data) return fail(error?.message || 'Could not create job.');
    jobId = data.id;
  }
  revalidateSite();
  return ok({ id: jobId! });
}

export async function setJobStatus(id: string, status: JobStatus) {
  const sb = await db();
  await sb.from('jobs').update({ status, ...(status === 'PUBLISHED' ? { published_at: new Date().toISOString() } : {}) }).eq('id', id);
  revalidateSite();
}
export async function toggleJobFeatured(id: string, featured: boolean) { const sb = await db(); await sb.from('jobs').update({ is_featured: featured }).eq('id', id); revalidateSite(); }

/* ---------- Categories ---------- */
export async function createCategory(name: string) {
  const sb = await db(); const n = name.trim(); if (!n) return fail('Name is required.');
  const { count } = await sb.from('categories').select('*', { count: 'exact', head: true });
  const { error } = await sb.from('categories').insert({ name: n, slug: slugify(n), sort_order: (count || 0) + 1 });
  revalidateSite(); return error ? fail(error.message) : ok();
}
export async function renameCategory(id: string, name: string) { const sb = await db(); await sb.from('categories').update({ name: name.trim() }).eq('id', id); revalidateSite(); }
export async function toggleCategory(id: string, active: boolean) { const sb = await db(); await sb.from('categories').update({ is_active: active }).eq('id', id); revalidateSite(); }
export async function deleteCategory(id: string): Promise<ActionResult> {
  const sb = await db();
  const { count } = await sb.from('jobs').select('*', { count: 'exact', head: true }).eq('category_id', id);
  if (count) return fail(`Cannot delete: ${count} jobs use this category. Deactivate it instead.`);
  await sb.from('categories').delete().eq('id', id); revalidateSite(); return ok();
}
export async function reorderCategories(ids: string[]) { const sb = await db(); await Promise.all(ids.map((id, i) => sb.from('categories').update({ sort_order: i + 1 }).eq('id', id))); revalidateSite(); }
export async function createSubcategory(categoryId: string, name: string) {
  const sb = await db(); const n = name.trim(); if (!n) return fail('Name is required.');
  const { count } = await sb.from('subcategories').select('*', { count: 'exact', head: true }).eq('category_id', categoryId);
  const { error } = await sb.from('subcategories').insert({ category_id: categoryId, name: n, slug: slugify(n), sort_order: (count || 0) + 1 });
  revalidateSite(); return error ? fail(error.message) : ok();
}
export async function renameSubcategory(id: string, name: string) { const sb = await db(); await sb.from('subcategories').update({ name: name.trim() }).eq('id', id); revalidateSite(); }
export async function deleteSubcategory(id: string): Promise<ActionResult> {
  const sb = await db();
  const { count } = await sb.from('jobs').select('*', { count: 'exact', head: true }).eq('subcategory_id', id);
  if (count) return fail(`Cannot delete: ${count} jobs use this subcategory.`);
  await sb.from('subcategories').delete().eq('id', id); revalidateSite(); return ok();
}

/* ---------- Applications & leads ---------- */
export async function setApplicationStatus(id: string, status: ApplicationStatus) { const sb = await db(); await sb.from('applications').update({ status }).eq('id', id); revalidatePath('/admin', 'layout'); revalidatePath('/candidate/dashboard'); }
export async function setApplicationNote(id: string, note: string) { const sb = await db(); await sb.from('applications').update({ internal_note: note }).eq('id', id); revalidatePath('/admin', 'layout'); }

type LeadTable = 'employer_enquiries' | 'vendor_enquiries';
export async function setLeadStatus(table: LeadTable, id: string, status: EnquiryStatus | ReviewStatus) { const sb = await db(); await sb.from(table).update({ status }).eq('id', id); revalidatePath('/admin', 'layout'); }
export async function addLeadNote(table: LeadTable, id: string, text: string) {
  const admin = await requireAdmin(); const sb = await createClient();
  const { data } = await sb.from(table).select('notes').eq('id', id).single();
  const notes: Note[] = [{ by: admin.name || admin.email, at: new Date().toISOString(), text: text.trim() }, ...((data?.notes as Note[]) || [])];
  await sb.from(table).update({ notes }).eq('id', id); revalidatePath('/admin', 'layout');
}
export async function fileLink(bucket: 'resumes' | 'documents' | 'photos', path: string) { await requireAdmin(); return signedUrl(bucket, path); }

/* ---------- Testimonials ---------- */
export async function moderateTestimonial(id: string, patch: { status?: ReviewStatus; is_featured?: boolean; review?: string }) {
  const sb = await db();
  const row = { ...patch, ...(patch.status === 'APPROVED' ? { approved_at: new Date().toISOString() } : {}), ...(patch.status === 'REJECTED' ? { is_featured: false } : {}) };
  await sb.from('testimonials').update(row).eq('id', id); revalidateSite();
}
export async function deleteTestimonial(id: string) { const sb = await db(); await sb.from('testimonials').delete().eq('id', id); revalidateSite(); }

/* ---------- Blog ---------- */
const postSchema = z.object({
  title: z.string().trim().min(2, 'Title is required.'), slug: z.string().trim().optional(), excerpt: z.string().optional(), content: z.string().optional(),
  category: z.enum(['Insights', 'Career Advice', 'Company News']), author: z.string().trim().min(1), published_at: z.string().optional(),
  tags: z.string().optional(), seo_title: z.string().optional(), seo_description: z.string().optional(), is_featured: z.string().optional(), cover_url: z.string().optional(),
});
export async function savePost(id: string | null, status: ContentStatus, _: unknown, fd: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = postSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please fix the highlighted fields.', zodFields(parsed.error));
  const v = parsed.data; const sb = await db();
  let cover_image = v.cover_url || null;
  try { const up = await storeFile(fd.get('cover') as File | null, 'media', 'blog', 'image'); if (up) cover_image = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${up.path}`; } catch (e) { return fail(e instanceof Error ? e.message : 'Upload failed.'); }
  const words = (v.content || '').split(/\s+/).length;
  const row = {
    title: v.title, slug: slugify(v.slug || v.title), excerpt: v.excerpt || '', content: v.content || '', category: v.category, author: v.author,
    tags: (v.tags || '').split('|').map(t => t.trim()).filter(Boolean), seo_title: v.seo_title || null, seo_description: v.seo_description || null,
    is_featured: v.is_featured === 'on', status, read_minutes: Math.max(1, Math.round(words / 200)), cover_image,
    published_at: v.published_at || (status === 'PUBLISHED' ? new Date().toISOString() : null),
  };
  let postId = id;
  if (id) { const { error } = await sb.from('blog_posts').update(row).eq('id', id); if (error) return fail(error.message); }
  else { const { data, error } = await sb.from('blog_posts').insert(row).select('id').single(); if (error || !data) return fail(error?.message || 'Could not create post.'); postId = data.id; }
  revalidateSite(); return ok({ id: postId! });
}
export async function setPostStatus(id: string, status: ContentStatus) { const sb = await db(); await sb.from('blog_posts').update({ status }).eq('id', id); revalidateSite(); }
export async function togglePostFeatured(id: string, featured: boolean) { const sb = await db(); await sb.from('blog_posts').update({ is_featured: featured }).eq('id', id); revalidateSite(); }
export async function deletePost(id: string) { const sb = await db(); await sb.from('blog_posts').delete().eq('id', id); revalidateSite(); }

/* ---------- Careers ---------- */
const openingSchema = z.object({
  position: z.string().trim().min(2, 'Position is required.'), department: z.string().min(1), location: z.string().trim().min(1, 'Location is required.'),
  work_mode: z.string().min(1), experience: z.string().trim().min(1, 'Experience is required.'), description: z.string().trim().min(20, 'Description is required (20+ characters).'),
  responsibilities: z.string().optional(), requirements: z.string().optional(), benefits: z.string().optional(), application_instructions: z.string().trim().min(10, 'Application instructions are required.'),
});
export async function saveOpening(id: string | null, status: ContentStatus, _: unknown, fd: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = openingSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please fix the highlighted fields.', zodFields(parsed.error));
  const v = parsed.data; const sb = await db();
  const row = { ...v, responsibilities: lines(v.responsibilities), requirements: lines(v.requirements), benefits: lines(v.benefits), status, ...(status === 'PUBLISHED' ? { published_at: new Date().toISOString() } : {}) };
  let oid = id;
  if (id) { const { error } = await sb.from('career_openings').update(row).eq('id', id); if (error) return fail(error.message); }
  else { const { data, error } = await sb.from('career_openings').insert({ ...row, slug: `${slugify(v.position)}-${Math.random().toString(36).slice(2, 6)}` }).select('id').single(); if (error || !data) return fail(error?.message || 'Could not create opening.'); oid = data.id; }
  revalidateSite(); return ok({ id: oid! });
}
export async function setOpeningStatus(id: string, status: ContentStatus) { const sb = await db(); await sb.from('career_openings').update({ status }).eq('id', id); revalidateSite(); }
export async function deleteOpening(id: string) { const sb = await db(); await sb.from('career_openings').delete().eq('id', id); revalidateSite(); }

/* ---------- CMS ---------- */
export async function saveContent(key: string, payload: Record<string, unknown>, is_visible: boolean): Promise<ActionResult> {
  const sb = await db();
  const { error } = await sb.from('site_content').upsert({ key, payload, is_visible }, { onConflict: 'key' });
  revalidateSite(); return error ? fail(error.message) : ok();
}
export async function uploadMedia(_: unknown, fd: FormData): Promise<ActionResult<{ url: string }>> {
  await requireAdmin();
  try { const up = await storeFile(fd.get('file') as File | null, 'media', String(fd.get('prefix') || 'cms'), 'image'); if (!up) return fail('Choose a file.'); return ok({ url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${up.path}` }); }
  catch (e) { return fail(e instanceof Error ? e.message : 'Upload failed.'); }
}
export async function saveServices(items: { id?: string; slug: string; title: string; short_description: string; long_description: string; icon: string; image: string | null; roles: string[]; sort_order: number; is_active: boolean }[]): Promise<ActionResult> {
  const sb = await db();
  const { error } = await sb.from('services').upsert(items.map(i => ({ ...i, id: i.id || undefined })), { onConflict: 'slug' });
  revalidateSite(); return error ? fail(error.message) : ok();
}
export async function saveFaqs(items: { id?: string; question: string; answer: string; group: string; sort_order: number; is_active: boolean }[], deletedIds: string[]): Promise<ActionResult> {
  const sb = await db();
  if (deletedIds.length) await sb.from('faqs').delete().in('id', deletedIds);
  const { error } = await sb.from('faqs').upsert(items.map(i => ({ ...i, id: i.id || undefined })));
  revalidateSite(); return error ? fail(error.message) : ok();
}
export async function deleteService(id: string) { const sb = await db(); await sb.from('services').update({ is_active: false }).eq('id', id); revalidateSite(); }

/* ---------- Settings / auth ---------- */
export async function changePassword(_: unknown, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const pw = String(fd.get('new_password') || ''); if (pw.length < 12) return fail('Minimum 12 characters.', { new_password: 'Minimum 12 characters.' });
  const sb = await createClient(); const { error } = await sb.auth.updateUser({ password: pw });
  return error ? fail(error.message) : ok();
}
export async function adminSignIn(_: unknown, fd: FormData): Promise<ActionResult> {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Enter your email and password.');
  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword(parsed.data);
  if (error) return fail('Incorrect email or password.');
  const { data: { user } } = await sb.auth.getUser();
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user!.id).maybeSingle();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'EDITOR')) { await sb.auth.signOut(); return fail('This account does not have admin access.'); }
  redirect('/admin');
}
export async function adminSignOut() { const sb = await createClient(); await sb.auth.signOut(); redirect('/admin/login'); }
