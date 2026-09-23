import type { MetadataRoute } from 'next';
import { getCategories, getOpenings, getPosts, getPublishedJobs, getServices } from '@/lib/queries';

const APP = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, categories, posts, openings, services] = await Promise.all([getPublishedJobs(), getCategories(), getPosts(), getOpenings(), getServices()]);
  const statics = ['', '/about', '/services', '/services/it-consulting', '/gcc', '/lms', '/jobs', '/employers', '/vendor-registration', '/blog', '/careers', '/contact', '/faqs', '/privacy', '/terms'].map(p => ({ url: `${APP}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 }));
  return [
    ...statics,
    ...services.map(s => ({ url: `${APP}/services/${s.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...categories.flatMap(c => [{ url: `${APP}/jobs/category/${c.slug}`, changeFrequency: 'daily' as const, priority: 0.8 }, ...c.subcategories.map(s => ({ url: `${APP}/jobs/category/${c.slug}/${s.slug}`, changeFrequency: 'daily' as const, priority: 0.6 }))]),
    ...jobs.map(j => ({ url: `${APP}/jobs/${j.slug}`, lastModified: j.updated_at, changeFrequency: 'daily' as const, priority: 0.9 })),
    ...posts.map(p => ({ url: `${APP}/blog/${p.slug}`, lastModified: p.published_at || undefined, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...openings.map(o => ({ url: `${APP}/careers/${o.slug}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
  ];
}
