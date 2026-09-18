'use client';
import { createBrowserClient } from '@supabase/ssr';
import { offlineFetch, supabaseEnv } from './env';

export function createClient() {
  const { url, anonKey, configured } = supabaseEnv();
  return createBrowserClient(url, anonKey, configured ? undefined : { global: { fetch: offlineFetch } });
}
