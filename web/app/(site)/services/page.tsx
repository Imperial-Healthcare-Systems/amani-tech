import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';

export const metadata: Metadata = {
  title: 'Services — Technology, Talent, GCC & Digital Transformation',
  description: 'Four practices under one partner: technology services, talent solutions, the GCC practice for capability centers in Hyderabad, and digital transformation.',
  alternates: { canonical: '/services' },
};

/** One band per practice. The order matches the header menu and the home page — these four names
 *  are the only service names used anywhere on the site. */
const PRACTICES = [
  {
    eyebrow: 'Practice 01', title: 'Technology Services', href: '/services/it-consulting', cta: 'Explore Technology Services',
    lead: 'We deliver high-impact technology solutions that help organisations build, secure and scale their digital infrastructure.',
    items: [
      ['Cloud Platforms', 'Architecture, migration and management across AWS, Azure and GCP.'],
      ['Custom Web & App Development', 'End-to-end design and development of web and mobile applications.'],
      ['Software Testing / QA Automation', 'Automated testing frameworks built with Playwright to ensure quality at scale.'],
      ['DevOps & CI/CD Pipelines', 'Streamlined deployment pipelines that accelerate release cycles and improve reliability.'],
      ['Cybersecurity & Data Protection', 'Safeguarding systems and data against evolving security threats.'],
      ['Applied AI & Data Analytics', 'Turning data into actionable insight through AI-driven analytics and reporting.'],
    ],
  },
  {
    eyebrow: 'Practice 02', title: 'Talent Solutions', href: '/services/talent', cta: 'Explore Talent Solutions',
    lead: 'We connect organisations with the right talent through flexible, scalable engagement models.',
    items: [
      ['Permanent Recruitment', 'End-to-end hiring for full-time roles across technical and business functions.'],
      ['Contract Staffing', 'Flexible, project-based talent for short- and medium-term needs.'],
      ['Executive Search', 'Targeted search for senior leadership and specialised roles.'],
      ['IT & Non-IT Coverage', 'Talent spanning AI/ML, software engineering, cloud, data and broader business functions.'],
    ],
  },
  {
    eyebrow: 'Practice 03', title: 'GCC Practice', href: '/gcc', cta: 'Explore the GCC Practice',
    lead: 'An end-to-end landing partner for enterprises establishing Global Capability Centers in Hyderabad. We manage the entire lifecycle under one roof.',
    items: [
      ['Legal Incorporation', 'Navigating entity setup and regulatory registration.'],
      ['Office Leasing', 'Identifying and securing the right workspace for your team.'],
      ['Local Compliance', 'Full compliance with Indian labour, tax and operational regulations.'],
      ['GCC Talent & Staffing', 'Building AI/ML, engineering, data and cloud teams as the centre matures.'],
    ],
  },
  {
    eyebrow: 'Practice 04', title: 'Digital Transformation', href: '/services/transformation', cta: 'Explore Digital Transformation',
    lead: 'A unified Client Growth & Operations Ecosystem — automating CRM, pipeline management, client acquisition, marketing and operational workflows.',
    items: [
      ['Unified Client Communications', 'Email, WhatsApp and SMS in a single inbox, so no enquiry is missed.'],
      ['Automated Lead & Pipeline Management', 'Custom pipelines that track prospects from first contact to closed deal.'],
      ['Client Onboarding Automation', 'Sequences that trigger the moment a contract is signed.'],
      ['Reputation & Review Automation', 'Review requests tied to project completion, improving local search visibility.'],
      ['AI-Driven Process Automation', 'Replacing manual, repetitive work with intelligent automation.'],
    ],
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">Services</span></Enter>
        <Enter delay={0.08}><h1>Four practices, one partner</h1></Enter>
        <Enter delay={0.16}><p className="lead">Amani Tech helps enterprises build, scale and transform their teams and operations — combining deep talent acquisition expertise with strong technical delivery capability.</p></Enter>
        <Enter delay={0.24}><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Talk to us</Link><Link className="btn btn-outline btn-lg" href="/employers#request-talent">Request Talent</Link></div></Enter>
      </div></section>

      {PRACTICES.map((p, i) => (
        <section key={p.title} className={`section ${i % 2 ? 'section-alt' : ''}`} id={p.href.split('/').pop()}>
          <div className="container">
            <Reveal><div className="section-head section-head-row">
              <div><span className="eyebrow">{p.eyebrow}</span><h2>{p.title}</h2><p className="lead">{p.lead}</p></div>
              <Link className="btn btn-outline" href={p.href}>{p.cta} <Icon name="arrow" /></Link>
            </div></Reveal>
            <Stagger className="grid grid-3">{p.items.map(([t, d]) => (
              <Item key={t}><Link className="value-card is-link" href={p.href}><h3>{t}</h3><p>{d}</p></Link></Item>
            ))}</Stagger>
          </div>
        </section>
      ))}

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">Not sure where to start?</span><h2>Tell us the problem, not the practice</h2><p>Describe what you are trying to build, hire or move. We will tell you which of the four fits — or whether it needs more than one.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Contact us</Link><Link className="btn btn-outline-light btn-lg" href="/about">About Amani Tech</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
