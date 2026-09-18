import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: { default: 'Admin', template: '%s — Amani Tech Admin' }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const sb = await createClient();
  const { data } = await sb.rpc('admin_metrics');
  const m = (data || {}) as Record<string, number>;
  return (
    <div className="admin">
      <AdminShell admin={{ name: admin.name || 'Admin', email: admin.email }} counts={{ applications: m.new_applications || 0, employers: m.new_leads || 0, vendors: 0, testimonials: m.pending_testimonials || 0 }}>{children}</AdminShell>
    </div>
  );
}
