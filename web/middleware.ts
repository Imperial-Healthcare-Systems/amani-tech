import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseEnv } from '@/lib/supabase/env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/** Refreshes the Supabase session cookie and gates /admin and /candidate. */
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
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) return NextResponse.redirect(new URL('/admin/login', request.url));
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'EDITOR')) return NextResponse.redirect(new URL('/admin/login?error=forbidden', request.url));
  }
  if (pathname.startsWith('/candidate') && !user) {
    const url = new URL('/login', request.url); url.searchParams.set('next', pathname); return NextResponse.redirect(url);
  }
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)'] };
