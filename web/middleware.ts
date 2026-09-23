import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseEnv } from '@/lib/supabase/env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/** Refreshes the Supabase session cookie and gates /admin and /candidate.
 *  One login system for everyone; `profiles.role` decides where an account may go:
 *  ADMIN / EDITOR → /admin only, CANDIDATE → /candidate only. */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = supabaseEnv();
  if (!env.configured) return response; // no Supabase yet: let the public site render; auth-gated areas cannot work until env vars are set
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (all: CookieToSet[]) => { all.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); all.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); },
    },
  });
  const { data: claims } = await supabase.auth.getClaims().catch(() => ({ data: null })); // verified locally against cached signing keys; still refreshes the cookie when expired
  const user = claims?.claims;
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isCandidateArea = pathname.startsWith('/candidate');

  if (isAdminArea && !user) return NextResponse.redirect(new URL('/admin/login', request.url));
  if (isCandidateArea && !user) { const url = new URL('/login', request.url); url.searchParams.set('next', pathname); return NextResponse.redirect(url); }

  if (user && (isAdminArea || isCandidateArea)) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.sub).maybeSingle();
    const isStaff = profile?.role === 'ADMIN' || profile?.role === 'EDITOR';
    if (isAdminArea && !isStaff) return NextResponse.redirect(new URL('/admin/login?error=forbidden', request.url));
    if (isCandidateArea && isStaff) return NextResponse.redirect(new URL('/admin', request.url));
  }
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)'] };
