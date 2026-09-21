import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { offlineFetch, supabaseEnv } from './env';

let client: SupabaseClient | undefined;

/** Cookie-less anon client for public reads (published jobs, posts, site content — RLS lets anyone read these).
 *  No per-request cookies means the results can be cached across requests; one instance keeps its HTTP connections warm. */
export function publicClient() {
  if (client) return client;
  const { url, anonKey, configured } = supabaseEnv();
  return (client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false }, global: configured ? undefined : { fetch: offlineFetch } }));
}
