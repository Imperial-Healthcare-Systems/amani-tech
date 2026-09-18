import type { Metadata } from 'next';
import { LogoMark } from '@/components/Icon';
import { AdminLoginForm } from '@/components/admin/SettingsForms';

export const metadata: Metadata = { title: 'Admin Login', robots: { index: false, follow: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="a-login admin">
      <div className="form-card">
        <div className="brand"><LogoMark size={34} />amani tech <span style={{ fontWeight: 600, color: 'var(--a-muted)' }}>Admin</span></div>
        <AdminLoginForm forbidden={error === 'forbidden'} />
        <p className="small muted center mt-16" style={{ marginBottom: 0 }}>Restricted to Amani Tech staff. <a href="/">Back to website</a></p>
      </div>
    </main>
  );
}
