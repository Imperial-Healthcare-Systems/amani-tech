import { CandidatesTable } from '@/components/admin/CandidatesTable';
import { createClient } from '@/lib/supabase/server';
import type { Candidate, Category } from '@/lib/types';

export default async function CandidatesPage() {
  const sb = await createClient();
  const [{ data: cands }, { data: cats }] = await Promise.all([
    sb.from('candidates').select('*, category:categories(name), subcategory:subcategories(name), applications(count)').order('created_at', { ascending: false }),
    sb.from('categories').select('*').order('sort_order'),
  ]);
  return <CandidatesTable candidates={(cands || []) as (Candidate & { applications: { count: number }[] })[]} categories={(cats || []) as Category[]} />;
}
