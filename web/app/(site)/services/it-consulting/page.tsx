import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { PracticeGrid } from '@/components/PracticeGrid';
import { WhyCards } from '@/components/WhyCards';
import { EngageJourney } from '@/components/EngageJourney';
import pg from '@/components/PracticeGrid.module.css';

export const metadata: Metadata = {
  title: 'IT Consulting — AI, Cloud, Security, Software & Data',
  description: 'Enterprise-grade technology consulting built for small and mid-sized businesses: AI and automation, cloud and DevOps, cybersecurity and compliance, custom software, data engineering and analytics.',
  alternates: { canonical: '/services/it-consulting' },
};

const NICHES: { art: string; title: string; lead: string; points: string[] }[] = [
  { art: 'ai', title: 'AI & Automation Solutions', lead: 'Automate the manual work that slows your team down, and put practical AI to work where it pays for itself.', points: ['Workflow and back-office automation', 'Document, email and data-entry processing', 'Chat and knowledge assistants on your own content', 'Integrating AI into the tools you already use'] },
  { art: 'cloud', title: 'Cloud & DevOps', lead: 'Move to the cloud without the guesswork, then ship changes safely and often.', points: ['Infrastructure migration and modernisation', 'CI/CD pipeline automation', 'Scalable, cost-aware architecture', 'Continuous deployment and monitoring'] },
  { art: 'security', title: 'Cybersecurity & Compliance', lead: 'Know where you stand, close the gaps, and keep customer data protected.', points: ['Security audits and vulnerability assessments', 'Data protection frameworks and access control', 'Compliance readiness and documentation', 'Incident response planning'] },
  { art: 'software', title: 'Custom Software & App Development', lead: 'Web and mobile products engineered to grow with the business, not to be rebuilt in a year.', points: ['Product discovery and scoping', 'Web application engineering', 'iOS and Android applications', 'Integrations and API development'] },
  { art: 'data', title: 'Data Engineering & Analytics', lead: 'Turn the data you already collect into reporting leaders actually use.', points: ['Data pipelines and warehousing', 'Reporting and dashboard delivery', 'Data quality and governance', 'Analytics that answer business questions'] },
];

// The strip that runs under the hero — the stacks and practices a visitor scans for.
const TICKER = ['Artificial Intelligence', 'Process Automation', 'Cloud Migration', 'DevOps & CI/CD', 'Cybersecurity Audits', 'Compliance Readiness', 'Web & Mobile Engineering', 'Data Pipelines', 'Dashboards & Reporting', 'Managed Support'];

const HOW = [
  { art: 'discovery', title: 'Discovery', body: 'A short, focused review of your systems, goals and constraints — no obligation.', points: ['Understand your goals', 'Assess current setup', 'Identify opportunities'] },
  { art: 'proposal', title: 'Proposal', body: 'A scoped plan with timelines, team and cost, written in plain language.', points: ['Clear scope and deliverables', 'Transparent pricing', 'Timeline and team structure'] },
  { art: 'build', title: 'Build', body: 'A dedicated engagement team delivers in increments you can see and test.', points: ['Agile, milestone-driven delivery', 'Regular updates and demos', 'Continuous feedback and iteration'] },
  { art: 'handover', title: 'Handover & support', body: 'Documentation, training and ongoing support so your team stays in control.', points: ['Knowledge transfer and training', 'Documentation and playbooks', 'Ongoing support and optimisation'] },
];

const WHY = [
  { art: 'growth', title: 'Enterprise practice, SMB scale', body: 'The same engineering discipline large enterprises pay for, sized and priced for a growing business.', href: '#niches' },
  { art: 'people', title: 'Senior people on your work', body: 'Consultants who have shipped this before, not a layer of coordinators between you and the build.', href: '/about' },
  { art: 'outcomes', title: 'Outcome-based engagements', body: 'Scoped deliverables and clear milestones, so you always know what you are paying for.', href: '/contact' },
  { art: 'talent', title: 'Talent that stays available', body: 'Backed by our staffing practice, so a team can be extended the moment the work grows.', href: '/services' },
];

export default function ItConsultingPage() {
  return (
    <>
      <section className="page-hero dark has-photo">
        <Image src="/it_consulting/hero.png" alt="" fill priority sizes="100vw" className="page-hero-photo" />
        <span className="page-hero-tint" aria-hidden="true" />
        <div className="container">
        <Enter><span className="eyebrow">IT Consulting</span></Enter>
        <Enter delay={0.08}><h1>Enterprise-grade technology, built for your size</h1></Enter>
        <Enter delay={0.16}><p className="lead">Small and mid-sized businesses deserve the same technology standards as large enterprises — without enterprise overheads. We consult, build and support across the five areas where demand is highest right now.</p></Enter>
        <Enter delay={0.24}><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Talk to a consultant</Link><Link className="btn btn-outline-light btn-lg" href="#niches">See what we do</Link></div></Enter>
        </div>
        <div className="hero-scroll"><a href="#niches" aria-label="See what we do"><Icon name="chevron" /></a></div>
        <div className="hero-ticker">
          <div className="marquee"><div className="marquee-track">{[...TICKER, ...TICKER].map((t, i) => <span key={i}>{t}</span>)}</div></div>
        </div>
      </section>

      <section className={`section ${pg.section}`} id="niches"><div className="container">
        <Reveal><div className={`section-head center ${pg.head}`}><span className="eyebrow">What we do</span><h2>Five high-demand practices</h2><p className="lead">Each one is a standalone engagement, or a part of a larger programme we run end to end.</p></div></Reveal>
        <PracticeGrid items={NICHES} />
      </div></section>

      <WhyCards
        eyebrow="Why Amani Tech"
        heading="Consulting without the enterprise tax"
        lead="Access big-company expertise with the agility, speed and cost-efficiency your business actually needs."
        points={WHY}
      />

      <EngageJourney
        eyebrow="How we engage"
        heading="From first call to handover"
        lead="A clear, collaborative process designed to move you from idea to impact — with no confusion and no wasted time."
        stages={HOW}
      />

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">Start a conversation</span><h2>Tell us what you are trying to fix</h2><p>Describe the problem in a few lines. A consultant will come back within one business day with an honest view of what it takes.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Contact us</Link><Link className="btn btn-outline-light btn-lg" href="/employers#request-talent">Need engineers instead?</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
