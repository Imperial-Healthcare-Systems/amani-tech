import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/admin/PostEditor';
import { createClient } from '@/lib/supabase/server';
import type { BlogPost } from '@/lib/types';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createClient();
  const { data } = await sb.from('blog_posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  return <PostEditor post={data as BlogPost} />;
}
