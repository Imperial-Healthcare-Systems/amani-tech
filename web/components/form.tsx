'use client';
import { useActionState, useCallback, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from './Icon';
import type { ActionResult } from '@/lib/types';

type Action<T> = (prev: unknown, fd: FormData) => Promise<ActionResult<T>>;

/** Client validation for [required], email, tel, url and data-min-len inside `root`. Returns field-name → message. */
export function validateFields(root: HTMLElement): Record<string, string> {
  const errors: Record<string, string> = {};
  root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea').forEach(i => {
    if (i.disabled || !i.name || i.type === 'hidden' && !i.required) return;
    const v = (i.value || '').trim();
    const name = i.name;
    if (i.type === 'checkbox') { if (i.required && !(i as HTMLInputElement).checked) errors[name] = 'Please confirm to continue.'; return; }
    if (i.type === 'radio') return;
    if (i.type === 'file') { if (i.required && !(i as HTMLInputElement).files?.length) errors[name] = 'Please upload a file.'; return; }
    if (i.required && !v) { errors[name] = i.dataset.msg || 'This field is required.'; return; }
    if (v && i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors[name] = 'Enter a valid email address.';
    else if (v && i.type === 'tel' && !/^[+\d][\d\s-]{7,}$/.test(v)) errors[name] = 'Enter a valid phone number.';
    else if (v && i.dataset.minLen && v.length < +i.dataset.minLen) errors[name] = `Please add at least ${i.dataset.minLen} characters.`;
    else if (v && i.type === 'url' && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(v)) errors[name] = 'Enter a valid website address.';
    else if (i.type === 'password' && i.required && v.length < +(i.dataset.minLen || 8)) errors[name] = `At least ${i.dataset.minLen || 8} characters.`;
  });
  return errors;
}

/** Wraps a server action with client validation, pending state and merged field errors. */
export function useFormAction<T>(action: Action<T>) {
  const [state, formAction, pending] = useActionState(action, null as ActionResult<T> | null);
  const [local, setLocal] = useState<Record<string, string>>({});
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    const errs = validateFields(e.currentTarget);
    setLocal(errs);
    if (Object.keys(errs).length) { e.preventDefault(); const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`); first?.focus(); }
  }, []);
  const clear = useCallback((name: string) => setLocal(l => { if (!l[name]) return l; const n = { ...l }; delete n[name]; return n; }), []);
  const server = state && !state.ok ? state.fields || {} : {};
  return {
    formAction, onSubmit, pending, clear,
    errors: { ...server, ...local },
    error: state && !state.ok ? state.error : null,
    success: state && state.ok ? state : null,
  };
}

export function Field({ label, name, error, required, hint, children, className = '', onClear }: { label?: ReactNode; name: string; error?: string; required?: boolean; hint?: ReactNode; children: ReactNode; className?: string; onClear?: (n: string) => void }) {
  return (
    <div className={`field ${error ? 'is-invalid' : ''} ${className}`} onInput={() => onClear?.(name)} onChange={() => onClear?.(name)}>
      {label && <label className={required ? 'req' : ''} htmlFor={name}>{label}</label>}
      {children}
      {hint && <span className="hint">{hint}</span>}
      <span className="error-msg">{error}</span>
    </div>
  );
}

export function FormStatus({ error, success }: { error?: string | null; success?: string | null }) {
  if (!error && !success) return null;
  return (
    <div className={`form-status is-visible ${error ? 'error' : 'success'}`} role="alert">
      <Icon name={error ? 'alert' : 'check'} /><span>{error || success}</span>
    </div>
  );
}

export function SubmitButton({ children, pending, className = 'btn btn-primary' }: { children: ReactNode; pending: boolean; className?: string }) {
  return <button type="submit" className={`${className} ${pending ? 'is-loading' : ''}`} aria-busy={pending} disabled={pending}><span className="spinner" />{children}</button>;
}

export function SuccessPanel({ title, children, actions, className = '' }: { title: string; children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={`success-panel ${className}`}>
      <div className="success-icon"><Icon name="check" /></div>
      <h3>{title}</h3>
      <p>{children}</p>
      {actions && <div className="row" style={{ justifyContent: 'center' }}>{actions}</div>}
    </div>
  );
}

export const EXPERIENCE_OPTIONS = ['Fresher', '1–3 years', '3–5 years', '5–8 years', '8–12 years', '12+ years'];
