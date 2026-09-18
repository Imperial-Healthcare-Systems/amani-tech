import { JobsTable } from '@/components/admin/JobsTable';
import { createClient } from '@/lib/supabase/server';
import type { Category, Job } from '@/lib/types';

export default async function AdminJobs({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const sb = await createClient();
  const [{ data: jobs }, { data: cats }] = await Promise.all([
    sb.from('jobs').select('*, category:categories(name,slug), subcategory:subcategories(name,slug), applications(count)').order('created_at', { ascending: false }),
    sb.from('categories').select('*').order('sort_order'),
  ]);
  return <JobsTable jobs={(jobs || []) as (Job & { applications: { count: number }[] })[]} categories={(cats || []) as Category[]} initialQuery={q || ''} />;
}
