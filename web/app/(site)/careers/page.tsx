import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { CareerCard, Empty } from '@/components/cards';
import { getOpenings } from '@/lib/queries';

export const metadata: Metadata = { title: 'Careers at Amani Tech — Join Our Recruitment Team', description: 'Help people find work they are proud of. Open roles at Amani Tech in recruitment, client services and technology.', alternates: { canonical: '/careers' } };

const WHY = [['heart', 'Meaningful work', "Every placement changes someone's week, month or year."], ['zap', 'Ownership from day one', 'Your own mandates, your own clients, your own results.'], ['graduation', 'Learning built in', 'Structured onboarding and recruiter certification.'], ['users', 'A team that backs you', 'Senior recruiters mentor, not micromanage.']];
const BENEFITS = ['Health insurance', 'Performance incentives', 'Hybrid working', 'Learning budget', 'Paid time off', 'Team events'];
// Placeholder photography — replace with Amani Tech's own team imagery before launch.
const LIFE = ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80'];

export default async function CareersPage() {
  const openings = await getOpenings();
  return (
    <>
      <section className="page-hero dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80" alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: .25 }} />
        <div className="container" style={{ position: 'relative' }}>
          <Enter><span className="eyebrow">Careers at Amani Tech</span></Enter>
          <Enter delay={0.08}><h1 style={{ maxWidth: 720 }}>Help people find work they are proud of.</h1></Enter>
          <Enter delay={0.16}><p className="lead">We are a team of recruiters, account managers and technologists who believe good hiring changes lives. If that sounds like you, take a look at our open roles.</p></Enter>
          <Enter delay={0.24}><div className="row"><a className="btn btn-primary btn-lg" href="#openings">See open roles</a></div></Enter>
        </div>
      </section>
      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Why Amani Tech</span><h2>Work that matters, with people who back you</h2></div></Reveal>
        <Stagger className="grid grid-4">{WHY.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>
      <section className="section section-alt"><div className="container split">
        <Reveal><span className="eyebrow">Culture</span><h2>Direct, warm and practical</h2><p>We celebrate placements, learn from misses, and never let a candidate or client go unanswered. We say what we mean, we help each other close, and we go home on time more often than not.</p>
          <h3 className="mt-32" style={{ fontSize: 'var(--fs-xl)' }}>Growth</h3><p>Structured onboarding, recruiter certification, a clear path from Associate to Lead, and mentoring from senior recruiters.</p></Reveal>
        <Stagger className="grid grid-2" style={{ gap: 12 }}>{LIFE.map(p => <Item key={p}><div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden' }}><Image src={p} alt="Life at Amani Tech" fill sizes="(max-width:768px) 50vw, 300px" style={{ objectFit: 'cover' }} /></div></Item>)}</Stagger>
      </div></section>
      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Benefits</span><h2>What we offer</h2></div></Reveal>
        <Stagger className="grid grid-3">{BENEFITS.map(b => <Item key={b}><div className="benefit"><Icon name="check" />{b}</div></Item>)}</Stagger>
      </div></section>
      <section className="section section-alt" id="openings"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Current openings</span><h2>Open roles at Amani Tech</h2><p className="lead">These are roles on our own team — not client positions. Looking for client jobs? <Link href="/jobs">Browse the job board</Link>.</p></div></Reveal>
        {openings.length ? <Stagger className="grid grid-2">{openings.map(c => <Item key={c.id}><CareerCard c={c} /></Item>)}</Stagger>
          : <Empty icon="briefcase" title="No openings right now" text="Send your resume to careers@amanitech.in and we will keep it on file." />}
        <p className="small muted mt-24">Don&apos;t see a fit? Send your resume to <a href="mailto:careers@amanitech.in">careers@amanitech.in</a> and we will keep it on file.</p>
      </div></section>
    </>
  );
}
