'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { storeFile } from '@/lib/files';
import { email } from '@/lib/email';
import type { ActionResult } from '@/lib/types';

/* ---------- Rate limit (per IP, per form) ----------
   ponytail: in-memory map; swap for Upstash/Redis when running more than one instance. */
const hits = new Map<string, number[]>();
async function rateLimit(scope: string): Promise<string | null> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const key = `${scope}:${ip}`, now = Date.now();
  const win = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60) * 1000, max = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 5);
  const arr = (hits.get(key) || []).filter(t => now - t < win);
  if (arr.length >= max) return 'Too many submissions. Please wait a minute and try again.';
  arr.push(now); hits.set(key, arr);
  return null;
}

const fail = (error: string, fields?: Record<string, string>): ActionResult => ({ ok: false, error, fields });
const zodFields = (e: z.ZodError) => Object.fromEntries(e.issues.map(i => [String(i.path[0]), i.message]));
const str = (min = 1, msg = 'This field is required.') => z.string().trim().min(min, msg);
const emailZ = z.string().trim().email('Enter a valid email address.');
const phoneZ = z.string().trim().regex(/^[+\d][\d\s-]{7,}$/, 'Enter a valid phone number.');

/* ---------- Candidate application ---------- */
const applySchema = z.object({
  job_id: str(), name: str(2), email: emailZ, phone: phoneZ, location: str(),
  profile_type: z.enum(['IT', 'Non-IT']), category_id: str(1, 'Select a category.'), subcategory_id: str(1, 'Select a subcategory.'),
  experience: str(1, 'Select your experience.'), current_title: str(), consent: z.literal('on', { errorMap: () => ({ message: 'Please confirm to continue.' }) }),
});

export async function submitApplication(_: unknown, fd: FormData): Promise<ActionResult<{ email: string }>> {
  const limited = await rateLimit('apply'); if (limited) return fail(limited);
  const parsed = applySchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const v = parsed.data;
  try {
    const db = adminClient();
    const { data: job } = await db.from('jobs').select('id,title,company_name,status').eq('id', v.job_id).maybeSingle();
    if (!job || job.status !== 'PUBLISHED') return fail('This job is no longer accepting applications.');
    const resume = await storeFile(fd.get('resume') as File | null, 'resumes', 'applications');
    if (!resume) return fail('Please upload your resume.', { resume: 'Please upload a PDF, DOC or DOCX resume.' });
    const sb = await createClient(); const { data: { user } } = await sb.auth.getUser();
    const { data: candidate, error: cErr } = await db.from('candidates').upsert({
      email: v.email.toLowerCase(), name: v.name, phone: v.phone, location: v.location, profile_type: v.profile_type,
      category_id: v.category_id, subcategory_id: v.subcategory_id, experience: v.experience, current_title: v.current_title,
      resume_path: resume.path, resume_name: resume.name, ...(user ? { user_id: user.id } : {}),
    }, { onConflict: 'email' }).select('id').single();
    if (cErr || !candidate) throw cErr;
    const { error: aErr } = await db.from('applications').insert({ job_id: job.id, candidate_id: candidate.id, resume_path: resume.path, resume_name: resume.name });
    if (aErr) return aErr.code === '23505' ? fail('You have already applied for this job. We will be in touch.') : (() => { throw aErr; })();
    await Promise.all([email.registrationCompleted(v.email, v.name, { title: job.title, company: job.company_name }), email.applicationNotifyAdmin(v.name, job.title)]);
    return { ok: true, data: { email: v.email } };
  } catch (e) {
    return fail(e instanceof Error && !('code' in e) ? e.message : "We couldn't submit your application right now. Please check your connection and try again.");
  }
}

/* ---------- Registration / auth ---------- */
const registerSchema = applySchema.omit({ job_id: true }).extend({ password: z.string().min(8, 'At least 8 characters.') });

export async function registerCandidate(_: unknown, fd: FormData): Promise<ActionResult<{ email: string }>> {
  const limited = await rateLimit('register'); if (limited) return fail(limited);
  const parsed = registerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const v = parsed.data;
  try {
    const resume = await storeFile(fd.get('resume') as File | null, 'resumes', 'profiles');
    if (!resume) return fail('Please upload your resume.', { resume: 'Please upload a PDF, DOC or DOCX resume.' });
    const sb = await createClient();
    const { data: auth, error: authErr } = await sb.auth.signUp({ email: v.email.toLowerCase(), password: v.password, options: { data: { name: v.name }, emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` } });
    if (authErr) return fail(authErr.message.includes('already') ? 'An account with this email already exists. Please sign in.' : authErr.message);
    const db = adminClient();
    const { error } = await db.from('candidates').upsert({
      email: v.email.toLowerCase(), name: v.name, phone: v.phone, location: v.location, profile_type: v.profile_type,
      category_id: v.category_id, subcategory_id: v.subcategory_id, experience: v.experience, current_title: v.current_title,
      resume_path: resume.path, resume_name: resume.name, user_id: auth.user?.id ?? null,
    }, { onConflict: 'email' });
    if (error) throw error;
    await email.registrationCompleted(v.email, v.name);
    return { ok: true, data: { email: v.email } };
  } catch (e) {
    return fail(e instanceof Error && !('code' in e) ? e.message : "We couldn't complete your registration right now. Please try again.");
  }
}

export async function signIn(_: unknown, fd: FormData): Promise<ActionResult> {
  const parsed = z.object({ email: emailZ, password: str(1, 'Enter your password.'), next: z.string().optional() }).safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return fail("We couldn't sign you in. Check your email and password and try again.");
  // Same login form for everyone; staff accounts go to the admin panel, candidates to their dashboard.
  const { data: { user } } = await sb.auth.getUser();
  const { data: profile } = user ? await sb.from('profiles').select('role').eq('id', user.id).maybeSingle() : { data: null };
  if (profile?.role === 'ADMIN' || profile?.role === 'EDITOR') redirect('/admin');
  redirect(parsed.data.next && parsed.data.next.startsWith('/') ? parsed.data.next : '/candidate/dashboard');
}

export async function signOut() {
  const sb = await createClient(); await sb.auth.signOut(); redirect('/');
}

export async function forgotPassword(_: unknown, fd: FormData): Promise<ActionResult> {
  const parsed = emailZ.safeParse(fd.get('email')); if (!parsed.success) return fail('Enter a valid email address.');
  const sb = await createClient();
  await sb.auth.resetPasswordForEmail(parsed.data, { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/candidate/dashboard` });
  return { ok: true };
}

/* ---------- Candidate profile settings ---------- */
const eduZ = z.array(z.object({ degree: str(1), institution: str(1), year: z.string().trim().max(20) })).max(10);
const workZ = z.array(z.object({ title: str(1), company: str(1), from: z.string().trim().max(20), to: z.string().trim().max(20), description: z.string().trim().max(600) })).max(15);
const profileSchema = z.object({
  name: str(2), phone: phoneZ, location: str(), profile_type: z.enum(['IT', 'Non-IT']),
  category_id: str(1, 'Select a category.'), subcategory_id: str(1, 'Select a subcategory.'), experience: str(1, 'Select your experience.'),
  current_title: z.string().trim().max(120).optional(), notice_period: z.string().trim().max(40).optional(),
  linkedin_url: z.string().trim().max(200).refine(v => !v || /^https?:\/\//i.test(v), 'Enter the full URL, starting with https://').optional(),
  summary: z.string().trim().max(1200).optional(), skills: z.string().optional(), education: z.string().optional(), work_history: z.string().optional(),
});
const parseRows = <T,>(raw: string | undefined, schema: z.ZodType<T>): T | null => { try { const r = schema.safeParse(JSON.parse(raw || '[]')); return r.success ? r.data : null; } catch { return null; } };

export async function saveCandidateProfile(_: unknown, fd: FormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const v = parsed.data;
  const education = parseRows(v.education, eduZ); if (!education) return fail('Each education entry needs a degree and an institution.');
  const work_history = parseRows(v.work_history, workZ); if (!work_history) return fail('Each work history entry needs a job title and a company.');
  const sb = await createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user?.email) return fail('Please sign in again.');
  const row = {
    name: v.name, phone: v.phone, location: v.location, profile_type: v.profile_type, category_id: v.category_id, subcategory_id: v.subcategory_id,
    experience: v.experience, current_title: v.current_title || null, notice_period: v.notice_period || null, linkedin_url: v.linkedin_url || null, summary: v.summary || null,
    skills: (v.skills || '').split('|').map(s => s.trim()).filter(Boolean).slice(0, 30), education, work_history,
  };
  const db = adminClient(); const addr = user.email.toLowerCase();
  // One candidate per person: reuse the row linked to this login, or the one created earlier by applying with the same email.
  const { data: existing } = await db.from('candidates').select('id').or(`user_id.eq.${user.id},email.eq.${addr}`).limit(1).maybeSingle();
  const { error } = existing
    ? await db.from('candidates').update({ ...row, user_id: user.id }).eq('id', existing.id)
    : await db.from('candidates').insert({ ...row, email: addr, user_id: user.id });
  if (error) return fail('Could not save your profile. Please try again.');
  await db.from('profiles').update({ name: v.name }).eq('id', user.id);
  return { ok: true };
}

export async function uploadPhoto(_: unknown, fd: FormData): Promise<ActionResult> {
  const sb = await createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) return fail('Please sign in again.');
  const db = adminClient();
  const { data: cand } = await db.from('candidates').select('id, photo_path').eq('user_id', user.id).maybeSingle();
  if (!cand) return fail('Save your profile details first, then add a photo.');
  try {
    const photo = await storeFile(fd.get('photo') as File | null, 'photos', 'avatars', 'image', 2);
    if (!photo) return fail('Please choose an image.', { photo: 'Please choose a JPG, PNG or WEBP image.' });
    const { error } = await db.from('candidates').update({ photo_path: photo.path }).eq('id', cand.id);
    if (error) return fail('Could not save your photo.');
    if (cand.photo_path) await db.storage.from('photos').remove([cand.photo_path]);
    return { ok: true };
  } catch (e) { return fail(e instanceof Error ? e.message : 'Upload failed.'); }
}

export async function removePhoto(): Promise<ActionResult> {
  const sb = await createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) return fail('Please sign in again.');
  const db = adminClient();
  const { data: cand } = await db.from('candidates').select('id, photo_path').eq('user_id', user.id).maybeSingle();
  if (cand?.photo_path) { await db.storage.from('photos').remove([cand.photo_path]); await db.from('candidates').update({ photo_path: null }).eq('id', cand.id); }
  return { ok: true };
}

export async function replaceResume(_: unknown, fd: FormData): Promise<ActionResult> {
  const sb = await createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) return fail('Please sign in again.');
  try {
    const resume = await storeFile(fd.get('resume') as File | null, 'resumes', 'profiles');
    if (!resume) return fail('Please choose a file.');
    const { error } = await adminClient().from('candidates').update({ resume_path: resume.path, resume_name: resume.name }).eq('user_id', user.id);
    return error ? fail('Could not update your resume.') : { ok: true };
  } catch (e) { return fail(e instanceof Error ? e.message : 'Upload failed.'); }
}

/* ---------- Employer requirement ---------- */
const employerSchema = z.object({
  full_name: str(2), work_email: emailZ, phone: phoneZ, company_name: str(), designation: str(),
  requirement_type: str(1, 'Select a requirement type.'), job_title: str(), positions: z.coerce.number().int().min(1, 'At least 1.'),
  location: str(), work_mode: str(1, 'Select a work mode.'), experience_required: str(1, 'Select experience.'), joining_timeline: str(1, 'Select a timeline.'),
  job_description: str(40, 'Please add at least 40 characters.'), requirements: z.string().optional(),
  consent: z.literal('on', { errorMap: () => ({ message: 'Please confirm to continue.' }) }),
});

export async function submitEmployerEnquiry(_: unknown, fd: FormData): Promise<ActionResult<{ reference: string; email: string }>> {
  const limited = await rateLimit('employer'); if (limited) return fail(limited);
  const parsed = employerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const { consent: _c, ...v } = parsed.data;
  try {
    const jd = await storeFile(fd.get('jd') as File | null, 'documents', 'jd');
    const db = adminClient();
    const { data, error } = await db.from('employer_enquiries').insert({ ...v, jd_path: jd?.path ?? null }).select('reference').single();
    if (error || !data) throw error;
    const { data: settings } = await db.from('site_content').select('payload').eq('key', 'settings').maybeSingle();
    const sla = (settings?.payload as { employer_sla?: string } | null)?.employer_sla || 'within one business day';
    await Promise.all([email.employerEnquiry(v.work_email, v.full_name, data.reference, sla), email.employerNotifyAdmin(v.company_name, v.job_title, data.reference)]);
    return { ok: true, data: { reference: data.reference, email: v.work_email } };
  } catch (e) {
    return fail(e instanceof Error && !('code' in e) ? e.message : "We couldn't submit your requirement right now. Please check your connection and try again, or email employers@amanitech.in.");
  }
}

/* ---------- Vendor / partner ---------- */
const vendorSchema = z.object({
  company: str(), contact_person: str(), email: emailZ, phone: phoneZ, location: str(),
  website: z.string().trim().optional().refine(v => !v || /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(v), 'Enter a valid website address.'),
  specialization: str(), years_experience: str(1, 'Select your experience.'), additional_info: z.string().optional(),
  consent: z.literal('on', { errorMap: () => ({ message: 'Please confirm to continue.' }) }),
});

export async function submitVendorEnquiry(_: unknown, fd: FormData): Promise<ActionResult<{ email: string }>> {
  const limited = await rateLimit('vendor'); if (limited) return fail(limited);
  const parsed = vendorSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const services = fd.getAll('services').map(String);
  if (!services.length) return fail('Please check the highlighted fields.', { services: 'Select at least one service.' });
  const { consent: _c, ...v } = parsed.data;
  try {
    const doc = await storeFile(fd.get('document') as File | null, 'documents', 'vendors');
    const { error } = await adminClient().from('vendor_enquiries').insert({ ...v, services, document_path: doc?.path ?? null });
    if (error) throw error;
    await Promise.all([email.vendorReceived(v.email, v.contact_person), email.notifyAdmin(`New partner application: ${v.company}`, `${v.contact_person} (${v.company}) applied to become a staffing partner.`, '/admin/vendors')]);
    return { ok: true, data: { email: v.email } };
  } catch (e) { return fail(e instanceof Error && !('code' in e) ? e.message : "We couldn't submit your application right now. Please try again."); }
}

/* ---------- Testimonial ---------- */
export async function submitTestimonial(_: unknown, fd: FormData): Promise<ActionResult> {
  const limited = await rateLimit('review'); if (limited) return fail(limited);
  const parsed = z.object({
    name: str(), designation: str(), company: str(), rating: z.coerce.number().int().min(1, 'Please select a rating.').max(5),
    review: str(40, 'Please add at least 40 characters.'), consent: z.literal('on', { errorMap: () => ({ message: 'Please confirm to continue.' }) }),
  }).safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const { consent: _c, ...v } = parsed.data;
  try {
    const photo = await storeFile(fd.get('photo') as File | null, 'media', 'testimonials', 'image');
    const { error } = await adminClient().from('testimonials').insert({ ...v, photo_path: photo?.path ?? null });
    if (error) throw error;
    await email.notifyAdmin('New testimonial awaiting review', `${v.name} (${v.company}) submitted a ${v.rating}-star review.`, '/admin/testimonials');
    return { ok: true };
  } catch (e) { return fail(e instanceof Error && !('code' in e) ? e.message : "We couldn't submit your review right now. Please try again."); }
}

/* ---------- Contact ---------- */
export async function submitContact(_: unknown, fd: FormData): Promise<ActionResult<{ email: string }>> {
  const limited = await rateLimit('contact'); if (limited) return fail(limited);
  const parsed = z.object({ name: str(), email: emailZ, phone: z.string().optional(), audience: str(1, 'Select an option.'), message: str(20, 'Please add at least 20 characters.') }).safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail('Please check the highlighted fields.', zodFields(parsed.error));
  const v = parsed.data;
  const { error } = await adminClient().from('contact_messages').insert(v);
  if (error) return fail("We couldn't send your message right now. Please try again or email hello@amanitech.in.");
  await Promise.all([email.contactReceived(v.email, v.name), email.notifyAdmin(`Contact form: ${v.audience}`, `${v.name} &lt;${v.email}&gt;: ${v.message}`, '/admin')]);
  return { ok: true, data: { email: v.email } };
}
