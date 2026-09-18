import { PostsTable } from '@/components/admin/PostsTable';
import { createClient } from '@/lib/supabase/server';
import type { BlogPost } from '@/lib/types';

export default async function BlogAdmin() {
  const sb = await createClient();
  const { data } = await sb.from('blog_posts').select('*').order('created_at', { ascending: false });
  return <PostsTable posts={(data || []) as BlogPost[]} />;
}
