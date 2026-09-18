'use client';
import Link from 'next/link';
import { Upload } from '../Upload';
import { Field, FormStatus, SubmitButton, SuccessPanel, useFormAction } from '../form';
import { submitVendorEnquiry } from '@/lib/actions/public';

const SERVICES = ['Permanent recruitment', 'Contract staffing', 'Campus hiring', 'Bulk hiring', 'Executive search'];

export function VendorForm() {
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(submitVendorEnquiry);
  if (success) return <div className="form-card"><SuccessPanel title="Application received" actions={<Link className="btn btn-primary" href="/">Back to home</Link>}>We review partner applications within five business days. A confirmation has been sent to <strong>{success.data?.email}</strong>.</SuccessPanel></div>;
  return (
    <form className="form-card" action={formAction} onSubmit={onSubmit} noValidate>
      <FormStatus error={error} />
      <fieldset className="fieldset"><legend>Company</legend>
        <div className="form-grid">
          <Field label="Company name" name="company" required error={errors.company} onClear={clear}><input className="input" id="company" name="company" required /></Field>
          <Field label="Contact person" name="contact_person" required error={errors.contact_person} onClear={clear}><input className="input" id="contact_person" name="contact_person" required /></Field>
          <Field label="Email" name="email" required error={errors.email} onClear={clear}><input className="input" id="email" name="email" type="email" required /></Field>
          <Field label="Phone" name="phone" required error={errors.phone} onClear={clear}><input className="input" id="phone" name="phone" type="tel" required /></Field>
          <Field label="Location" name="location" required error={errors.location} onClear={clear}><input className="input" id="location" name="location" required placeholder="City / region" /></Field>
          <Field label={<>Website <span className="muted">(optional)</span></>} name="website" error={errors.website} onClear={clear}><input className="input" id="website" name="website" type="url" placeholder="https://" /></Field>
        </div>
      </fieldset>
      <fieldset className="fieldset"><legend>Services</legend>
        <Field name="services" error={errors.services} onClear={clear}><span className="label req">Services offered</span><div className="radio-group">{SERVICES.map(s => <label key={s} className="radio-pill"><input type="checkbox" name="services" value={s} /><span>{s}</span></label>)}</div></Field>
        <div className="form-grid">
          <Field label="Specialisation" name="specialization" required error={errors.specialization} onClear={clear}><input className="input" id="specialization" name="specialization" required placeholder="e.g. BFSI, cloud engineering, blue-collar" /></Field>
          <Field label="Years of experience" name="years_experience" required error={errors.years_experience} onClear={clear}><select className="select" id="years_experience" name="years_experience" required defaultValue=""><option value="">Select</option><option>Less than 2</option><option>2–5</option><option>5–10</option><option>10+</option></select></Field>
        </div>
        <Field label={<>Additional information <span className="muted">(optional)</span></>} name="additional_info" onClear={clear}><textarea className="textarea" id="additional_info" name="additional_info" placeholder="Team size, notable clients, regions covered" /></Field>
        <Upload name="document" label="Company profile or registration document (optional)" error={errors.document} onClear={clear} />
      </fieldset>
      <Field name="consent" error={errors.consent} onClear={clear}><label className="check"><input type="checkbox" name="consent" required /><span>I confirm the information provided is accurate and agree to the <Link href="/privacy" target="_blank">Privacy Policy</Link>.</span></label></Field>
      <SubmitButton pending={pending} className="btn btn-primary btn-lg btn-block">Submit Partner Application</SubmitButton>
    </form>
  );
}
