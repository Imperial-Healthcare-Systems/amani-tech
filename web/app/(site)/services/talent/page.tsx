import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { EMPLOYER_STEPS, ServiceCard, Steps } from '@/components/cards';
import { getServices } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Talent Solutions — Permanent, Contract & Executive Search',
  description: 'Permanent recruitment, contract staffing and executive search across IT and non-IT. Flexible, scalable engagement models that connect organisations with the right talent.',
  alternates: { canonical: '/services/talent' },
};

const MODELS = [
  ['usercheck', 'Permanent Recruitment', 'End-to-end hiring for full-time roles across technical and business functions. Sourced and screened by us, hired onto your payroll.'],
  ['clock', 'Contract Staffing', "Flexible, project-based talent for short- and medium-term needs — professionals on Amani Tech's payroll, deployed to you for a defined period."],
  ['star', 'Executive Search', 'Targeted search for senior leadership and specialised roles, run discreetly and to a defined brief.'],
  ['layers', 'Project Teams', 'Teams assembled for a scope and timeline, scaled up or down as the work changes.'],
];
const COVERAGE = [
  ['IT', ['AI / ML', 'Software Engineering', 'Cloud & DevOps', 'Data Engineering', 'Cybersecurity', 'QA & Automation', 'ERP & Enterprise Apps', 'IT Project & Program Management']],
  ['Non-IT', ['Finance & Accounting', 'Sales & Marketing', 'Human Resources', 'Operations & Supply Chain', 'Engineering & Manufacturing', 'Customer Support', 'Administration']],
] as const;
const INDUSTRIES = ['IT Services & Product', 'Banking, Financial Services & Insurance', 'Manufacturing & Engineering', 'Healthcare & Pharma', 'Retail & E-commerce', 'Education & EdTech', 'Logistics & Supply Chain', 'Telecom'];

export default async function TalentSolutionsPage() {
  const services = await getServices();
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">Talent Solutions</span></Enter>
        <Enter delay={0.08}><h1>The right skills, connected to the right opportunities</h1></Enter>
        <Enter delay={0.16}><p className="lead">We connect organisations with the right talent through flexible, scalable engagement models — from a single specialist to a full project team, across IT and non-IT functions.</p></Enter>
        <Enter delay={0.24}><div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">Request Talent</Link><Link className="btn btn-outline btn-lg" href="#models">See engagement models</Link></div></Enter>
      </div></section>

      {services.length > 0 && (
        <section className="section"><div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">What we staff</span><h2>Staffing services</h2></div></Reveal>
          <Stagger className="grid grid-3">{services.map(s => <Item key={s.id}><ServiceCard s={s} /></Item>)}</Stagger>
        </div></section>
      )}

      <section className="section section-alt" id="models"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Engagement models</span><h2>Choose how you want to hire</h2><p className="lead">Most clients start with one model and add another as the work changes. You keep the same recruiters either way.</p></div></Reveal>
        <Stagger className="grid grid-2">{MODELS.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Coverage</span><h2>IT and non-IT, under one roof</h2><p className="lead">Talent solutions spanning technical and broader business functions, so you are not managing two vendors.</p></div></Reveal>
        <Stagger className="grid grid-2">{COVERAGE.map(([label, items]) => (
          <Item key={label}><div className="value-card">
            <h3>{label}</h3>
            <div className="row" style={{ gap: 8, marginTop: 12 }}>{items.map(x => <span key={x} className="chip">{x}</span>)}</div>
          </div></Item>
        ))}</Stagger>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Industries</span><h2>Industries we serve</h2></div></Reveal>
        <Reveal delay={0.1}><div className="row" style={{ gap: 10 }}>{INDUSTRIES.map(i => <span key={i} className="chip">{i}</span>)}</div></Reveal>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Process</span><h2>From requirement to joining</h2></div></Reveal>
        <Reveal delay={0.1}><Steps items={EMPLOYER_STEPS} /></Reveal>
      </div></section>

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">For employers</span><h2>Looking for the right talent?</h2><p>Tell us about the role. Our recruiters will source, screen and shortlist candidates for you.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">Request Talent</Link><Link className="btn btn-outline-light btn-lg" href="/gcc">Building a GCC instead?</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
