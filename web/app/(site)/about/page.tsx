import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';

export const metadata: Metadata = { title: 'About Amani Tech — Global Staffing and Technology Solutions', description: 'A global staffing and technology solutions firm helping enterprises build, scale and transform their teams and operations. Headquartered in Hyderabad, with operations in Toronto.', alternates: { canonical: '/about' } };

const VALUES = [['check', 'Honesty first', 'We say what we can deliver, and we deliver it.'], ['clock', 'Respect for time', 'Fast responses, clear next steps, no dead ends.'], ['usercheck', 'Quality over volume', 'A short list of right candidates beats a long list of maybes.'], ['heart', 'Long-term relationships', 'We want to be the recruiter you call next time too.']];
// The three pillars the company is built on, and the two offices it runs from.
const PILLARS = [
  ['users', 'People-first talent solutions', 'Connecting the right skills to the right opportunities, with a recruiter who understands both sides of the introduction.'],
  ['code', 'Technical depth', 'Real delivery capability across modern cloud, engineering and data platforms — not a reseller of someone else’s work.'],
  ['layers', 'Operational partnership', 'We go beyond placement, helping clients build lasting infrastructure: a GCC, a technology team, or an automated business system.'],
] as const;

const OFFICES = [
  ['Hyderabad, India', 'Our India headquarters anchors our GCC Practice and technical delivery capabilities, based in one of India’s fastest-growing technology hubs.', 'Sy No: 126, 5th Floor, Shanta Sriram Building, PSR Prime Towers Rd, beside DLF Building, DLF Cyber City, Indira Nagar, Gachibowli, Hyderabad, Telangana 500032', ['+91-9398864012', '+91-7989033369']],
  ['Toronto, Canada', 'Our Canada presence supports North American clients across staffing, technology services and digital transformation engagements.', '112 Charles Street West, Toronto, ON M5S 1K9, Canada', ['+1-647-873-5786']],
] as const;

const PROCESS = [['Understand', 'the role and the person'], ['Source', 'network and active search'], ['Screen', 'skills, fit, intent'], ['Introduce', 'with recruiter notes'], ['Support', 'through joining']];
// Placeholder photography — replace with Amani Tech's own team imagery before launch.
const PHOTOS = ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80'];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">About Amani Tech</span></Enter>
        <Enter delay={0.08}><h1 style={{ maxWidth: 820 }}>Building global teams. Powering digital transformation.</h1></Enter>
        <Enter delay={0.16}><p className="lead">Amani Tech is a global staffing and technology solutions firm dedicated to helping enterprises build, scale and transform their teams and operations. We combine deep talent acquisition expertise with strong technical delivery capability — across recruitment, Global Capability Center setup, technology services and digital transformation.</p></Enter>
      </div></section>

      <section className="section"><div className="container split">
        <Reveal><span className="eyebrow">Our story</span><h2>From a small recruitment desk to a global technology and talent partner</h2>
          <p>Amani Tech began as a small IT recruitment desk in Hyderabad. Today we place candidates across technology, finance, engineering and operations for companies ranging from start-ups to established enterprises.</p>
          <p>Our approach has not changed: understand the role, understand the person, and only make an introduction when both fit.</p>
          <p>Today we work from Hyderabad and Toronto with clients worldwide — companies who hire here, build technology with us, or set up a capability centre of their own.</p></Reveal>
        <Reveal delay={0.1}><div className="grid grid-2" style={{ gap: 12 }}>
          <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden' }}><Image src={PHOTOS[0]} alt="Amani Tech team" fill sizes="(max-width:768px) 50vw, 300px" style={{ objectFit: 'cover' }} /></div>
          <div className="stack">{PHOTOS.slice(1).map(p => <div key={p} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden' }}><Image src={p} alt="" fill sizes="(max-width:768px) 50vw, 300px" style={{ objectFit: 'cover' }} /></div>)}</div>
        </div></Reveal>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Our approach</span><h2>Built on three pillars</h2></div></Reveal>
        <Stagger className="grid grid-3">{PILLARS.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>

      <section className="section" id="footprint"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Global footprint</span><h2>Two offices, clients worldwide</h2><p className="lead">Headquartered in Hyderabad, India, with operations in Toronto, Canada — bridging global talent hubs with enterprise technology needs.</p></div></Reveal>
        <Stagger className="grid grid-2">{OFFICES.map(([city, blurb, address, phones]) => (
          <Item key={city}><div className="value-card">
            <div className="ico"><Icon name="globe" /></div>
            <h3>{city}</h3><p>{blurb}</p>
            <div className="info-item" style={{ marginTop: 16 }}><div className="ico"><Icon name="pin" /></div><div><p>{address}</p></div></div>
            <div className="info-item"><div className="ico"><Icon name="phone" /></div><div><p>{phones.map(t => <a key={t} href={`tel:${t.replace(/[^+\d]/g, '')}`} style={{ marginRight: 12 }}>{t}</a>)}</p></div></div>
          </div></Item>
        ))}</Stagger>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Who we work with</span><h2>Two audiences. One standard.</h2></div></Reveal>
        <Stagger className="grid grid-2">
          <Item><div className="card service-card"><div className="ico"><Icon name="building" /></div><h3>For employers</h3><p>Technology delivery, staffing across IT and non-IT, GCC setup in Hyderabad, and the automation that scales your operations.</p><Link className="btn btn-primary" href="/employers">For Employers</Link></div></Item>
          <Item><div className="card service-card"><div className="ico"><Icon name="user" /></div><h3>For candidates</h3><p>Genuine openings, a simple application, and a recruiter who follows up — from first submission through to placement. No fees, ever.</p><Link className="btn btn-outline" href="/candidates">For Candidates</Link></div></Item>
        </Stagger>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Values</span><h2>What we hold ourselves to</h2></div></Reveal>
        <Stagger className="grid grid-4">{VALUES.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head center"><span className="eyebrow">How we work</span><h2>Five steps, every time</h2></div></Reveal>
        <Stagger className="process-line">{PROCESS.map(([t, s]) => <Item key={t}><div>{t}<small>{s}</small></div></Item>)}</Stagger>
      </div></section>

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">For employers</span><h2>Looking for the right talent?</h2><p>Tell us about the role. Our recruiters will source, screen and shortlist candidates for you.</p>
          <div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">Request Talent</Link><Link className="btn btn-outline-light btn-lg" href="/contact">Contact us</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
