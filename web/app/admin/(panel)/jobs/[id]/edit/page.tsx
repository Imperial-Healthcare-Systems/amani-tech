import { notFound } from 'next/navigation';
import { JobForm } from '@/components/admin/JobForm';
import { createClient } from '@/lib/supabase/server';
import type { Category, Job } from '@/lib/types';

export default async function EditJob({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createClient();
  const [{ data: job }, { data: cats }] = await Promise.all([sb.from('jobs').select('*').eq('id', id).maybeSingle(), sb.from('categories').select('*, subcategories(*)').order('sort_order')]);
  if (!job) notFound();
  return <JobForm categories={(cats || []) as Category[]} job={job as Job} />;
}
