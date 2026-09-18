import { LeadsTable } from '@/components/admin/LeadsTable';
import { createClient } from '@/lib/supabase/server';
import type { EmployerEnquiry } from '@/lib/types';

export default async function EmployersPage() {
  const sb = await createClient();
  const { data } = await sb.from('employer_enquiries').select('*').order('created_at', { ascending: false });
  return <LeadsTable kind="employer" rows={(data || []) as EmployerEnquiry[]} />;
}
