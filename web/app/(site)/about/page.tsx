import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';

export const metadata: Metadata = { title: 'About Amani Tech — Staffing Partner for IT and Non-IT Hiring', description: 'Who we are and how we work. Amani Tech is a staffing partner that treats hiring as a human process.', alternates: { canonical: '/about' } };

const VALUES = [['check', 'Honesty first', 'We say what we can deliver, and we deliver it.'], ['clock', 'Respect for time', 'Fast responses, clear next steps, no dead ends.'], ['usercheck', 'Quality over volume', 'A short list of right candidates beats a long list of maybes.'], ['heart', 'Long-term relationships', 'We want to be the recruiter you call next time too.']];
const PROCESS = [['Understand', 'the role and the person'], ['Source', 'network and active search'], ['Screen', 'skills, fit, intent'], ['Introduce', 'with recruiter notes'], ['Support', 'through joining']];
// Placeholder photography — replace with Amani Tech's own team imagery before launch.
const PHOTOS = ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80'];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">About Amani Tech</span></Enter>
        <Enter delay={0.08}><h1 style={{ maxWidth: 760 }}>A staffing partner that treats hiring as a human process.</h1></Enter>
        <Enter delay={0.16}><p className="lead">We started Amani Tech because hiring had become noisy. Job seekers were sending applications into a void, and employers were sorting through hundreds of irrelevant profiles. We believe a good recruiter — backed by a good platform — fixes both problems.</p></Enter>
      </div></section>

      <section className="section"><div className="container split">
        <Reveal><span className="eyebrow">Our story</span><h2>From a small recruitment desk to IT and non-IT placements across India</h2>
          <p>Amani Tech began as a small IT recruitment desk in Hyderabad. Today we place candidates across technology, finance, engineering and operations for companies ranging from start-ups to established enterprises.</p>
          <p>Our approach has not changed: understand the role, understand the person, and only make an introduction when both fit.</p>
          <p>We work from Hyderabad with clients in India and overseas — including companies in North America, Europe, the Middle East and APAC who hire here, build technology with us, or set up a capability centre of their own.</p></Reveal>
        <Reveal delay={0.1}><div className="grid grid-2" style={{ gap: 12 }}>
          <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden' }}><Image src={PHOTOS[0]} alt="Amani Tech team" fill sizes="(max-width:768px) 50vw, 300px" style={{ objectFit: 'cover' }} /></div>
          <div className="stack">{PHOTOS.slice(1).map(p => <div key={p} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden' }}><Image src={p} alt="" fill sizes="(max-width:768px) 50vw, 300px" style={{ objectFit: 'cover' }} /></div>)}</div>
        </div></Reveal>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">What we do</span><h2>Two audiences. One standard.</h2></div></Reveal>
        <Stagger className="grid grid-2">
          <Item><div className="card service-card"><div className="ico"><Icon name="user" /></div><h3>For job seekers</h3><p>Genuine openings, a simple application, and a recruiter who follows up. No fees, ever.</p><Link className="btn btn-primary" href="/jobs">Find Jobs</Link></div></Item>
          <Item><div className="card service-card"><div className="ico"><Icon name="building" /></div><h3>For employers</h3><p>Sourcing, screening and shortlisting for contract, permanent and project hiring across IT and non-IT roles.</p><Link className="btn btn-outline" href="/employers#request-talent">Request Talent</Link></div></Item>
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
