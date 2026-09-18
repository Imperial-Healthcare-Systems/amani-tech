import { JobForm } from '@/components/admin/JobForm';
import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/lib/types';

export default async function NewJob() {
  const sb = await createClient();
  const { data } = await sb.from('categories').select('*, subcategories(*)').order('sort_order');
  return <JobForm categories={(data || []) as Category[]} job={null} />;
}
