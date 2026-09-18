/** Single place that reads Supabase config. If the env vars are missing the site must still render (with empty data)
 *  instead of every request dying in middleware with a 500 — so we fall back to placeholders and log loudly. */
const PLACEHOLDER_URL = 'https://not-configured.supabase.co';

export function supabaseEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  // Supabase now issues 'sb_publishable_…' keys in place of the legacy anon JWT; both are accepted here.
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const configured = /^https:\/\/.+\.supabase\.co$/.test(url) && anonKey.length > 20;
  if (!configured && typeof window === 'undefined') {
    console.error('[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or _ANON_KEY) are missing or invalid. Set them in the hosting environment (Vercel → Settings → Environment Variables) and redeploy.');
  }
  return { url: configured ? url : PLACEHOLDER_URL, anonKey: configured ? anonKey : 'not-configured', serviceKey: serviceKey || 'not-configured', configured };
}

/** Stands in for fetch when Supabase is not configured. Answers 400 immediately: postgrest-js retries thrown fetch errors and 503/520 with 1s+2s+4s backoff, so a rejected promise would still cost ~7 s per query. A 400 is never retried and surfaces as a normal query error, so pages fall back to demo content instantly. */
export const offlineFetch: typeof fetch = () => Promise.resolve(new Response(JSON.stringify({ message: 'Supabase is not configured' }), { status: 400, headers: { 'content-type': 'application/json' } }));
