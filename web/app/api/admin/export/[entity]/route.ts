import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { toCsv } from '@/lib/files';
import { fmtDateTime, salary } from '@/lib/format';
import type { Application, Candidate, EmployerEnquiry, Job, VendorEnquiry } from '@/lib/types';

/** CSV export for admin lists. Auth + role checked; no internal notes exported. */
export async function GET(_: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  await requireAdmin();
  const { entity } = await params;
  const sb = await createClient();
  let rows: Record<string, unknown>[] = [];

  if (entity === 'applications') {
    const { data } = await sb.from('applications').select('*, job:jobs(title,company_name), candidate:candidates(*, category:categories(name), subcategory:subcategories(name))').order('applied_at', { ascending: false });
    rows = ((data || []) as Application[]).map(a => ({ Name: a.candidate?.name, Email: a.candidate?.email, Phone: a.candidate?.phone, Location: a.candidate?.location, Category: a.candidate?.category?.name, Subcategory: a.candidate?.subcategory?.name, Experience: a.candidate?.experience, 'Current Job Title': a.candidate?.current_title, 'Applied Job': a.job?.title, Company: a.job?.company_name, 'Application Date': fmtDateTime(a.applied_at), Status: a.status }));
  } else if (entity === 'candidates') {
    const { data } = await sb.from('candidates').select('*, category:categories(name), subcategory:subcategories(name), applications(count)').order('created_at', { ascending: false });
    rows = ((data || []) as (Candidate & { applications: { count: number }[] })[]).map(c => ({ Name: c.name, Email: c.email, Phone: c.phone, Location: c.location, 'Profile Type': c.profile_type, Category: c.category?.name, Subcategory: c.subcategory?.name, Experience: c.experience, 'Current Job Title': c.current_title, Applications: c.applications?.[0]?.count ?? 0, Registered: fmtDateTime(c.created_at) }));
  } else if (entity === 'employers') {
    const { data } = await sb.from('employer_enquiries').select('*').order('created_at', { ascending: false });
    rows = ((data || []) as EmployerEnquiry[]).map(e => ({ Reference: e.reference, Company: e.company_name, Contact: e.full_name, Designation: e.designation, Email: e.work_email, Phone: e.phone, 'Requirement Type': e.requirement_type, Position: e.job_title, Positions: e.positions, Location: e.location, 'Work Mode': e.work_mode, Experience: e.experience_required, Timeline: e.joining_timeline, Received: fmtDateTime(e.created_at), Status: e.status }));
  } else if (entity === 'vendors') {
    const { data } = await sb.from('vendor_enquiries').select('*').order('created_at', { ascending: false });
    rows = ((data || []) as VendorEnquiry[]).map(v => ({ Company: v.company, Contact: v.contact_person, Email: v.email, Phone: v.phone, Location: v.location, Services: v.services.join('; '), Specialisation: v.specialization, 'Years of Experience': v.years_experience, Website: v.website, Received: fmtDateTime(v.created_at), Status: v.status }));
  } else if (entity === 'jobs') {
    const { data } = await sb.from('jobs').select('*, category:categories(name), subcategory:subcategories(name)').order('created_at', { ascending: false });
    rows = ((data || []) as Job[]).map(j => ({ Title: j.title, Company: j.company_name, Category: j.category?.name, Subcategory: j.subcategory?.name, Location: j.location, 'Work Mode': j.work_mode, Type: j.employment_type, Experience: `${j.exp_min}–${j.exp_max}`, Salary: salary(j), Status: j.status, Featured: j.is_featured ? 'Yes' : 'No', Posted: j.published_at ? fmtDateTime(j.published_at) : '', Deadline: j.application_deadline }));
  } else return NextResponse.json({ error: 'Unknown export' }, { status: 404 });

  return new NextResponse(toCsv(rows), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="amani-${entity}-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
