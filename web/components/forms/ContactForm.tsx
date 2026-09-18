'use client';
import Link from 'next/link';
import { Field, FormStatus, SubmitButton, SuccessPanel, useFormAction } from '../form';
import { submitContact } from '@/lib/actions/public';

export function ContactForm() {
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(submitContact);
  if (success) return <div className="form-card"><SuccessPanel title="Message sent" actions={<Link className="btn btn-primary" href="/">Back to home</Link>}>Thank you. We will reply to <strong>{success.data?.email}</strong> within one business day.</SuccessPanel></div>;
  return (
    <form className="form-card" action={formAction} onSubmit={onSubmit} noValidate>
      <h2>Send us a message</h2>
      <FormStatus error={error} />
      <div className="form-grid">
        <Field label="Name" name="name" required error={errors.name} onClear={clear}><input className="input" id="name" name="name" required autoComplete="name" /></Field>
        <Field label="Email" name="email" required error={errors.email} onClear={clear}><input className="input" id="email" name="email" type="email" required autoComplete="email" /></Field>
        <Field label={<>Phone <span className="muted">(optional)</span></>} name="phone" error={errors.phone} onClear={clear}><input className="input" id="phone" name="phone" type="tel" autoComplete="tel" /></Field>
        <Field label="I am a" name="audience" required error={errors.audience} onClear={clear}><select className="select" id="audience" name="audience" required defaultValue=""><option value="">Select</option><option>Job seeker</option><option>Employer</option><option>Staffing partner</option><option>Other</option></select></Field>
        <Field label="Message" name="message" required error={errors.message} onClear={clear} className="span-2"><textarea className="textarea" id="message" name="message" required data-min-len="20" /></Field>
      </div>
      <SubmitButton pending={pending} className="btn btn-primary btn-lg">Send Message</SubmitButton>
    </form>
  );
}
