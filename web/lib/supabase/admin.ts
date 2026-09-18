import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { offlineFetch, supabaseEnv } from './env';

/** Service-role client. Server only. Used for public form writes (bypasses RLS) and private file access. */
export function adminClient() {
  const { url, serviceKey, configured } = supabaseEnv();
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false }, global: configured ? undefined : { fetch: offlineFetch } });
}
