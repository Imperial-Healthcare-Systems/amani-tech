import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/SettingsForms';

export const metadata: Metadata = { title: 'Admin Login', robots: { index: false, follow: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="a-login admin">
      <div className="form-card">
        <div className="brand"><svg viewBox="0 0 36 36" aria-hidden="true" width="34" height="34"><rect width="36" height="36" rx="9" fill="#0B2545" /><path d="M10 26 18 9l8 17" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M13.5 20h9" stroke="#0E9F6E" strokeWidth="3" strokeLinecap="round" /></svg>Amani Tech Admin</div>
        <AdminLoginForm forbidden={error === 'forbidden'} />
        <p className="small muted center mt-16" style={{ marginBottom: 0 }}>Restricted to Amani Tech staff. <a href="/">Back to website</a></p>
      </div>
    </main>
  );
}
