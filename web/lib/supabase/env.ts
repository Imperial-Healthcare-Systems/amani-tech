/** Single place that reads Supabase config. If the env vars are missing the site must still render (with empty data)
 *  instead of every request dying in middleware with a 500 — so we fall back to placeholders and log loudly. */
const PLACEHOLDER_URL = 'https://not-configured.supabase.co';

export function supabaseEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const configured = /^https:\/\/.+\.supabase\.co$/.test(url) && anonKey.length > 20;
  if (!configured && typeof window === 'undefined') {
    console.error('[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing or invalid. Set them in the hosting environment (Vercel → Settings → Environment Variables) and redeploy.');
  }
  return { url: configured ? url : PLACEHOLDER_URL, anonKey: configured ? anonKey : 'not-configured', serviceKey: serviceKey || 'not-configured', configured };
}
