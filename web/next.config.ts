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
  // Names used in the new navigation that point at pages built under older slugs.
  async redirects() {
    return [
      { source: '/services/technology', destination: '/services/it-consulting', permanent: false },
      { source: '/services/digital-transformation', destination: '/services/transformation', permanent: false },
      { source: '/services/talent-solutions', destination: '/services/talent', permanent: false },
    ];
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
