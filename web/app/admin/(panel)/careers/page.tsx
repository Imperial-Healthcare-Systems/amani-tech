import { OpeningsTable } from '@/components/admin/OpeningsTable';
import { createClient } from '@/lib/supabase/server';
import type { CareerOpening } from '@/lib/types';

export default async function CareersAdmin() {
  const sb = await createClient();
  const { data } = await sb.from('career_openings').select('*').order('created_at', { ascending: false });
  return <OpeningsTable openings={(data || []) as CareerOpening[]} />;
}
