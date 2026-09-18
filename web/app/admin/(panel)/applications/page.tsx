import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { createClient } from '@/lib/supabase/server';
import type { Application, Category, Job } from '@/lib/types';

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const sb = await createClient();
  const [{ data: apps }, { data: jobs }, { data: cats }] = await Promise.all([
    sb.from('applications').select('*, job:jobs(id,title,company_name,location,slug), candidate:candidates(*, category:categories(name), subcategory:subcategories(name))').order('applied_at', { ascending: false }),
    sb.from('jobs').select('id,title').order('title'), sb.from('categories').select('*').order('sort_order'),
  ]);
  return <ApplicationsTable applications={(apps || []) as Application[]} jobs={(jobs || []) as Pick<Job, 'id' | 'title'>[]} categories={(cats || []) as Category[]} initialQuery={q || ''} />;
}
