import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/motion';
import { EMPLOYER_STEPS, Steps } from '@/components/cards';
import { getService, getServices } from '@/lib/queries';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const s = await getService((await params).slug); return s ? { title: s.title, description: s.short_description, alternates: { canonical: `/services/${s.slug}` } } : {}; }

const INCLUDED = ['Requirement analysis with your hiring manager', 'Sourcing from our candidate network and active channels', 'Skills-based screening — not keyword matching', 'Shortlist with recruiter notes on each candidate', 'Interview coordination and feedback loops', 'Offer and joining support', 'Replacement support as per engagement terms'];

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const [s, all] = await Promise.all([getService(slug), getServices()]);
  if (!s) notFound();
  return (
    <>
      <section className="page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {s.image && <><Image src={s.image} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,.97) 40%, rgba(255,255,255,.75))' }} /></>}
        <div className="container" style={{ position: 'relative' }}>
          <ol className="breadcrumb"><li><Link href="/">Home</Link></li><li><Link href="/services">Services</Link></li><li><Link href="/services/talent">Talent Solutions</Link></li><li aria-current="page">{s.title}</li></ol>
          <span className="eyebrow">Service</span><h1>{s.title}</h1><p className="lead">{s.long_description || s.short_description}</p>
          <div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">Request Talent</Link></div>
        </div>
      </section>
      <section className="section"><div className="container job-layout" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <article className="prose">
          <Reveal><h2>What is included</h2><ul>{INCLUDED.map(i => <li key={i}>{i}</li>)}</ul></Reveal>
          <Reveal><h2>Who it is for</h2><p>Product companies, IT services firms and enterprises building internal teams — as well as manufacturers, financial services companies and growing businesses that need reliable hiring without adding recruiters to their payroll.</p></Reveal>
          {s.roles.length > 0 && <Reveal><h2>Roles we fill</h2><div className="row" style={{ gap: 8 }}>{s.roles.map(r => <span key={r} className="chip">{r}</span>)}</div></Reveal>}
          <Reveal><h2>How it works</h2><div style={{ ['--steps-cols' as string]: '1fr 1fr' }}><Steps items={EMPLOYER_STEPS} /></div></Reveal>
        </article>
        <aside className="stack" style={{ gap: 16 }}>
          <div className="side-card apply-card"><h3>Ready to hire?</h3><p>Tell us about the role and we will respond within one business day.</p><Link className="btn btn-primary btn-block" href="/employers#request-talent">Request Talent</Link></div>
          <div className="side-card"><h3>Other services</h3><div className="stack">{all.filter(x => x.slug !== s.slug).slice(0, 3).map(x => <Link key={x.id} className="cat-tile" href={`/services/${x.slug}`}><div className="ico"><Icon name={x.icon} /></div><div><strong>{x.title}</strong><small>{x.short_description.slice(0, 60)}…</small></div><Icon name="arrow" className="icon-arrow" /></Link>)}</div></div>
        </aside>
      </div></section>
    </>
  );
}
