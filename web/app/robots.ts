import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const APP = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/candidate', '/api', '/auth'] }], sitemap: `${APP}/sitemap.xml` };
}
