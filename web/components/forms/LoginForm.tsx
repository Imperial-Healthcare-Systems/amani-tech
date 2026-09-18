'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Field, FormStatus, SubmitButton, useFormAction } from '../form';
import { forgotPassword, signIn } from '@/lib/actions/public';

export function LoginForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const login = useFormAction(signIn);
  const forgot = useFormAction(forgotPassword);
  if (mode === 'forgot') return (
    <form action={forgot.formAction} onSubmit={forgot.onSubmit} noValidate>
      <FormStatus error={forgot.error} success={forgot.success ? 'If an account exists for that email, a reset link is on its way.' : null} />
      <Field label="Email" name="email" required error={forgot.errors.email} onClear={forgot.clear}><input className="input" id="email" name="email" type="email" required autoComplete="email" /></Field>
      <SubmitButton pending={forgot.pending} className="btn btn-primary btn-block btn-lg">Send reset link</SubmitButton>
      <p className="small center mt-16" style={{ marginBottom: 0 }}><a href="#" onClick={e => { e.preventDefault(); setMode('login'); }}>Back to sign in</a></p>
    </form>
  );
  return (
    <form action={login.formAction} onSubmit={login.onSubmit} noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <FormStatus error={login.error} />
      <Field label="Email" name="email" required error={login.errors.email} onClear={login.clear}><input className="input" id="email" name="email" type="email" required autoComplete="email" /></Field>
      <div className={`field ${login.errors.password ? 'is-invalid' : ''}`}>
        <div className="row between"><label className="req" htmlFor="password">Password</label><a className="small" href="#" onClick={e => { e.preventDefault(); setMode('forgot'); }}>Forgot password?</a></div>
        <input className="input" id="password" name="password" type="password" required data-min-len="1" autoComplete="current-password" onInput={() => login.clear('password')} />
        <span className="error-msg">{login.errors.password}</span>
      </div>
      <SubmitButton pending={login.pending} className="btn btn-primary btn-block btn-lg">Sign in</SubmitButton>
      <p className="small muted center mt-24" style={{ marginBottom: 0 }}>New to Amani Tech? <Link href="/register">Create your profile</Link></p>
    </form>
  );
}
