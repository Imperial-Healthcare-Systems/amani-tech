'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../Icon';
import { Field, FormStatus, SubmitButton, useFormAction } from '../form';
import { useToast } from '../Toast';
import { PageHead } from './shared';
import { adminSignIn, changePassword, saveContent } from '@/lib/actions/admin';
import { fmtDate } from '@/lib/format';
import type { SettingsContent } from '@/lib/types';

export function AdminLoginForm({ forbidden }: { forbidden: boolean }) {
  const { formAction, onSubmit, pending, errors, error, clear } = useFormAction(adminSignIn);
  return (
    <form action={formAction} onSubmit={onSubmit} noValidate>
      <FormStatus error={error || (forbidden ? 'This account does not have admin access. Ask an administrator to grant the ADMIN role.' : null)} />
      <Field label="Email" name="email" required error={errors.email} onClear={clear}><input className="input" id="email" name="email" type="email" required autoComplete="username" /></Field>
      <Field label="Password" name="password" required error={errors.password} onClear={clear}><input className="input" id="password" name="password" type="password" required data-min-len="1" autoComplete="current-password" /></Field>
      <SubmitButton pending={pending} className="btn btn-secondary btn-block btn-lg">Sign in</SubmitButton>
    </form>
  );
}

export function SettingsForms({ settings, users, smtpConfigured, fromAddress }: { settings: SettingsContent; users: { id: string; name: string | null; email: string; role: string; created_at: string }[]; smtpConfigured: boolean; fromAddress: string }) {
  const [s, setS] = useState(settings); const router = useRouter(); const toast = useToast(); const [pending, start] = useTransition();
  const pw = useFormAction(changePassword);
  useEffect(() => { if (pw.success) toast('Password updated.'); }, [pw.success, toast]);
  const save = () => start(async () => { const r = await saveContent('settings', s as unknown as Record<string, unknown>, true); if (!r.ok) return toast(r.error, 'error'); toast('Settings saved.'); router.refresh(); });
  const F = (k: keyof SettingsContent) => ({ value: s[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setS({ ...s, [k]: e.target.value }) });
  return (
    <>
      <PageHead title="Settings" text="Site-wide configuration. Secrets (database, email password, storage keys) live in server environment variables, never here." />
      <div className="a-grid-2" style={{ alignItems: 'start' }}>
        <div className="a-card"><h3>General</h3>
          <div className="field"><label htmlFor="s-name">Site name</label><input className="input" id="s-name" {...F('site_name')} /></div>
          <div className="field"><label htmlFor="s-suffix">Default SEO title suffix</label><input className="input" id="s-suffix" {...F('seo_suffix')} /></div>
          <div className="field"><label htmlFor="s-desc">Default meta description</label><textarea className="textarea" id="s-desc" style={{ minHeight: 70 }} {...F('seo_description')} /></div>
          <div className="field"><label htmlFor="s-sla">Employer response promise (shown on forms and emails)</label><input className="input" id="s-sla" {...F('employer_sla')} /></div>
          <div className="field"><label htmlFor="s-notify">Notify these addresses on new applications and enquiries</label><input className="input" id="s-notify" {...F('notify_emails')} /><span className="hint">Comma separated. The server also uses ADMIN_NOTIFICATION_EMAIL.</span></div>
          <button type="button" className={`btn btn-primary ${pending ? 'is-loading' : ''}`} disabled={pending} onClick={save}><span className="spinner" />Save</button>
        </div>
        <div className="stack" style={{ gap: 16 }}>
          <div className="a-card"><h3>Email delivery</h3>
            <div className={`form-status is-visible ${smtpConfigured ? 'success' : 'error'}`}><Icon name={smtpConfigured ? 'check' : 'alert'} /><span>{smtpConfigured ? `SMTP configured. Emails send from ${fromAddress}.` : 'SMTP is not configured — confirmation emails are skipped. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD and EMAIL_FROM in the server environment.'}</span></div>
            <ul className="small muted" style={{ margin: 0, paddingLeft: 18 }}><li>Candidate: registration / application confirmation</li><li>Employer: requirement acknowledgement with reference</li><li>Admin: new application, enquiry, partner and review alerts</li></ul>
          </div>
          <div className="a-card"><h3>Admin users</h3>
            <div className="a-table-wrap" style={{ border: 0 }}><table className="a-table" style={{ minWidth: 0 }}><thead><tr><th>User</th><th>Role</th><th>Since</th></tr></thead><tbody>
              {users.map(u => <tr key={u.id}><td><span className="primary">{u.name || '—'}</span><span className="sub">{u.email}</span></td><td><span className="badge badge-neutral">{u.role}</span></td><td><span className="sub nowrap">{fmtDate(u.created_at)}</span></td></tr>)}
            </tbody></table></div>
            <p className="small muted" style={{ margin: '12px 0 0' }}>To add an admin: have them sign up at <code>/register</code> (or create the user in Supabase Auth), then run <code>update profiles set role = &apos;ADMIN&apos; where email = &apos;…&apos;;</code> in the SQL editor.</p>
          </div>
          <form className="a-card" action={pw.formAction} onSubmit={pw.onSubmit} noValidate><h3>Change password</h3>
            <FormStatus error={pw.error} />
            <Field label="New password" name="new_password" required error={pw.errors.new_password} hint="Minimum 12 characters." onClear={pw.clear}><input className="input" id="new_password" name="new_password" type="password" required data-min-len="12" autoComplete="new-password" /></Field>
            <SubmitButton pending={pw.pending} className="btn btn-secondary">Update password</SubmitButton>
          </form>
        </div>
      </div>
    </>
  );
}
