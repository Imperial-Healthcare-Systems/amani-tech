import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Item, Stagger } from '@/components/motion';
import { BlogCard } from '@/components/cards';
import { getPost, getPosts } from '@/lib/queries';
import { fmtDate } from '@/lib/format';
import { markdownToHtml } from '@/lib/markdown';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getPost((await params).slug);
  return b ? { title: b.seo_title || b.title, description: b.seo_description || b.excerpt, alternates: { canonical: `/blog/${b.slug}` }, openGraph: { type: 'article', images: b.cover_image ? [b.cover_image] : undefined } } : { title: 'Article not found' };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const b = await getPost(slug);
  if (!b) notFound();
  const related = (await getPosts(b.category)).filter(x => x.slug !== b.slug).slice(0, 3);
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: b.title, datePublished: b.published_at, author: { '@type': 'Organization', name: b.author }, image: b.cover_image || undefined, description: b.excerpt };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="section" style={{ paddingTop: 40 }}><div className="container article">
        <ol className="breadcrumb"><li><Link href="/">Home</Link></li><li><Link href="/blog">Blog</Link></li><li aria-current="page">{b.category}</li></ol>
        <header><span className="tag">{b.category}</span><h1 className="mt-16">{b.title}</h1><div className="meta"><span>By {b.author}</span><span>·</span><span>{fmtDate(b.published_at)}</span><span>·</span><span>{b.read_minutes} min read</span></div></header>
        <div className="article-hero" style={{ position: 'relative' }}>{b.cover_image && <Image src={b.cover_image} alt="" fill priority sizes="(max-width:768px) 100vw, 760px" style={{ objectFit: 'cover' }} />}</div>
        <div className="prose"><p><strong>{b.excerpt}</strong></p><div dangerouslySetInnerHTML={{ __html: markdownToHtml(b.content) }} /></div>
        {b.tags.length > 0 && <div className="row mt-24" style={{ gap: 8 }}>{b.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>}
        <div className="author-box"><div className="avatar">AT</div><div><strong style={{ color: 'var(--navy-900)' }}>{b.author}</strong><div className="small muted">Written by the Amani Tech recruitment team.</div></div></div>
        <div className="cta-band mt-48"><h2 style={{ fontSize: 'var(--fs-2xl)' }}>Looking for your next role?</h2><p>Browse open positions across IT and non-IT categories.</p><div className="row"><Link className="btn btn-primary" href="/jobs">Find Jobs</Link><Link className="btn btn-outline-light" href="/employers#request-talent">Hiring? Request Talent</Link></div></div>
      </div></article>
      {related.length > 0 && <section className="section section-alt"><div className="container"><div className="section-head"><h2 style={{ fontSize: 'var(--fs-2xl)' }}>Related articles</h2></div><Stagger className="grid grid-3">{related.map(x => <Item key={x.id}><BlogCard b={x} /></Item>)}</Stagger></div></section>}
    </>
  );
}
