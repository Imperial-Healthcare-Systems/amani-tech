import type { NextConfig } from 'next';

// Allow next/image to load from the project's Supabase Storage. Never let a malformed env value break the build.
let supabaseHost = '*.supabase.co';
try { if (process.env.NEXT_PUBLIC_SUPABASE_URL) supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL.trim()).hostname; } catch { /* keep wildcard */ }

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: supabaseHost },
    ],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};

export default nextConfig;
