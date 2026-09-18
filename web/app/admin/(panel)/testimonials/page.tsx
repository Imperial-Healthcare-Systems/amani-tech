import { Moderation } from '@/components/admin/Moderation';
import { createClient } from '@/lib/supabase/server';
import type { Testimonial } from '@/lib/types';

export default async function TestimonialsPage() {
  const sb = await createClient();
  const { data } = await sb.from('testimonials').select('*').order('created_at', { ascending: false });
  return <Moderation items={(data || []) as Testimonial[]} />;
}
