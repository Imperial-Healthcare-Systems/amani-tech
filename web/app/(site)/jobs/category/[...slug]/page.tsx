import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { JobsExplorer } from '@/components/JobsExplorer';
import { getCategories, getPublishedJobs } from '@/lib/queries';

type Props = { params: Promise<{ slug: string[] }> };

async function resolve(slug: string[]) {
  const categories = await getCategories();
  const cat = categories.find(c => c.slug === slug[0]);
  const sub = cat && slug[1] ? cat.subcategories.find(s => s.slug === slug[1]) : undefined;
  return { categories, cat, sub };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat, sub } = await resolve((await params).slug);
  if (!cat) return {};
  const name = sub ? sub.name : cat.name;
  return { title: `${name} Jobs`, description: `Browse open ${name} positions across India. Apply in minutes with Amani Tech.`, alternates: { canonical: `/jobs/category/${cat.slug}${sub ? `/${sub.slug}` : ''}` } };
}

export default async function CategoryJobs({ params }: Props) {
  const { slug } = await params;
  const { categories, cat, sub } = await resolve(slug);
  if (!cat || (slug[1] && !sub) || slug.length > 2) notFound();
  const jobs = await getPublishedJobs();
  const locations = [...new Set(jobs.map(j => j.location))].sort();
  return (
    <>
      <div className="container" style={{ paddingTop: 24 }}><h1 className="sr-only">{sub ? sub.name : cat.name} jobs</h1></div>
      <Suspense><JobsExplorer jobs={jobs} categories={categories} locations={locations} preset={{ category: cat.id, sub: sub?.id }} /></Suspense>
    </>
  );
}
