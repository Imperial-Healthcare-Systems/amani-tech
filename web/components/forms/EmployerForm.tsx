'use client';
import Link from 'next/link';
import { Upload } from '../Upload';
import { EXPERIENCE_OPTIONS, Field, FormStatus, SubmitButton, SuccessPanel, useFormAction } from '../form';
import { submitEmployerEnquiry } from '@/lib/actions/public';

export function EmployerForm({ sla }: { sla: string }) {
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(submitEmployerEnquiry);
  if (success) return (
    <div className="form-card"><SuccessPanel title="Requirement received" actions={<><Link className="btn btn-outline" href="/services">Explore our services</Link><Link className="btn btn-primary" href="/">Back to home</Link></>}>
      Thank you. A member of our team will contact you {sla} to discuss next steps. Reference: <strong>{success.data?.reference}</strong>. A copy has been sent to <strong>{success.data?.email}</strong>.
    </SuccessPanel></div>
  );
  return (
    <form className="form-card" action={formAction} onSubmit={onSubmit} noValidate>
      <FormStatus error={error} />
      <fieldset className="fieldset"><legend>Contact information</legend>
        <div className="form-grid">
          <Field label="Full name" name="full_name" required error={errors.full_name} onClear={clear}><input className="input" id="full_name" name="full_name" required autoComplete="name" /></Field>
          <Field label="Work email" name="work_email" required error={errors.work_email} onClear={clear}><input className="input" id="work_email" name="work_email" type="email" required autoComplete="email" /></Field>
          <Field label="Phone" name="phone" required error={errors.phone} onClear={clear}><input className="input" id="phone" name="phone" type="tel" required autoComplete="tel" /></Field>
          <Field label="Company name" name="company_name" required error={errors.company_name} onClear={clear}><input className="input" id="company_name" name="company_name" required autoComplete="organization" /></Field>
          <Field label="Designation" name="designation" required error={errors.designation} onClear={clear} className="span-2"><input className="input" id="designation" name="designation" required autoComplete="organization-title" /></Field>
        </div>
      </fieldset>
      <fieldset className="fieldset"><legend>Requirement</legend>
        <div className="form-grid">
          <Field label="Requirement type" name="requirement_type" required error={errors.requirement_type} onClear={clear}><select className="select" id="requirement_type" name="requirement_type" required defaultValue=""><option value="">Select</option><option>Contract staffing</option><option>Permanent recruitment</option><option>Project-based team</option><option>Bulk hiring</option><option>Fresher / entry-level hiring</option></select></Field>
          <Field label="Job title / position" name="job_title" required error={errors.job_title} onClear={clear}><input className="input" id="job_title" name="job_title" required /></Field>
          <Field label="Number of positions" name="positions" required error={errors.positions} onClear={clear}><input className="input" id="positions" name="positions" type="number" min={1} required defaultValue={1} /></Field>
          <Field label="Location" name="location" required error={errors.location} onClear={clear}><input className="input" id="location" name="location" required placeholder="City or Remote" /></Field>
          <Field label="Work mode" name="work_mode" required error={errors.work_mode} onClear={clear}><select className="select" id="work_mode" name="work_mode" required defaultValue=""><option value="">Select</option><option>On-site</option><option>Hybrid</option><option>Remote</option></select></Field>
          <Field label="Experience required" name="experience_required" required error={errors.experience_required} onClear={clear}><select className="select" id="experience_required" name="experience_required" required defaultValue=""><option value="">Select</option>{EXPERIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></Field>
          <Field label="Expected joining timeline" name="joining_timeline" required error={errors.joining_timeline} onClear={clear} className="span-2"><select className="select" id="joining_timeline" name="joining_timeline" required defaultValue=""><option value="">Select</option><option>Immediate</option><option>Within 30 days</option><option>Within 60 days</option><option>Within 90 days</option><option>Planning stage</option></select></Field>
        </div>
      </fieldset>
      <fieldset className="fieldset"><legend>Details</legend>
        <Field label="Job description" name="job_description" required error={errors.job_description} onClear={clear}><textarea className="textarea" id="job_description" name="job_description" required data-min-len="40" placeholder="Role summary, key responsibilities, must-have skills" /></Field>
        <Field label={<>Requirements <span className="muted">(optional)</span></>} name="requirements" error={errors.requirements} onClear={clear}><textarea className="textarea" id="requirements" name="requirements" placeholder="Certifications, tools, shift timings, budget range" /></Field>
        <Upload name="jd" label="Upload JD (optional)" error={errors.jd} onClear={clear} />
      </fieldset>
      <Field name="consent" error={errors.consent} onClear={clear}><label className="check"><input type="checkbox" name="consent" required /><span>I agree to the <Link href="/privacy" target="_blank">Privacy Policy</Link> and to being contacted by Amani Tech about this requirement.</span></label></Field>
      <SubmitButton pending={pending} className="btn btn-primary btn-lg btn-block">Submit Requirement</SubmitButton>
    </form>
  );
}
