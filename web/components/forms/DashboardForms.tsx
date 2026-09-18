'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from '../Upload';
import { Field, FormStatus, SubmitButton, useFormAction } from '../form';
import { useToast } from '../Toast';
import { replaceResume, updateProfile } from '@/lib/actions/public';

export function ProfileForm({ phone, location, title }: { phone: string; location: string; title: string }) {
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(updateProfile);
  const toast = useToast(); const router = useRouter();
  useEffect(() => { if (success) { toast('Profile updated.'); router.refresh(); } }, [success, toast, router]);
  return (
    <form className="mt-16" action={formAction} onSubmit={onSubmit} noValidate>
      <FormStatus error={error} />
      <Field label="Phone" name="phone" required error={errors.phone} onClear={clear}><input className="input" id="phone" name="phone" type="tel" defaultValue={phone} required /></Field>
      <Field label="Location" name="location" required error={errors.location} onClear={clear}><input className="input" id="location" name="location" defaultValue={location} required /></Field>
      <Field label="Current job title" name="current_title" required error={errors.current_title} onClear={clear}><input className="input" id="current_title" name="current_title" defaultValue={title} required /></Field>
      <SubmitButton pending={pending} className="btn btn-secondary btn-sm">Save changes</SubmitButton>
    </form>
  );
}

export function ResumeForm() {
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(replaceResume);
  const toast = useToast(); const router = useRouter();
  useEffect(() => { if (success) { toast('Resume updated.'); router.refresh(); } }, [success, toast, router]);
  return (
    <form action={formAction} onSubmit={onSubmit} noValidate>
      <FormStatus error={error} />
      <Upload name="resume" label="Replace resume" required error={errors.resume} onClear={clear} />
      <SubmitButton pending={pending} className="btn btn-outline btn-sm">Upload new resume</SubmitButton>
    </form>
  );
}
