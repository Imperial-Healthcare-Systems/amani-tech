import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter } from '@/components/motion';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = { title: 'Candidate Login', robots: { index: false, follow: true } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return (
    <div className="container auth-wrap">
      <Enter><div className="form-card">
        <h1>Welcome back</h1><p className="muted">Sign in to track your applications.</p>
        {error === 'link' && <div className="form-status error is-visible"><Icon name="alert" /><span>That link has expired or was already used. Please sign in or request a new one.</span></div>}
        <LoginForm next={next} />
      </div></Enter>
      <p className="small muted center mt-16"><Icon name="lock" className="icon-sm" /> Your data is protected. See our <Link href="/privacy">Privacy Policy</Link>.</p>
    </div>
  );
}
