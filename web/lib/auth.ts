import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';

export type SessionUser = { id: string; email: string; user_metadata?: { name?: string } };

/** The signed-in user from the session cookie. The JWT is verified locally against the project's signing keys
 *  (fetched once, then cached in memory), so this costs no round trip to Supabase Auth — unlike auth.getUser(). */
export async function getUser(): Promise<SessionUser | null> {
  const sb = await createClient();
  const { data } = await sb.auth.getClaims();
  const c = data?.claims;
  return c ? { id: c.sub, email: c.email || '', user_metadata: c.user_metadata } : null;
}

export async function getProfile() {
  const user = await getUser();
  if (!user) return null;
  const sb = await createClient();
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
