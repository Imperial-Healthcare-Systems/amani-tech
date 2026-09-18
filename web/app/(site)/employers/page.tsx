import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { FaqList, ServiceCard } from '@/components/cards';
import { HowItWorks } from '@/components/HowItWorks';
import { hand } from '@/components/fonts';
import { EmployerForm } from '@/components/forms/EmployerForm';
import { getContent, getFaqs, getServices } from '@/lib/queries';
import type { SettingsContent } from '@/lib/types';

export const metadata: Metadata = { title: 'Hire Talent — Staffing Services for Employers', description: 'Submit a staffing requirement and receive a screened shortlist. Contract, permanent and project hiring across IT and non-IT roles.', alternates: { canonical: '/employers' } };

const WHY = [
  ['usercheck', 'Screened, not scraped', 'Every profile is reviewed by a recruiter before it reaches you.', '/services/permanent-recruitment'],
  ['users', 'One partner for IT and non-IT', 'Stop juggling multiple agencies. Get all your hiring needs in one place.', '/services'],
  ['sliders', 'Flexible engagement', 'Contract, permanent, project or bulk. Hire the way you need.', '/services/contract-staffing'],
  ['message', 'Clear communication', 'A single point of contact and regular updates at every step.', '#request-talent'],
] as const;
const WHY_COLORS = ['#2563EB', '#7C3AED', '#0E9F6E', '#EA580C'];
const NEXT = [['phone', 'We confirm the requirement', 'A recruiter calls to understand the role and priorities.'], ['search', 'We source and screen', 'From our network and active channels.'], ['file', 'You receive a shortlist', 'With recruiter notes on each candidate.'], ['usercheck', 'We coordinate interviews and joining', 'Right through to the first day.']];

export default async function EmployersPage() {
  const [services, faqs, settings] = await Promise.all([getServices(), getFaqs(), getContent<SettingsContent>('settings', { site_name: 'Amani Tech', seo_suffix: '', seo_description: '', employer_sla: 'within one business day', notify_emails: '' })]);
  const sla = settings.payload.employer_sla || 'within one business day';
  return (
    <>
      <section className="emp-hero">
        <Image src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80" alt="" fill priority sizes="100vw" className="emp-hero-photo" />
        <span className="emp-hero-tint" aria-hidden="true" />
        <div className="container split emp-hero-grid">
          <div>
            <Enter><span className="emp-eyebrow">For employers</span></Enter>
            <Enter delay={0.08}><h1 className="emp-h1">Looking for the<br /><span className="grad">Right Talent?</span></h1></Enter>
            <Enter delay={0.16}><p className="lead">Tell us what you need. Our recruiters source, screen and shortlist candidates so you can hire with confidence — on contract, permanent or project terms.</p></Enter>
            <Enter delay={0.24}>
              <div className="row emp-actions"><a className="btn btn-primary btn-lg" href="#request-talent">Request Talent <Icon name="arrow" /></a><Link className="btn btn-outline-light btn-lg" href="/services">See our services</Link></div>
              <ul className="emp-trust">
                <li><span className="ico"><Icon name="users" /></span><div><strong>IT and non-IT</strong><small>Across industries</small></div></li>
                <li><span className="ico"><Icon name="file" /></span><div><strong>Contract and permanent</strong><small>Flexible hiring</small></div></li>
                <li><span className="ico"><Icon name="zap" /></span><div><strong>Shortlists in days</strong><small>Not weeks</small></div></li>
              </ul>
            </Enter>
          </div>
          <Enter delay={0.2}>
            <div className="emp-card">
              <div className="emp-card-head"><h2>What you get</h2><span className="emp-pill"><Icon name="building" />A dedicated recruitment partner</span></div>
              <ul className="emp-list">
                <li><span className="ico"><Icon name="target" /></span><div><strong>A single point of contact</strong><small>Who understands your requirement</small></div></li>
                <li><span className="ico"><Icon name="users" /></span><div><strong>Recruiter-screened profiles</strong><small>With notes, not raw resumes</small></div></li>
                <li><span className="ico"><Icon name="calendar" /></span><div><strong>Interview coordination</strong><small>Offer support and joining follow-up</small></div></li>
                <li><span className="ico"><Icon name="clock" /></span><div><strong>Response {sla}</strong><small>So you can keep moving</small></div></li>
              </ul>
            </div>
          </Enter>
        </div>
      </section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">What we offer</span><h2>Staffing services built around how you hire</h2></div></Reveal>
        <Stagger className="grid grid-3">{services.map(s => <Item key={s.id}><ServiceCard s={s} /></Item>)}</Stagger>
      </div></section>

      <HowItWorks audience="employer" />

      <section className={`section why-emp ${hand.variable}`}>
        <span className="why-dots why-dots-l" aria-hidden="true" />
        <span className="why-dots why-dots-r" aria-hidden="true" />
        <p className="why-note" aria-hidden="true"><svg viewBox="0 0 60 40" aria-hidden="true"><path d="M52 4C40 12 26 24 8 34M14 34l-8 2 2-8" /></svg>The right<br />people. A stronger<br />tomorrow.</p>
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">Why employers choose us</span><h2>Screened talent.<br /><span className="accent">Smarter hiring.</span></h2><p className="lead">Pre-vetted, high-quality talent with a hiring experience built for speed, clarity and results.</p></div></Reveal>
          <Stagger className="why-grid">
            {WHY.map(([i, t, d, href], n) => (
              <Item key={t} className="why-item">
                <Link className="why-card" href={href} style={{ '--c': WHY_COLORS[n] } as React.CSSProperties}>
                  <span className="why-num" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                  <span className="why-ico"><Icon name={i} /></span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                  <span className="why-foot"><span className="why-more">Learn more <Icon name="arrow" /></span><span className="why-btn" aria-hidden="true"><Icon name="arrow" /></span></span>
                </Link>
              </Item>
            ))}
          </Stagger>
          <Reveal><p className="why-tag"><span>Trusted by employers who build what&apos;s next</span></p></Reveal>
        </div>
      </section>

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
