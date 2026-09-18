import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/motion';
import { getOpening } from '@/lib/queries';
import { fmtDate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const c = await getOpening((await params).slug); return c ? { title: `${c.position} — Careers`, description: c.description.slice(0, 155), alternates: { canonical: `/careers/${c.slug}` } } : {}; }

export default async function OpeningPage({ params }: Props) {
  const { slug } = await params;
  const c = await getOpening(slug);
  if (!c) notFound();
  const List = ({ items }: { items: string[] }) => <ul>{items.map(x => <li key={x}>{x}</li>)}</ul>;
  return (
    <>
      <section className="job-head"><div className="container">
        <ol className="breadcrumb"><li><Link href="/">Home</Link></li><li><Link href="/careers">Careers</Link></li><li aria-current="page">{c.position}</li></ol>
        <span className="badge badge-neutral">{c.department}</span>
        <h1 className="mt-16" style={{ fontSize: 'var(--fs-3xl)' }}>{c.position}</h1>
        <div className="meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}><span><Icon name="pin" className="icon-sm" /> {c.location} · {c.work_mode}</span><span><Icon name="briefcase" className="icon-sm" /> {c.experience}</span><span><Icon name="calendar" className="icon-sm" /> Posted {fmtDate(c.published_at)}</span></div>
      </div></section>
      <div className="container job-layout">
        <article className="prose">
          <Reveal><h2>About the role</h2><p>{c.description}</p></Reveal>
          {c.responsibilities.length > 0 && <Reveal><h2>Responsibilities</h2><List items={c.responsibilities} /></Reveal>}
          {c.requirements.length > 0 && <Reveal><h2>Requirements</h2><List items={c.requirements} /></Reveal>}
          {c.benefits.length > 0 && <Reveal><h2>Benefits</h2><List items={c.benefits} /></Reveal>}
        </article>
        <aside className="stack" style={{ gap: 16 }}>
          <div className="side-card"><h3>How to apply</h3><p className="small">{c.application_instructions}</p><a className="btn btn-primary btn-block" href={`mailto:careers@amanitech.in?subject=${encodeURIComponent(c.position)}`}>Email your application</a></div>
          <div className="side-card"><h3>About working here</h3><p className="small muted" style={{ margin: 0 }}>We are direct, warm and practical. Structured onboarding, clear progression and a team that backs you. <Link href="/careers">Read more about life at Amani Tech</Link>.</p></div>
        </aside>
      </div>
    </>
  );
}
