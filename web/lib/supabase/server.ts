import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { offlineFetch, supabaseEnv } from './env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/** Cookie-bound client for Server Components, Route Handlers and Server Actions (respects RLS as the signed-in user). */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey, configured } = supabaseEnv();
  return createServerClient(url, anonKey, {
    global: configured ? undefined : { fetch: offlineFetch },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (all: CookieToSet[]) => { try { all.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* read-only in RSC */ } },
    },
  });
}
