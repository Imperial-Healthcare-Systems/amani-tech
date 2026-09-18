import type { Metadata } from 'next';
import Link from 'next/link';
import { Item, Stagger } from '@/components/motion';
import { BlogCard, Empty } from '@/components/cards';
import { getPosts } from '@/lib/queries';

export const metadata: Metadata = { title: 'Insights & Career Advice', description: 'Hiring trends and practical career advice from the Amani Tech recruitment team.', alternates: { canonical: '/blog' } };

const CATS = [['all', 'All'], ['insights', 'Insights'], ['career-advice', 'Career Advice'], ['company-news', 'Company News']] as const;
const NAME: Record<string, string> = { insights: 'Insights', 'career-advice': 'Career Advice', 'company-news': 'Company News' };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = 'all' } = await searchParams;
  const posts = await getPosts(NAME[category]);
  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">Resources</span><h1>Insights and career advice</h1><p className="lead">Practical writing from recruiters who talk to candidates and employers every day.</p></div></section>
      <section className="section"><div className="container">
        <div className="blog-filters" role="group" aria-label="Filter by category">{CATS.map(([slug, label]) => <Link key={slug} className={`chip ${slug === category ? 'is-active' : ''}`} href={slug === 'all' ? '/blog' : `/blog?category=${slug}`} aria-pressed={slug === category}>{label}</Link>)}</div>
        {posts.length ? <Stagger className="grid grid-3">{posts.map((b, i) => <Item key={b.id} className={i === 0 && category === 'all' && b.is_featured ? 'featured' : ''} style={i === 0 && category === 'all' && b.is_featured ? { gridColumn: '1 / -1' } : undefined}><BlogCard b={b} featured={i === 0 && category === 'all' && b.is_featured} /></Item>)}</Stagger>
          : <Empty icon="file" title="No posts in this category yet" text="Check back soon or browse all posts." action={<Link className="btn btn-outline" href="/blog">All posts</Link>} />}
      </div></section>
      <section className="cta-final section-alt"><div className="container"><h2>Ready to take the next step?</h2><p>Register in minutes, or tell us who you need to hire.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/register">Register as a candidate</Link><Link className="btn btn-outline btn-lg" href="/employers#request-talent">Request Talent</Link></div></div></section>
    </>
  );
}
