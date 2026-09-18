import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PhotoForm, ProfileSettingsForm, ResumeForm } from '@/components/forms/DashboardForms';
import { requireCandidate } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/queries';
import { signedUrl } from '@/lib/files';
import { initials } from '@/lib/format';
import type { Candidate } from '@/lib/types';

export const metadata: Metadata = { title: 'Profile settings', robots: { index: false, follow: false } };

export default async function Settings() {
  const user = await requireCandidate();
  const sb = await createClient();
  const [{ data: cand }, categories] = await Promise.all([sb.from('candidates').select('*').eq('user_id', user.id).maybeSingle(), getCategories()]);
  const c = cand as Candidate | null;
  const photo = c?.photo_path ? await signedUrl('photos', c.photo_path).catch(() => null) : null;
  const name = c?.name || user.user_metadata?.name || user.email || 'Candidate';

  return (
    <>
      <section className="page-hero" style={{ padding: '32px 0' }}><div className="container">
        <p className="small" style={{ margin: '0 0 6px' }}><Link className="link" href="/candidate/dashboard"><span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}><Icon name="arrow" className="icon-sm" /></span> Back to dashboard</Link></p>
        <h1 style={{ fontSize: 'var(--fs-2xl)', margin: 0 }}>Profile settings</h1>
        <p className="muted" style={{ margin: '6px 0 0' }}>A complete profile helps our recruiters match you to the right roles.</p>
      </div></section>
      <section className="section" style={{ paddingTop: 32 }}><div className="container dash-grid">
        <div className="stack" style={{ gap: 16 }}>
          <div className="card">
            <h2 className="card-title">Photo</h2>
            <div className="photo-row"><div className="avatar avatar-lg">{photo ? <img src={photo} alt="" /> : initials(name)}</div><p className="small muted" style={{ margin: 0 }}>Shown to recruiters alongside your profile.</p></div>
            {c ? <PhotoForm hasPhoto={!!c.photo_path} /> : <p className="small muted" style={{ margin: 0 }}>Save your basic details first, then add a photo.</p>}
          </div>
          <div className="card">
            <h2 className="card-title">Resume</h2>
            {c?.resume_name && <div className="upload-file is-visible" style={{ margin: '0 0 12px' }}><Icon name="file" /><span className="name">{c.resume_name}</span></div>}
            {c ? <ResumeForm /> : <p className="small muted" style={{ margin: 0 }}>Save your basic details first, then upload your resume.</p>}
          </div>
        </div>
        <ProfileSettingsForm c={c} email={user.email || ''} categories={categories} />
      </div></section>
    </>
  );
}
