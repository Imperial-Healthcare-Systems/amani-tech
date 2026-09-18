import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { EMPLOYER_STEPS, FaqList, ServiceCard, Steps } from '@/components/cards';
import { EmployerForm } from '@/components/forms/EmployerForm';
import { getContent, getFaqs, getServices } from '@/lib/queries';
import type { SettingsContent } from '@/lib/types';

export const metadata: Metadata = { title: 'Hire Talent — Staffing Services for Employers', description: 'Submit a staffing requirement and receive a screened shortlist. Contract, permanent and project hiring across IT and non-IT roles.', alternates: { canonical: '/employers' } };

const WHY = [['usercheck', 'Screened, not scraped', 'Every profile is reviewed by a recruiter before it reaches you.'], ['layers', 'One partner for IT and non-IT', 'Stop juggling multiple agencies.'], ['clock', 'Flexible engagement', 'Contract, permanent, project or bulk.'], ['message', 'Clear communication', 'A single point of contact and regular updates.']];
const NEXT = [['phone', 'We confirm the requirement', 'A recruiter calls to understand the role and priorities.'], ['search', 'We source and screen', 'From our network and active channels.'], ['file', 'You receive a shortlist', 'With recruiter notes on each candidate.'], ['usercheck', 'We coordinate interviews and joining', 'Right through to the first day.']];

export default async function EmployersPage() {
  const [services, faqs, settings] = await Promise.all([getServices(), getFaqs(), getContent<SettingsContent>('settings', { site_name: 'Amani Tech', seo_suffix: '', seo_description: '', employer_sla: 'within one business day', notify_emails: '' })]);
  const sla = settings.payload.employer_sla || 'within one business day';
  return (
    <>
      <section className="page-hero dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80" alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: .22 }} />
        <div className="container split" style={{ position: 'relative' }}>
          <div>
            <Enter><span className="eyebrow">For employers</span></Enter>
            <Enter delay={0.08}><h1>Looking for the Right Talent?</h1></Enter>
            <Enter delay={0.16}><p className="lead">Tell us what you need. Our recruiters source, screen and shortlist candidates so you can hire with confidence — on contract, permanent or project terms.</p></Enter>
            <Enter delay={0.24}><div className="row"><a className="btn btn-primary btn-lg" href="#request-talent">Request Talent</a><Link className="btn btn-outline-light btn-lg" href="/services">See our services</Link></div>
              <div className="trust-line" style={{ color: 'rgba(255,255,255,.75)' }}><span><Icon name="check" />IT and non-IT</span><span><Icon name="check" />Contract and permanent</span><span><Icon name="check" />Shortlists in days, not weeks</span></div></Enter>
          </div>
          <Enter delay={0.2}><div className="card" style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.14)', color: '#fff', backdropFilter: 'blur(6px)' }}>
            <h3 style={{ color: '#fff', fontSize: 'var(--fs-lg)' }}>What you get</h3>
            <ul className="stack" style={{ listStyle: 'none', padding: 0, gap: 12, margin: 0 }}>
              {['A single point of contact who understands your requirement', 'Recruiter-screened profiles with notes, not raw resumes', 'Interview coordination, offer support and joining follow-up', `Response ${sla}`].map(t => <li key={t} className="row" style={{ gap: 10, flexWrap: 'nowrap', alignItems: 'flex-start' }}><Icon name="check" className="icon-sm" /><span>{t}</span></li>)}
            </ul></div></Enter>
        </div>
      </section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">What we offer</span><h2>Staffing services built around how you hire</h2></div></Reveal>
        <Stagger className="grid grid-3">{services.map(s => <Item key={s.id}><ServiceCard s={s} /></Item>)}</Stagger>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">How it works</span><h2>From requirement to joining</h2></div></Reveal>
        <Reveal delay={0.1}><Steps items={EMPLOYER_STEPS} /></Reveal>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Why employers choose us</span><h2>Screened, not scraped</h2></div></Reveal>
        <Stagger className="grid grid-4">{WHY.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>

      <section className="section section-alt" id="request-talent"><div className="container form-layout">
        <Reveal><div className="aside-info">
          <div><span className="eyebrow">Request talent</span><h2>Submit a staffing requirement</h2><p className="lead">Takes about three minutes. We respond {sla}.</p></div>
          {NEXT.map(([i, t, d]) => <div key={t} className="info-item"><div className="ico"><Icon name={i} /></div><div><strong>{t}</strong><p>{d}</p></div></div>)}
          <p className="small muted">Prefer to talk? Call <a href="tel:+914000000000">+91 40 0000 0000</a> or email <a href="mailto:employers@amanitech.in">employers@amanitech.in</a>.</p>
        </div></Reveal>
        <Reveal delay={0.1}><EmployerForm sla={sla} /></Reveal>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head center"><span className="eyebrow">Employer FAQ</span><h2>Common questions from employers</h2></div></Reveal>
        <Reveal delay={0.1}><FaqList items={faqs.filter(f => f.group === 'Employers')} /></Reveal>
      </div></section>

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">Staffing partners</span><h2>Are you a staffing firm or independent recruiter?</h2><p>We partner with specialist agencies and recruiters to serve clients across regions and skills.</p><div className="row"><Link className="btn btn-white btn-lg" href="/vendor-registration">Become a staffing partner</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
