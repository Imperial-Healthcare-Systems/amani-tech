import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/motion';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { getCategories } from '@/lib/queries';

export const metadata: Metadata = { title: 'Register as a Candidate', description: 'Create your candidate profile once and apply to any role with a single click.', robots: { index: false, follow: true } };

export default async function RegisterPage() {
  const categories = await getCategories();
  return (
    <section className="section" style={{ paddingTop: 48 }}><div className="container form-layout">
      <Reveal><div className="aside-info">
        <div><span className="eyebrow">Candidates</span><h1 style={{ fontSize: 'var(--fs-4xl)' }}>Create your candidate profile</h1><p className="lead">Register once. Apply to any role with a single click, and let our recruiters find you for roles you have not seen yet.</p></div>
        <div className="info-item"><div className="ico"><Icon name="check" /></div><div><strong>No fees, ever</strong><p>Amani Tech never charges job seekers.</p></div></div>
        <div className="info-item"><div className="ico"><Icon name="shield" /></div><div><strong>Your resume stays private</strong><p>Shared only with employers for roles you apply to.</p></div></div>
        <div className="info-item"><div className="ico"><Icon name="user" /></div><div><strong>A real recruiter reviews your profile</strong><p>Not a keyword filter.</p></div></div>
        <p className="small muted">Already registered? <Link href="/login">Sign in</Link></p>
      </div></Reveal>
      <Reveal delay={0.1}><RegisterForm categories={categories} /></Reveal>
    </div></section>
  );
}
