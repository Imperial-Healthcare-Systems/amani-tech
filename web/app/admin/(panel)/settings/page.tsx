import { SettingsForms } from '@/components/admin/SettingsForms';
import { createClient } from '@/lib/supabase/server';
import type { SettingsContent } from '@/lib/types';

export default async function SettingsPage() {
  const sb = await createClient();
  const [{ data: row }, { data: users }] = await Promise.all([sb.from('site_content').select('payload').eq('key', 'settings').maybeSingle(), sb.from('profiles').select('id,name,email,role,created_at').in('role', ['ADMIN', 'EDITOR']).order('created_at')]);
  const settings = (row?.payload as SettingsContent) || { site_name: 'Amani Tech', seo_suffix: '| Amani Tech', seo_description: '', employer_sla: 'within one business day', notify_emails: '' };
  return <SettingsForms settings={settings} users={(users || []) as { id: string; name: string | null; email: string; role: string; created_at: string }[]} smtpConfigured={!!process.env.EMAIL_HOST} fromAddress={process.env.EMAIL_FROM || 'not set'} />;
}
