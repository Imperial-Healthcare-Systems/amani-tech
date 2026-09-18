'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Upload } from '../Upload';
import { CategorySelects } from '../CategorySelects';
import { EXPERIENCE_OPTIONS, Field, FormStatus, SubmitButton, SuccessPanel, useFormAction, validateFields } from '../form';
import { registerCandidate } from '@/lib/actions/public';
import type { Category } from '@/lib/types';

export function RegisterForm({ categories }: { categories: Category[] }) {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLFormElement>(null);
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(registerCandidate);
  const [local, setLocal] = useState<Record<string, string>>({});
  const all = { ...errors, ...local };
  const clearBoth = (n: string) => { clear(n); setLocal(l => { const c = { ...l }; delete c[n]; return c; }); };
  const next = () => { const el = ref.current?.querySelector<HTMLElement>(`[data-step="${step}"]`); if (!el) return; const e = validateFields(el); setLocal(e); if (!Object.keys(e).length) setStep(s => s + 1); };

  if (success) return (
    <div className="form-card"><SuccessPanel title="Registration completed" actions={<><Link className="btn btn-primary" href="/jobs">Find jobs</Link><Link className="btn btn-outline" href="/login">Sign in to your dashboard</Link></>}>
      Check <strong>{success.data?.email}</strong> to confirm your email. Our recruiters will contact you when a suitable role comes up — and you can start applying right away.
    </SuccessPanel></div>
  );

  return (
    <form className="form-card" ref={ref} action={formAction} onSubmit={onSubmit} noValidate>
      <FormStatus error={error} />
      <div className="row between small muted" style={{ marginBottom: 8 }}><span>Step {step + 1} of 3</span></div>
      <div className="stepper" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className={i < step ? 'is-done' : i === step ? 'is-active' : ''} />)}</div>

      <div data-step="0" className={`form-step ${step === 0 ? 'is-active' : ''}`}>
        <h2 style={{ fontSize: 'var(--fs-xl)' }}>Personal details</h2>
        <div className="form-grid">
          <Field label="Full name" name="name" required error={all.name} onClear={clearBoth}><input className="input" id="name" name="name" required autoComplete="name" /></Field>
          <Field label="Email" name="email" required error={all.email} onClear={clearBoth}><input className="input" id="email" name="email" type="email" required autoComplete="email" /></Field>
          <Field label="Phone" name="phone" required error={all.phone} onClear={clearBoth}><input className="input" id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91" /></Field>
          <Field label="Current location" name="location" required error={all.location} onClear={clearBoth}><input className="input" id="location" name="location" required placeholder="City" /></Field>
          <Field label="Create password" name="password" required error={all.password} hint="At least 8 characters" onClear={clearBoth}><input className="input" id="password" name="password" type="password" required data-min-len="8" autoComplete="new-password" /></Field>
        </div>
        <div className="form-nav"><span /><button type="button" className="btn btn-secondary" onClick={next}>Continue</button></div>
      </div>

      <div data-step="1" className={`form-step ${step === 1 ? 'is-active' : ''}`}>
        <h2 style={{ fontSize: 'var(--fs-xl)' }}>Professional details</h2>
        <div className="field"><span className="label req">Profile type</span><div className="radio-group"><label className="radio-pill"><input type="radio" name="profile_type" value="IT" defaultChecked /><span>IT</span></label><label className="radio-pill"><input type="radio" name="profile_type" value="Non-IT" /><span>Non-IT</span></label></div></div>
        <div className="form-grid">
          <CategorySelects categories={categories} errors={all} onClear={clearBoth} />
          <Field label="Total experience" name="experience" required error={all.experience} onClear={clearBoth}><select className="select" id="experience" name="experience" required defaultValue=""><option value="">Select</option>{EXPERIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></Field>
          <Field label="Current or last job title" name="current_title" required error={all.current_title} onClear={clearBoth}><input className="input" id="current_title" name="current_title" required /></Field>
        </div>
        <div className="form-nav"><button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>Back</button><button type="button" className="btn btn-secondary" onClick={next}>Continue</button></div>
      </div>

      <div data-step="2" className={`form-step ${step === 2 ? 'is-active' : ''}`}>
        <h2 style={{ fontSize: 'var(--fs-xl)' }}>Resume</h2>
        <Upload name="resume" label="Upload resume" required error={all.resume} onClear={clearBoth} />
        <Field name="consent" error={all.consent} onClear={clearBoth}><label className="check"><input type="checkbox" name="consent" required /><span>I agree to the <Link href="/privacy" target="_blank">Privacy Policy</Link> and <Link href="/terms" target="_blank">Terms of Use</Link>, and consent to Amani Tech contacting me about relevant roles.</span></label></Field>
        <div className="form-nav"><button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Back</button><SubmitButton pending={pending}>Create my profile</SubmitButton></div>
      </div>
    </form>
  );
}
