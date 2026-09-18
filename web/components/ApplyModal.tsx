'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import { Upload } from './Upload';
import { CategorySelects } from './CategorySelects';
import { EXPERIENCE_OPTIONS, Field, FormStatus, SubmitButton, SuccessPanel, useFormAction, validateFields } from './form';
import { submitApplication } from '@/lib/actions/public';
import type { Category, Job } from '@/lib/types';

export function ApplyModal({ job, categories, prefill }: { job: Job; categories: Category[]; prefill?: { name: string; email: string; phone: string; location: string } | null }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [stickyVisible, setSticky] = useState(false);
  const stepsRef = useRef<HTMLFormElement>(null);
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(submitApplication);
  const [localErr, setLocalErr] = useState<Record<string, string>>({});
  const allErrors = { ...errors, ...localErr };

  useEffect(() => { const head = document.getElementById('job-head'); if (!head) return; const io = new IntersectionObserver(en => setSticky(!en[0].isIntersecting)); io.observe(head); return () => io.disconnect(); }, []);
  useEffect(() => { const h = (e: Event) => { if ((e.target as HTMLElement).closest('[data-apply]')) setOpen(true); }; document.addEventListener('click', h); return () => document.removeEventListener('click', h); }, []);

  const next = () => { const el = stepsRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`); if (!el) return; const errs = validateFields(el); setLocalErr(errs); if (!Object.keys(errs).length) setStep(s => s + 1); };
  const clearBoth = (n: string) => { clear(n); setLocalErr(l => { const c = { ...l }; delete c[n]; return c; }); };

  return (
    <>
      <div className={`sticky-apply ${stickyVisible ? 'is-visible' : ''}`}>
        <div className="info"><strong>{job.title}</strong><small>{job.company_name} · {job.location}</small></div>
        <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Apply Now</button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={<>Apply for {job.title}</>} subtitle={`${job.company_name} · ${job.location}`} labelledBy="apply-title">
        <div className="dialog-body">
          {success ? (
            <SuccessPanel title="Application received" actions={<><Link className="btn btn-outline" href="/jobs">Browse more jobs</Link><Link className="btn btn-primary" href="/candidate/dashboard">Go to my dashboard</Link></>}>
              We&apos;ve sent a confirmation to <strong>{success.data?.email}</strong>. A recruiter will review your application and get in touch if the role is a fit.
            </SuccessPanel>
          ) : (
            <form action={formAction} onSubmit={onSubmit} noValidate ref={stepsRef}>
              <input type="hidden" name="job_id" value={job.id} />
              <FormStatus error={error} />
              <div className="row between small muted" style={{ marginBottom: 8 }}><span>Step {step + 1} of 3</span><span>All fields required unless marked optional</span></div>
              <div className="stepper" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className={i < step ? 'is-done' : i === step ? 'is-active' : ''} />)}</div>
              <div>
                  <div data-step="0" className={`form-step ${step === 0 ? 'is-active' : ''}`}>
                    <h3 style={{ fontSize: 'var(--fs-lg)' }}>Personal details</h3>
                    <div className="form-grid">
                      <Field label="Full name" name="name" required error={allErrors.name} onClear={clearBoth}><input className="input" id="name" name="name" required autoComplete="name" defaultValue={prefill?.name} /></Field>
                      <Field label="Email" name="email" required error={allErrors.email} onClear={clearBoth}><input className="input" id="email" name="email" type="email" required autoComplete="email" defaultValue={prefill?.email} /></Field>
                      <Field label="Phone" name="phone" required error={allErrors.phone} onClear={clearBoth}><input className="input" id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91" defaultValue={prefill?.phone} /></Field>
                      <Field label="Current location" name="location" required error={allErrors.location} onClear={clearBoth}><input className="input" id="location" name="location" required placeholder="City" defaultValue={prefill?.location} /></Field>
                    </div>
                    <div className="form-nav"><span /><button type="button" className="btn btn-secondary" onClick={next}>Continue</button></div>
                  </div>
                  <div data-step="1" className={`form-step ${step === 1 ? 'is-active' : ''}`}>
                    <h3 style={{ fontSize: 'var(--fs-lg)' }}>Professional details</h3>
                    <div className="field"><span className="label req">Profile type</span><div className="radio-group"><label className="radio-pill"><input type="radio" name="profile_type" value="IT" defaultChecked /><span>IT</span></label><label className="radio-pill"><input type="radio" name="profile_type" value="Non-IT" /><span>Non-IT</span></label></div></div>
                    <div className="form-grid">
                      <CategorySelects categories={categories} errors={allErrors} onClear={clearBoth} defaultCategory={job.category_id || ''} defaultSubcategory={job.subcategory_id || ''} />
                      <Field label="Total experience" name="experience" required error={allErrors.experience} onClear={clearBoth}><select className="select" id="experience" name="experience" required defaultValue=""><option value="">Select</option>{EXPERIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></Field>
                      <Field label="Current or last job title" name="current_title" required error={allErrors.current_title} onClear={clearBoth}><input className="input" id="current_title" name="current_title" required /></Field>
                    </div>
                    <div className="form-nav"><button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>Back</button><button type="button" className="btn btn-secondary" onClick={next}>Continue</button></div>
                  </div>
                  <div data-step="2" className={`form-step ${step === 2 ? 'is-active' : ''}`}>
                    <h3 style={{ fontSize: 'var(--fs-lg)' }}>Resume</h3>
                    <Upload name="resume" label="Upload resume" required error={allErrors.resume} onClear={clearBoth} />
                    <Field name="consent" error={allErrors.consent} onClear={clearBoth}><label className="check"><input type="checkbox" name="consent" required /><span>I agree to the <Link href="/privacy" target="_blank">Privacy Policy</Link> and consent to Amani Tech contacting me about this and similar roles.</span></label></Field>
                    <div className="form-nav"><button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Back</button><SubmitButton pending={pending}>Submit Application</SubmitButton></div>
                  </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
