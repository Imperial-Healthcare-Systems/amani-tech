import { LeadsTable } from '@/components/admin/LeadsTable';
import { createClient } from '@/lib/supabase/server';
import type { VendorEnquiry } from '@/lib/types';

export default async function VendorsPage() {
  const sb = await createClient();
  const { data } = await sb.from('vendor_enquiries').select('*').order('created_at', { ascending: false });
  return <LeadsTable kind="vendor" rows={(data || []) as VendorEnquiry[]} />;
}
