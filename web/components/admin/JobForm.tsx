'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { CategorySelects } from '../CategorySelects';
import { Field, FormStatus, useFormAction } from '../form';
import { useToast } from '../Toast';
import { PageHead, TagInput } from './shared';
import { saveJob } from '@/lib/actions/admin';
import type { Category, Job, JobStatus } from '@/lib/types';

export function JobForm({ job, categories }: { job: Job | null; categories: Category[] }) {
  const [status, setStatus] = useState<JobStatus>(job?.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
  const [dirty, setDirty] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter(); const toast = useToast();
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(saveJob.bind(null, job?.id ?? null, status));
  useEffect(() => { if (success?.ok) { toast(status === 'PUBLISHED' ? 'Job published. It is now live on the site.' : 'Draft saved.'); setDirty(false); if (!job) router.replace(`/admin/jobs/${success.data?.id}/edit`); else router.refresh(); } }, [success, status, job, router, toast]);
  const submitAs = (s: JobStatus) => { setStatus(s); setTimeout(() => ref.current?.requestSubmit(), 0); };
  const cats = categories.map(c => ({ ...c, subcategories: (c.subcategories || []).filter(s => s.is_active) }));

  return (
    <>
      <PageHead title={job ? job.title : 'New job'} text={job ? `${job.id.slice(0, 8)} · ${job.status}` : 'Fill in the details, save as draft, then publish when ready.'} actions={<>{dirty && <span className="unsaved is-visible"><Icon name="alert" className="icon-sm" />Unsaved changes</span>}<StatusBadge s={job?.status || 'DRAFT'} /></>} />
      <form ref={ref} action={formAction} onSubmit={onSubmit} onInput={() => setDirty(true)} noValidate className="a-form-layout">
        <div className="stack" style={{ gap: 16 }}>
          <FormStatus error={error} />
          <div className="a-card"><h3>Basics</h3><div className="form-grid">
            <Field label="Job title" name="title" required error={errors.title} onClear={clear} className="span-2"><input className="input" id="title" name="title" required defaultValue={job?.title} placeholder="e.g. Senior Java Developer" /></Field>
            <Field label="Company name" name="company_name" required error={errors.company_name} hint="Shown publicly. Use a descriptor (e.g. “Finserv Product Company”) if the client is confidential." onClear={clear}><input className="input" id="company_name" name="company_name" required defaultValue={job?.company_name} /></Field>
            <Field label="Location" name="location" required error={errors.location} onClear={clear}><input className="input" id="location" name="location" required defaultValue={job?.location} placeholder="City or Remote" /></Field>
            <CategorySelects categories={cats} errors={errors} onClear={clear} defaultCategory={job?.category_id || ''} defaultSubcategory={job?.subcategory_id || ''} />
            <Field label="Work mode" name="work_mode" required onClear={clear}><select className="select" id="work_mode" name="work_mode" defaultValue={job?.work_mode || 'On-site'}><option>On-site</option><option>Hybrid</option><option>Remote</option></select></Field>
            <Field label="Employment type" name="employment_type" required onClear={clear}><select className="select" id="employment_type" name="employment_type" defaultValue={job?.employment_type || 'Full-time'}><option>Full-time</option><option>Contract</option><option>Part-time</option><option>Internship</option></select></Field>
          </div></div>
          <div className="a-card"><h3>Experience &amp; compensation</h3><div className="form-grid">
            <Field label="Experience (years) — min" name="exp_min" required error={errors.exp_min} onClear={clear}><input className="input" id="exp_min" name="exp_min" type="number" min={0} required defaultValue={job?.exp_min ?? 0} /></Field>
            <Field label="Experience (years) — max" name="exp_max" required error={errors.exp_max} onClear={clear}><input className="input" id="exp_max" name="exp_max" type="number" min={0} required defaultValue={job?.exp_max ?? 2} /></Field>
            <Field label="Salary / CTC — min (LPA)" name="salary_min" hint="Leave blank to show “Not disclosed”." onClear={clear}><input className="input" id="salary_min" name="salary_min" type="number" min={0} step={0.5} defaultValue={job?.salary_min ?? ''} /></Field>
            <Field label="Salary / CTC — max (LPA)" name="salary_max" onClear={clear}><input className="input" id="salary_max" name="salary_max" type="number" min={0} step={0.5} defaultValue={job?.salary_max ?? ''} /></Field>
          </div></div>
          <div className="a-card"><h3>Description</h3>
            <Field label="Job description" name="description" required error={errors.description} onClear={clear}><textarea className="textarea" id="description" name="description" required data-min-len="20" defaultValue={job?.description} /></Field>
            <Field label="Responsibilities" name="responsibilities" hint="One item per line — shown as a bulleted list." onClear={clear}><textarea className="textarea" id="responsibilities" name="responsibilities" defaultValue={job?.responsibilities.join('\n')} placeholder="One per line" /></Field>
            <Field label="Requirements" name="requirements" onClear={clear}><textarea className="textarea" id="requirements" name="requirements" defaultValue={job?.requirements.join('\n')} placeholder="One per line" /></Field>
            <Field label="Qualification" name="qualification" onClear={clear}><input className="input" id="qualification" name="qualification" defaultValue={job?.qualification || ''} placeholder="e.g. B.E. / B.Tech in Computer Science" /></Field>
            <Field label="Benefits" name="benefits" onClear={clear}><textarea className="textarea" id="benefits" name="benefits" style={{ minHeight: 80 }} defaultValue={job?.benefits.join('\n')} placeholder="One per line" /></Field>
            <Field label="Required skills" name="skills" required error={errors.skills} hint="Used for search and shown on the job card (first 4)." onClear={clear}><TagInput name="skills" initial={job?.skills || []} placeholder="Type a skill and press Enter" /></Field>
          </div>
        </div>
        <div className="stack a-sticky" style={{ gap: 16 }}>
          <div className="a-card"><h3>Publishing</h3>
            <Field label="Application deadline" name="application_deadline" required error={errors.application_deadline} onClear={clear}><input className="input" id="application_deadline" name="application_deadline" type="date" required defaultValue={job?.application_deadline || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)} /></Field>
            <Field label="Job source" name="job_source" onClear={clear}><select className="select" id="job_source" name="job_source" defaultValue={job?.job_source || 'Direct client'}><option>Direct client</option><option>Staffing partner</option><option>Campus partner</option><option>Internal</option></select></Field>
            <div className="field"><label className="switch"><input type="checkbox" name="is_featured" defaultChecked={job?.is_featured} /><span className="track" />Feature on homepage</label></div>
            <div className="stack" style={{ gap: 8, marginTop: 8 }}>
              <button type="button" className={`btn btn-primary btn-block ${pending && status === 'PUBLISHED' ? 'is-loading' : ''}`} disabled={pending} onClick={() => submitAs('PUBLISHED')}><span className="spinner" />{job?.status === 'PUBLISHED' ? 'Update & keep live' : 'Publish job'}</button>
              <button type="button" className={`btn btn-outline btn-block ${pending && status === 'DRAFT' ? 'is-loading' : ''}`} disabled={pending} onClick={() => submitAs('DRAFT')}><span className="spinner" />{job?.status === 'PUBLISHED' ? 'Unpublish & save draft' : 'Save as draft'}</button>
              {job && <a className="btn btn-ghost btn-block" href={`/jobs/${job.slug}`} target="_blank"><Icon name="eye" className="icon-sm" />Preview</a>}
            </div>
          </div>
          <div className="preview-box"><strong style={{ color: 'var(--a-text)' }}>Before publishing</strong><ul style={{ margin: '8px 0 0', paddingLeft: 18 }}><li>Company name is client-approved</li><li>Salary range is agreed or left blank</li><li>Deadline is realistic</li></ul></div>
        </div>
      </form>
    </>
  );
}
