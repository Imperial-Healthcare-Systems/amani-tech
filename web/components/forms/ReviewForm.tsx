'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '../Icon';
import { Upload } from '../Upload';
import { Field, FormStatus, SubmitButton, SuccessPanel, useFormAction } from '../form';
import { submitTestimonial } from '@/lib/actions/public';

export function ReviewForm() {
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(submitTestimonial);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  if (success) return <div className="form-card"><SuccessPanel title="Thank you" actions={<Link className="btn btn-primary" href="/">Back to home</Link>}>Your review has been submitted and will appear once approved by our team.</SuccessPanel></div>;
  return (
    <form className="form-card" action={formAction} onSubmit={onSubmit} noValidate>
      <FormStatus error={error} />
      <div className="form-grid">
        <Field label="Name" name="name" required error={errors.name} onClear={clear}><input className="input" id="name" name="name" required /></Field>
        <Field label="Designation" name="designation" required error={errors.designation} onClear={clear}><input className="input" id="designation" name="designation" required placeholder="e.g. Data Engineer, HR Manager" /></Field>
        <Field label="Company" name="company" required error={errors.company} onClear={clear} className="span-2"><input className="input" id="company" name="company" required placeholder="Your employer, or “Placed via Amani Tech”" /></Field>
      </div>
      <Field name="rating" error={errors.rating} onClear={clear}>
        <span className="label req">Rating</span>
        <div className="rating-input" style={{ flexDirection: 'row' }} onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map(v => <button key={v} type="button" className={v <= (hover || rating) ? 'is-on' : ''} aria-label={`${v} star${v > 1 ? 's' : ''}`} onMouseEnter={() => setHover(v)} onClick={() => setRating(v)}><Icon name="star" /></button>)}
        </div>
        <input type="hidden" name="rating" value={rating || ''} required data-msg="Please select a rating." />
      </Field>
      <Field label="Your review" name="review" required error={errors.review} hint="Minimum 40 characters" onClear={clear}><textarea className="textarea" id="review" name="review" required data-min-len="40" placeholder="What was your experience like? What could we have done better?" /></Field>
      <Upload name="photo" kind="image" maxMb={2} label="Photo (optional)" error={errors.photo} onClear={clear} />
      <Field name="consent" error={errors.consent} onClear={clear}><label className="check"><input type="checkbox" name="consent" required /><span>I confirm this review reflects my genuine experience and I consent to it being published with my name, designation and company.</span></label></Field>
      <SubmitButton pending={pending} className="btn btn-primary btn-lg">Submit Review</SubmitButton>
    </form>
  );
}
