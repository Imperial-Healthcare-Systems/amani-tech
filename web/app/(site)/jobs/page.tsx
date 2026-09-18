import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { JobsExplorer } from '@/components/JobsExplorer';
import { getCategories, getPublishedJobs } from '@/lib/queries';

export const metadata: Metadata = { title: 'Find Jobs — IT & Non-IT Openings', description: 'Search open positions by keyword, category and location. Apply in minutes.', alternates: { canonical: '/jobs' }, robots: { index: true, follow: true } };

export default async function JobsPage() {
  const [jobs, categories] = await Promise.all([getPublishedJobs(), getCategories()]);
  const locations = [...new Set(jobs.map(j => j.location))].sort();
  return (
    <>
      <Suspense><JobsExplorer jobs={jobs} categories={categories} locations={locations} /></Suspense>
      <section className="section-tight"><div className="container">
        <div className="cta-band"><span className="eyebrow">Not seeing the right role?</span><h2>Register once. Get found for roles you haven&apos;t seen yet.</h2><p>Our recruiters search registered profiles first when a new requirement comes in.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/register">Register as a candidate</Link></div></div>
      </div></section>
    </>
  );
}
