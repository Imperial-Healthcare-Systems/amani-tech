import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { StatusBadge } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { fmtDate } from '@/lib/format';
import type { Application, EmployerEnquiry, Job, Testimonial } from '@/lib/types';

export default async function Dashboard() {
  const sb = await createClient();
  const [{ data: m }, { data: apps }, { data: leads }, { data: pending }, { data: jobs }] = await Promise.all([
    sb.rpc('admin_metrics'),
    sb.from('applications').select('*, job:jobs(title), candidate:candidates(name,current_title)').order('applied_at', { ascending: false }).limit(5),
    sb.from('employer_enquiries').select('*').order('created_at', { ascending: false }).limit(5),
    sb.from('testimonials').select('*').eq('status', 'PENDING').order('created_at', { ascending: false }).limit(5),
    sb.from('jobs').select('*, applications(count)').order('created_at', { ascending: false }).limit(5),
  ]);
  const metrics = (m || {}) as Record<string, number>;
  const tiles: [string, string, string, number, string][] = [
    ['/admin/jobs', 'briefcase', '', metrics.active_jobs || 0, 'Active jobs'], ['/admin/applications', 'file', 'green', metrics.applications || 0, 'Total applications'], ['/admin/candidates', 'users', 'blue', metrics.candidates || 0, 'Total candidates'], ['/admin/testimonials', 'star', 'amber', metrics.pending_testimonials || 0, 'Pending testimonials'],
    ['/admin/employers', 'building', '', metrics.employer_enquiries || 0, 'Employer enquiries'], ['/admin/vendors', 'globe', '', metrics.vendor_enquiries || 0, 'Vendor enquiries'], ['/admin/blog', 'message', '', metrics.published_blogs || 0, 'Published blogs'], ['/admin/careers', 'graduation', '', metrics.career_openings || 0, 'Career openings'],
  ];
  const hour = new Date().getHours(); const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <>
      <div className="a-page-head"><div><h2>{greet}</h2><p>Here is what needs your attention today.</p></div><div className="actions"><Link className="btn btn-primary btn-sm" href="/admin/jobs/new"><Icon name="plus" className="icon-sm" />Create Job</Link></div></div>
      <div className="a-stats">{tiles.map(([href, icon, tone, n, label]) => <Link key={label} className="a-stat" href={href}><div className={`ico ${tone}`}><Icon name={icon} /></div><div><b>{n}</b><span>{label}</span></div></Link>)}</div>
      <div className="a-grid-2">
        <div className="a-card"><h3>Recent applications <Link href="/admin/applications">View all</Link></h3><div className="a-table-wrap" style={{ border: 0 }}><table className="a-table" style={{ minWidth: 0 }}><thead><tr><th>Candidate</th><th>Job</th><th>Date</th><th>Status</th></tr></thead><tbody>
          {((apps || []) as (Application & { job: { title: string } | null; candidate: { name: string; current_title: string | null } | null })[]).map(a => <tr key={a.id}><td><span className="primary">{a.candidate?.name}</span><span className="sub">{a.candidate?.current_title}</span></td><td>{a.job?.title}</td><td className="nowrap">{fmtDate(a.applied_at)}</td><td><StatusBadge s={a.status} /></td></tr>)}
          {!apps?.length && <tr><td colSpan={4} className="muted">No applications yet.</td></tr>}
        </tbody></table></div></div>
        <div className="a-card"><h3>Recent employer enquiries <Link href="/admin/employers">View all</Link></h3><div className="a-table-wrap" style={{ border: 0 }}><table className="a-table" style={{ minWidth: 0 }}><thead><tr><th>Company</th><th>Requirement</th><th>Status</th></tr></thead><tbody>
          {((leads || []) as EmployerEnquiry[]).map(e => <tr key={e.id}><td><span className="primary">{e.company_name}</span><span className="sub">{e.full_name} · {e.designation}</span></td><td>{e.job_title} × {e.positions}</td><td><StatusBadge s={e.status} /></td></tr>)}
          {!leads?.length && <tr><td colSpan={3} className="muted">No enquiries yet.</td></tr>}
        </tbody></table></div></div>
        <div className="a-card"><h3>Pending testimonials <Link href="/admin/testimonials">Moderate</Link></h3><div className="a-table-wrap" style={{ border: 0 }}><table className="a-table" style={{ minWidth: 0 }}><thead><tr><th>Reviewer</th><th>Rating</th><th></th></tr></thead><tbody>
          {((pending || []) as Testimonial[]).map(t => <tr key={t.id}><td><span className="primary">{t.name}</span><span className="sub">{t.designation} · {t.company}</span></td><td>{'★'.repeat(t.rating)}</td><td><Link className="btn btn-sm btn-outline" href="/admin/testimonials">Review</Link></td></tr>)}
          {!pending?.length && <tr><td colSpan={3} className="muted">No pending testimonials.</td></tr>}
        </tbody></table></div></div>
        <div className="a-card"><h3>Recent jobs <Link href="/admin/jobs">View all</Link></h3><div className="a-table-wrap" style={{ border: 0 }}><table className="a-table" style={{ minWidth: 0 }}><thead><tr><th>Job</th><th>Applications</th><th>Status</th></tr></thead><tbody>
          {((jobs || []) as (Job & { applications: { count: number }[] })[]).map(j => <tr key={j.id}><td><Link className="primary" href={`/admin/jobs/${j.id}/edit`}>{j.title}</Link><span className="sub">{j.company_name} · {j.location}</span></td><td>{j.applications?.[0]?.count ?? 0}</td><td><StatusBadge s={j.status} /></td></tr>)}
          {!jobs?.length && <tr><td colSpan={3} className="muted">No jobs yet. <Link href="/admin/jobs/new">Create the first one</Link>.</td></tr>}
        </tbody></table></div></div>
      </div>
    </>
  );
}
