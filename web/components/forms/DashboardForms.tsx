'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from '../Upload';
import { CategorySelects } from '../CategorySelects';
import { EXPERIENCE_OPTIONS, Field, FormStatus, SubmitButton, useFormAction } from '../form';
import { TagInput } from '../admin/shared';
import { Icon } from '../Icon';
import { useToast } from '../Toast';
import { removePhoto, replaceResume, saveCandidateProfile, uploadPhoto } from '@/lib/actions/public';
import type { Candidate, Category, Education, WorkItem } from '@/lib/types';

export const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '60 days', '90 days'];

function useSaved(success: unknown, msg: string) {
  const toast = useToast(); const router = useRouter();
  useEffect(() => { if (success) { toast(msg); router.refresh(); } }, [success, toast, router, msg]);
}

export function ResumeForm() {
  const f = useFormAction(replaceResume); useSaved(f.success, 'Resume updated.');
  return (
    <form action={f.formAction} onSubmit={f.onSubmit} noValidate>
      <FormStatus error={f.error} />
      <Upload name="resume" label="Replace resume" required error={f.errors.resume} onClear={f.clear} />
      <SubmitButton pending={f.pending} className="btn btn-outline btn-sm">Upload new resume</SubmitButton>
    </form>
  );
}

export function PhotoForm({ hasPhoto }: { hasPhoto: boolean }) {
  const f = useFormAction(uploadPhoto); useSaved(f.success, 'Photo updated.');
  const toast = useToast(); const router = useRouter();
  return (
    <form action={f.formAction} onSubmit={f.onSubmit} noValidate>
      <FormStatus error={f.error} />
      <Upload name="photo" kind="image" maxMb={2} label={hasPhoto ? 'Replace photo' : 'Profile photo'} hint="JPG, PNG or WEBP · square works best · up to 2 MB" required error={f.errors.photo} onClear={f.clear} />
      <div className="row">
        <SubmitButton pending={f.pending} className="btn btn-outline btn-sm">Upload photo</SubmitButton>
        {hasPhoto && <button type="button" className="btn btn-ghost btn-sm" onClick={async () => { await removePhoto(); toast('Photo removed.'); router.refresh(); }}>Remove photo</button>}
      </div>
    </form>
  );
}

type FieldDef = { key: string; label: string; placeholder?: string; type?: 'text' | 'textarea'; span?: boolean; required?: boolean };

/** Repeatable rows (education, work history) serialised to one hidden JSON field. Inputs carry no `name`, so client validation skips them. */
function RowsEditor<T extends Record<string, string>>({ name, initial, blank, fields, addLabel, empty }: { name: string; initial: T[]; blank: T; fields: FieldDef[]; addLabel: string; empty: string }) {
  const [rows, setRows] = useState<T[]>(initial);
  const set = (i: number, k: string, v: string) => setRows(r => r.map((row, j) => j === i ? { ...row, [k]: v } : row));
  return (
    <div className="rows-editor">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      {rows.length === 0 && <p className="small muted" style={{ margin: 0 }}>{empty}</p>}
      {rows.map((row, i) => (
        <div key={i} className="rows-item">
          <div className="form-grid">
            {fields.map(f => (
              <div key={f.key} className={`field ${f.span ? 'span-2' : ''}`}>
                <label className={f.required ? 'req' : ''}>{f.label}</label>
                {f.type === 'textarea'
                  ? <textarea className="input textarea" rows={3} value={row[f.key]} placeholder={f.placeholder} onChange={e => set(i, f.key, e.target.value)} />
                  : <input className="input" value={row[f.key]} placeholder={f.placeholder} onChange={e => set(i, f.key, e.target.value)} />}
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-ghost btn-sm rows-remove" onClick={() => setRows(r => r.filter((_, j) => j !== i))}><Icon name="trash" className="icon-sm" />Remove</button>
        </div>
      ))}
      <div><button type="button" className="btn btn-outline btn-sm" onClick={() => setRows(r => [...r, { ...blank }])}><Icon name="plus" className="icon-sm" />{addLabel}</button></div>
    </div>
  );
}

export function ProfileSettingsForm({ c, email, categories }: { c: Candidate | null; email: string; categories: Category[] }) {
  const f = useFormAction(saveCandidateProfile); useSaved(f.success, 'Profile saved.');
  return (
    // React 19 resets uncontrolled fields after a form action; keying on updated_at remounts the form with the freshly saved values after router.refresh().
    <form key={c?.updated_at || 'new'} action={f.formAction} onSubmit={f.onSubmit} noValidate className="stack" style={{ gap: 20 }}>
      <FormStatus error={f.error} />
      <section className="card">
        <h2 className="card-title">Basic details</h2>
        <div className="form-grid">
          <Field label="Full name" name="name" required error={f.errors.name} onClear={f.clear}><input className="input" id="name" name="name" defaultValue={c?.name || ''} required data-min-len="2" autoComplete="name" /></Field>
          <Field label="Email" name="email" hint="Your login email. Contact us to change it."><input className="input" id="email" value={email} readOnly disabled /></Field>
          <Field label="Phone" name="phone" required error={f.errors.phone} onClear={f.clear}><input className="input" id="phone" name="phone" type="tel" defaultValue={c?.phone || ''} required autoComplete="tel" /></Field>
          <Field label="Location" name="location" required error={f.errors.location} onClear={f.clear}><input className="input" id="location" name="location" defaultValue={c?.location || ''} required placeholder="City" /></Field>
        </div>
        <div className="field"><span className="label req">Profile type</span><div className="radio-group">{(['IT', 'Non-IT'] as const).map(t => <label key={t} className="radio-pill"><input type="radio" name="profile_type" value={t} defaultChecked={(c?.profile_type || 'IT') === t} /><span>{t}</span></label>)}</div></div>
      </section>

      <section className="card">
        <h2 className="card-title">Professional</h2>
        <div className="form-grid">
          <CategorySelects categories={categories} errors={f.errors} onClear={f.clear} defaultCategory={c?.category_id || ''} defaultSubcategory={c?.subcategory_id || ''} />
          <Field label="Total experience" name="experience" required error={f.errors.experience} onClear={f.clear}><select className="select" id="experience" name="experience" required defaultValue={c?.experience || ''}><option value="">Select</option>{EXPERIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></Field>
          <Field label="Current job title" name="current_title" hint="Leave blank if you are a fresher." error={f.errors.current_title} onClear={f.clear}><input className="input" id="current_title" name="current_title" defaultValue={c?.current_title || ''} /></Field>
          <Field label="Notice period" name="notice_period"><select className="select" id="notice_period" name="notice_period" defaultValue={c?.notice_period || ''}><option value="">Select</option>{NOTICE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></Field>
          <Field label="LinkedIn profile" name="linkedin_url" error={f.errors.linkedin_url} onClear={f.clear}><input className="input" id="linkedin_url" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/…" defaultValue={c?.linkedin_url || ''} /></Field>
          <Field label="Professional summary" name="summary" className="span-2" hint="2–4 sentences about your background and what you are looking for." error={f.errors.summary} onClear={f.clear}><textarea className="input textarea" id="summary" name="summary" maxLength={1200} defaultValue={c?.summary || ''} /></Field>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Skills</h2>
        <p className="small muted">Type a skill and press Enter. Add up to 30.</p>
        <TagInput name="skills" initial={c?.skills || []} placeholder="e.g. Java, Excel, AutoCAD" />
      </section>

      <section className="card">
        <h2 className="card-title">Education</h2>
        <RowsEditor<Education> name="education" initial={c?.education || []} blank={{ degree: '', institution: '', year: '' }} addLabel="Add education" empty="No education added yet."
          fields={[{ key: 'degree', label: 'Degree / qualification', placeholder: 'B.Tech Computer Science', required: true }, { key: 'institution', label: 'Institution', placeholder: 'University or college', required: true }, { key: 'year', label: 'Year of completion', placeholder: '2022' }]} />
      </section>

      <section className="card">
        <h2 className="card-title">Work history</h2>
        <RowsEditor<WorkItem> name="work_history" initial={c?.work_history || []} blank={{ title: '', company: '', from: '', to: '', description: '' }} addLabel="Add role" empty="No work history added yet. Freshers can skip this."
          fields={[{ key: 'title', label: 'Job title', required: true }, { key: 'company', label: 'Company', required: true }, { key: 'from', label: 'From', placeholder: 'Jan 2021' }, { key: 'to', label: 'To', placeholder: 'Present' }, { key: 'description', label: 'What you did', type: 'textarea', span: true }]} />
      </section>

      <div className="row between"><p className="small muted" style={{ margin: 0 }}>Recruiters see these details when they review your applications.</p><SubmitButton pending={f.pending}>Save profile</SubmitButton></div>
    </form>
  );
}
