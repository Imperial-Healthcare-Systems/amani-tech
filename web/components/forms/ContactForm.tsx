'use client';
import Link from 'next/link';
import { Field, FormStatus, SubmitButton, SuccessPanel, useFormAction } from '../form';
import { submitContact } from '@/lib/actions/public';

const DEFAULT_AUDIENCES = ['Job seeker', 'Employer', 'Staffing partner', 'Other'];

/** The contact form. Other pages reuse it for their own enquiries — `topic` prefixes the audience stored with
 *  the message, so the admin inbox shows where a lead came from (e.g. "Training / LMS — Working professional"). */
export function ContactForm({ topic, title = 'Send us a message', submitLabel = 'Send Message', audiences = DEFAULT_AUDIENCES, messageLabel = 'Message' }: { topic?: string; title?: string; submitLabel?: string; audiences?: string[]; messageLabel?: string }) {
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(submitContact);
  if (success) return <div className="form-card"><SuccessPanel title={topic ? 'Thank you — you are on the list' : 'Message sent'} actions={<Link className="btn btn-primary" href="/">Back to home</Link>}>Thank you. We will reply to <strong>{success.data?.email}</strong> within one business day.</SuccessPanel></div>;
  return (
    <form className="form-card" action={formAction} onSubmit={onSubmit} noValidate>
      <h2>{title}</h2>
      <FormStatus error={error} />
      <div className="form-grid">
        <Field label="Name" name="name" required error={errors.name} onClear={clear}><input className="input" id="name" name="name" required autoComplete="name" /></Field>
        <Field label="Email" name="email" required error={errors.email} onClear={clear}><input className="input" id="email" name="email" type="email" required autoComplete="email" /></Field>
        <Field label={<>Phone <span className="muted">(optional)</span></>} name="phone" error={errors.phone} onClear={clear}><input className="input" id="phone" name="phone" type="tel" autoComplete="tel" /></Field>
        <Field label="I am a" name="audience" required error={errors.audience} onClear={clear}>
          <select className="select" id="audience" name="audience" required defaultValue="">
            <option value="">Select</option>
            {audiences.map(a => <option key={a} value={topic ? `${topic} — ${a}` : a}>{a}</option>)}
          </select>
        </Field>
        <Field label={messageLabel} name="message" required error={errors.message} onClear={clear} className="span-2"><textarea className="textarea" id="message" name="message" required data-min-len="20" /></Field>
      </div>
      <SubmitButton pending={pending} className="btn btn-primary btn-lg">{submitLabel}</SubmitButton>
    </form>
  );
}
