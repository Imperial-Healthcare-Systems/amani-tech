import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { StatusBadge } from '@/components/cards';
import { requireCandidate } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/public';
import { signedUrl } from '@/lib/files';
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
  const photo = c?.photo_path ? await signedUrl('photos', c.photo_path).catch(() => null) : null;
  const skills = c?.skills || [];
  const checks: [string, boolean][] = [
    ['Basic details', !!c], ['Profile photo', !!c?.photo_path], ['Resume', !!c?.resume_path],
    ['Skills', skills.length > 0], ['Education', (c?.education || []).length > 0], ['Summary', !!c?.summary],
  ];
  const pct = Math.round((checks.filter(([, ok]) => ok).length / checks.length) * 100);

  return (
    <>
      <section className="page-hero" style={{ padding: '32px 0' }}><div className="container row between">
        <div className="profile-head"><div className="avatar">{photo ? <img src={photo} alt="" /> : initials(name)}</div><div><h1>{name}</h1><p className="muted" style={{ margin: 0 }}>{[c?.current_title, c?.location, c?.profile_type].filter(Boolean).join(' · ')}</p></div></div>
        <div className="row"><Link className="btn btn-outline btn-sm" href="/candidate/settings"><Icon name="edit" className="icon-sm" />Edit profile</Link><form action={signOut}><button className="btn btn-ghost btn-sm" type="submit"><Icon name="logout" className="icon-sm" />Sign out</button></form></div>
      </div></section>
      <section className="section" style={{ paddingTop: 32 }}><div className="container dash-grid">
        <div className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="row between"><h2 className="card-title" style={{ margin: 0 }}>Profile</h2><span className="small muted">{pct}% complete</span></div>
            <div className="completeness" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
            <ul className="checklist">{checks.map(([label, ok]) => <li key={label} className={ok ? 'done' : ''}><Icon name={ok ? 'check' : 'plus'} />{label}</li>)}</ul>
            {c ? (
              <dl className="dl mt-16">
                <div><dt>Email</dt><dd>{c.email}</dd></div><div><dt>Phone</dt><dd>{c.phone}</dd></div><div><dt>Location</dt><dd>{c.location}</dd></div>
                <div><dt>Category</dt><dd>{c.category?.name || '—'}{c.subcategory ? ` · ${c.subcategory.name}` : ''}</dd></div><div><dt>Experience</dt><dd>{c.experience || '—'}</dd></div>
                {skills.length > 0 && <div><dt>Skills</dt><dd className="skill-chips">{skills.map(s => <span key={s} className="tag">{s}</span>)}</dd></div>}
                <div><dt>Member since</dt><dd>{fmtDate(c.created_at)}</dd></div>
              </dl>
            ) : <p className="small muted mt-16">Add your details so recruiters can match you to roles.</p>}
            <Link className="btn btn-secondary btn-sm mt-16" href="/candidate/settings">{c ? 'Edit profile' : 'Complete your profile'}</Link>
          </div>
          <div className="card">
            <h2 className="card-title">Resume</h2>
            {c?.resume_name ? <div className="upload-file is-visible" style={{ margin: 0 }}><Icon name="file" /><span className="name">{c.resume_name}</span></div> : <p className="small muted" style={{ margin: 0 }}>No resume on file yet.</p>}
            <Link className="link mt-16" href="/candidate/settings" style={{ display: 'inline-flex' }}>{c?.resume_name ? 'Replace resume' : 'Upload resume'} <Icon name="arrow" /></Link>
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
