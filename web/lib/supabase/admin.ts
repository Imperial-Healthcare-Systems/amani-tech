import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseEnv } from './env';

/** Service-role client. Server only. Used for public form writes (bypasses RLS) and private file access. */
export function adminClient() {
  const { url, serviceKey } = supabaseEnv();
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
