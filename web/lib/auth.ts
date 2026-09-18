import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';

export async function getUser() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

export async function getProfile() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
  return data as { id: string; email: string; name: string | null; role: 'ADMIN' | 'EDITOR' | 'CANDIDATE' } | null;
}

/** Server-side gate for /admin pages and admin actions. */
export async function requireAdmin() {
  const p = await getProfile();
  if (!p) redirect('/admin/login');
  if (p.role !== 'ADMIN' && p.role !== 'EDITOR') redirect('/admin/login?error=forbidden');
  return p;
}

export async function requireCandidate() {
  const user = await getUser();
  if (!user) redirect('/login?next=/candidate/dashboard');
  return user;
}
