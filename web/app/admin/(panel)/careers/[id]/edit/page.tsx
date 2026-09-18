import { notFound } from 'next/navigation';
import { OpeningEditor } from '@/components/admin/OpeningEditor';
import { createClient } from '@/lib/supabase/server';
import type { CareerOpening } from '@/lib/types';

export default async function EditOpening({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createClient();
  const { data } = await sb.from('career_openings').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  return <OpeningEditor opening={data as CareerOpening} />;
}
