'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { Field, FormStatus, useFormAction } from '../form';
import { useToast } from '../Toast';
import { PageHead } from './shared';
import { saveOpening } from '@/lib/actions/admin';
import type { CareerOpening, ContentStatus } from '@/lib/types';

export function OpeningEditor({ opening: o }: { opening: CareerOpening | null }) {
  const [status, setStatus] = useState<ContentStatus>(o?.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'); const [dirty, setDirty] = useState(false);
  const ref = useRef<HTMLFormElement>(null); const router = useRouter(); const toast = useToast();
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(saveOpening.bind(null, o?.id ?? null, status));
  useEffect(() => { if (success?.ok) { toast(status === 'PUBLISHED' ? 'Opening published on the careers page.' : 'Draft saved.'); setDirty(false); if (!o) router.replace(`/admin/careers/${success.data?.id}/edit`); else router.refresh(); } }, [success, status, o, router, toast]);
  const submitAs = (s: ContentStatus) => { setStatus(s); setTimeout(() => ref.current?.requestSubmit(), 0); };
  return (
    <>
      <PageHead title={o ? o.position : 'New opening'} text="A role on the Amani Tech team." actions={<>{dirty && <span className="unsaved is-visible"><Icon name="alert" className="icon-sm" />Unsaved changes</span>}<StatusBadge s={o?.status || 'DRAFT'} /></>} />
      <form ref={ref} action={formAction} onSubmit={onSubmit} onInput={() => setDirty(true)} noValidate className="a-form-layout">
        <div className="stack" style={{ gap: 16 }}>
          <FormStatus error={error} />
          <div className="a-card">
            <div className="form-grid">
              <Field label="Position" name="position" required error={errors.position} onClear={clear} className="span-2"><input className="input" id="position" name="position" required defaultValue={o?.position} /></Field>
              <Field label="Department" name="department" required onClear={clear}><select className="select" id="department" name="department" defaultValue={o?.department || 'Recruitment'}><option>Recruitment</option><option>Client Services</option><option>Technology</option><option>Operations</option><option>Finance</option></select></Field>
              <Field label="Location" name="location" required error={errors.location} onClear={clear}><input className="input" id="location" name="location" required defaultValue={o?.location} /></Field>
              <Field label="Work mode" name="work_mode" required onClear={clear}><select className="select" id="work_mode" name="work_mode" defaultValue={o?.work_mode || 'On-site'}><option>On-site</option><option>Hybrid</option><option>Remote</option></select></Field>
              <Field label="Experience" name="experience" required error={errors.experience} onClear={clear}><input className="input" id="experience" name="experience" required defaultValue={o?.experience} placeholder="e.g. 2–4 years" /></Field>
            </div>
            <Field label="Description" name="description" required error={errors.description} onClear={clear}><textarea className="textarea" id="description" name="description" required data-min-len="20" defaultValue={o?.description} /></Field>
            <Field label="Responsibilities" name="responsibilities" onClear={clear}><textarea className="textarea" id="responsibilities" name="responsibilities" defaultValue={o?.responsibilities.join('\n')} placeholder="One per line" /></Field>
            <Field label="Requirements" name="requirements" onClear={clear}><textarea className="textarea" id="requirements" name="requirements" defaultValue={o?.requirements.join('\n')} placeholder="One per line" /></Field>
            <Field label="Benefits" name="benefits" onClear={clear}><textarea className="textarea" id="benefits" name="benefits" style={{ minHeight: 80 }} defaultValue={o?.benefits.join('\n')} placeholder="One per line" /></Field>
            <Field label="Application instructions" name="application_instructions" required error={errors.application_instructions} onClear={clear}><textarea className="textarea" id="application_instructions" name="application_instructions" required data-min-len="10" style={{ minHeight: 80 }} defaultValue={o?.application_instructions} placeholder="e.g. Email your resume to careers@amanitech.in with the subject line…" /></Field>
          </div>
        </div>
        <div className="stack a-sticky" style={{ gap: 16 }}>
          <div className="a-card"><h3>Publishing</h3><div className="stack" style={{ gap: 8 }}>
            <button type="button" className={`btn btn-primary btn-block ${pending && status === 'PUBLISHED' ? 'is-loading' : ''}`} disabled={pending} onClick={() => submitAs('PUBLISHED')}><span className="spinner" />Publish</button>
            <button type="button" className={`btn btn-outline btn-block ${pending && status === 'DRAFT' ? 'is-loading' : ''}`} disabled={pending} onClick={() => submitAs('DRAFT')}><span className="spinner" />Save draft</button>
            {o && <a className="btn btn-ghost btn-block" href={`/careers/${o.slug}`} target="_blank"><Icon name="eye" className="icon-sm" />Preview</a>}
          </div></div>
        </div>
      </form>
    </>
  );
}
