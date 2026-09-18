import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { EMPLOYER_STEPS, ServiceCard, Steps } from '@/components/cards';
import { getServices } from '@/lib/queries';

export const metadata: Metadata = { title: 'Staffing Services — IT, Non-IT, Contract & Permanent', description: 'IT staffing, non-IT staffing, contract, permanent, bulk and entry-level hiring. From a single specialist to a full project team.', alternates: { canonical: '/services' } };

const MODELS = [['clock', 'Contract', "Skilled professionals on Amani Tech's payroll, deployed to you for a defined period."], ['usercheck', 'Permanent', 'Full-time hires on your payroll, sourced and screened by us.'], ['layers', 'Project', 'Teams assembled for a scope and timeline, scaled up or down as the work changes.']];
const INDUSTRIES = ['IT Services & Product', 'Banking, Financial Services & Insurance', 'Manufacturing & Engineering', 'Healthcare & Pharma', 'Retail & E-commerce', 'Education & EdTech', 'Logistics & Supply Chain', 'Telecom'];

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">Services</span></Enter>
        <Enter delay={0.08}><h1>Staffing services for growing teams</h1></Enter>
        <Enter delay={0.16}><p className="lead">From a single specialist to a full project team, Amani Tech provides the sourcing, screening and coordination that makes hiring predictable.</p></Enter>
        <Enter delay={0.24}><div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">Request Talent</Link></div></Enter>
      </div></section>
      <section className="section"><div className="container"><Stagger className="grid grid-3">{services.map(s => <Item key={s.id}><ServiceCard s={s} /></Item>)}</Stagger></div></section>
      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Engagement models</span><h2>Choose how you want to hire</h2></div></Reveal>
        <Stagger className="grid grid-3">{MODELS.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>
      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Industries</span><h2>Industries we serve</h2></div></Reveal>
        <Reveal delay={0.1}><div className="row" style={{ gap: 10 }}>{INDUSTRIES.map(i => <span key={i} className="chip">{i}</span>)}</div></Reveal>
      </div></section>
      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Process</span><h2>From requirement to joining</h2></div></Reveal>
        <Reveal delay={0.1}><Steps items={EMPLOYER_STEPS} /></Reveal>
      </div></section>
      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">For employers</span><h2>Looking for the right talent?</h2><p>Tell us about the role. Our recruiters will source, screen and shortlist candidates for you.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">Request Talent</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
