import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { StatusBadge } from '@/components/cards';
import { ProfileForm, ResumeForm } from '@/components/forms/DashboardForms';
import { requireCandidate } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/public';
import { fmtDate, initials } from '@/lib/format';
import type { Application, Candidate } from '@/lib/types';

export const metadata: Metadata = { title: 'My Dashboard', robots: { index: false, follow: false } };

export default async function Dashboard() {
  const user = await requireCandidate();
  const sb = await createClient();
  const { data: cand } = await sb.from('candidates').select('*, category:categories(name), subcategory:subcategories(name)').eq('user_id', user.id).maybeSingle();
  const c = cand as Candidate | null;
  const { data: apps } = c ? await sb.from('applications').select('*, job:jobs(id,title,company_name,location,slug)').eq('candidate_id', c.id).order('applied_at', { ascending: false }) : { data: [] };
  const applications = (apps || []) as Application[];
  const name = c?.name || user.user_metadata?.name || user.email || 'Candidate';

  return (
    <>
      <section className="page-hero" style={{ padding: '32px 0' }}><div className="container row between">
        <div className="profile-head"><div className="avatar">{initials(name)}</div><div><h1>{name}</h1><p className="muted" style={{ margin: 0 }}>{[c?.current_title, c?.location, c?.profile_type].filter(Boolean).join(' · ')}</p></div></div>
        <form action={signOut}><button className="btn btn-ghost" type="submit"><Icon name="logout" />Sign out</button></form>
      </div></section>
      <section className="section" style={{ paddingTop: 32 }}><div className="container dash-grid">
        <div className="stack" style={{ gap: 16 }}>
          <div className="card">
            <h2 style={{ fontSize: 'var(--fs-lg)' }}>Profile</h2>
            {c ? (<>
              <dl className="dl">
                <div><dt>Email</dt><dd>{c.email}</dd></div><div><dt>Phone</dt><dd>{c.phone}</dd></div><div><dt>Location</dt><dd>{c.location}</dd></div>
                <div><dt>Category</dt><dd>{c.category?.name || '—'}{c.subcategory ? ` · ${c.subcategory.name}` : ''}</dd></div><div><dt>Experience</dt><dd>{c.experience || '—'}</dd></div><div><dt>Member since</dt><dd>{fmtDate(c.created_at)}</dd></div>
              </dl>
              <details className="mt-16"><summary className="link" style={{ cursor: 'pointer' }}>Edit details</summary><ProfileForm phone={c.phone} location={c.location} title={c.current_title || ''} /></details>
            </>) : <p className="muted small">Complete your profile by applying to a job or <Link href="/register">registering</Link>.</p>}
          </div>
          <div className="card">
            <h2 style={{ fontSize: 'var(--fs-lg)' }}>Resume</h2>
            {c?.resume_name && <div className="upload-file is-visible" style={{ margin: '0 0 12px' }}><Icon name="file" /><span className="name">{c.resume_name}</span></div>}
            <ResumeForm />
          </div>
        </div>
        <div>
          <div className="row between" style={{ marginBottom: 12 }}><h2 style={{ fontSize: 'var(--fs-xl)', margin: 0 }}>My applications</h2><Link className="btn btn-primary btn-sm" href="/jobs">Find more jobs</Link></div>
          {applications.length ? (
            <div className="table-wrap"><table className="table"><thead><tr><th>Job</th><th>Location</th><th>Applied</th><th>Status</th></tr></thead><tbody>
              {applications.map(a => <tr key={a.id}><td><Link href={`/jobs/${a.job?.slug}`}>{a.job?.title}</Link><div className="small muted">{a.job?.company_name}</div></td><td>{a.job?.location}</td><td>{fmtDate(a.applied_at)}</td><td><StatusBadge s={a.status} /></td></tr>)}
            </tbody></table></div>
          ) : <div className="empty"><div className="ico"><Icon name="briefcase" /></div><h3>No applications yet</h3><p>Browse open roles and apply in under two minutes.</p><Link className="btn btn-primary" href="/jobs">Find Jobs</Link></div>}
          <div className="card mt-24" style={{ background: 'var(--navy-50)', borderColor: 'transparent' }}>
            <strong style={{ color: 'var(--navy-900)' }}>What the statuses mean</strong>
            <ul className="small muted mt-8" style={{ marginBottom: 0, display: 'grid', gap: 4 }}><li><b>Submitted</b> — received; a recruiter will review it.</li><li><b>Reviewing</b> — a recruiter is assessing fit for the role.</li><li><b>Shortlisted</b> — your profile has been shared with the employer.</li><li><b>Rejected / Closed</b> — not taken forward for this role. We will consider you for others.</li></ul>
          </div>
        </div>
      </div></section>
    </>
  );
}
