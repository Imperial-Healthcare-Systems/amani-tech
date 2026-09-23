import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion';
import { GccHero } from '@/components/GccHero';
import { ScopeCards } from '@/components/ScopeCards';
import { RunJourney, type RunStage } from '@/components/RunJourney';
import { WhyGcc, type WhyGccPoint } from '@/components/WhyGcc';

export const metadata: Metadata = {
  title: 'GCC Practice — Set Up Your Global Capability Center in Hyderabad',
  description: 'A complete landing partner for companies worldwide establishing a Global Capability Center in Hyderabad: incorporation, office space, compliances, permissions and the team itself.',
  alternates: { canonical: '/gcc' },
};

const SCOPE = [
  {
    art: 'legal', title: 'Legal incorporation', text: 'Your Indian entity, set up correctly the first time.',
    points: ['Entity structuring advice', 'Company registration and statutory filings', 'PAN, TAN, GST and bank account setup', 'Transfer pricing and accounting partners'],
    detail: 'We handle the incorporation process end to end, coordinating with legal, accounting and statutory partners so your Indian entity is established correctly and efficiently.',
    detailPoints: ['Entity structuring and incorporation coordination', 'Statutory registrations and documentation', 'PAN, TAN, GST and banking setup', 'Accounting and transfer pricing coordination'],
  },
  {
    art: 'office', title: 'Real estate & office setup', text: 'A place to work, ready before your first hire starts.',
    points: ['Location and lease advisory across Hyderabad', 'Negotiation and documentation', 'Fit-out, furnishing and IT infrastructure', 'Managed or co-working options for the early phase'],
    detail: 'From selecting the right location to getting the workspace operational, we coordinate the physical infrastructure required to launch your GCC.',
    detailPoints: ['Hyderabad location and lease advisory', 'Lease negotiation and documentation', 'Office fit-out and IT infrastructure', 'Flexible workspace options for the launch phase'],
  },
  {
    art: 'compliance', title: 'Compliance & permissions', text: 'The bureaucratic layer, handled by people who do it every week.',
    points: ['Local government registrations and permissions', 'Labour law and payroll compliance', 'Shops & Establishments, PF, ESI and professional tax', 'Ongoing filings and audit support'],
    detail: 'We manage the regulatory and compliance layer required to establish and operate your GCC in India.',
    detailPoints: ['Local registrations and permissions', 'Labour law and payroll compliance', 'Shops & Establishments, PF and ESI', 'Ongoing filings and audit coordination'],
  },
  {
    art: 'team', title: 'Talent & team build-out', text: 'The reason you came — a capable team, hired well.',
    points: ['Leadership and first-team hiring', 'Engineering, finance, operations and support roles', 'Employer-of-record while your entity is being formed', 'Onboarding, retention and workforce planning'],
    detail: 'Build the team that makes your GCC operational, from leadership and first hires through functional expansion.',
    detailPoints: ['Leadership and first-team recruitment', 'Engineering, finance, operations and support hiring', 'Employer-of-record support during setup', 'Onboarding and workforce planning'],
  },
];

const STAGES: RunStage[] = [
  { art: 'plan', title: 'Plan', body: 'We map your scope, headcount, budget and timeline, and tell you honestly what is realistic.',
    caps: [['target', 'Define scope & goals'], ['users', 'Estimate headcount'], ['chart', 'Build budget & timeline']] },
  { art: 'establish', title: 'Establish', body: 'Entity, office and compliances run in parallel, tracked on one plan with one point of contact.',
    caps: [['file', 'Set up legal entity'], ['building', 'Office & infrastructure'], ['shield', 'Handle compliances']] },
  { art: 'staff', title: 'Staff', body: 'We hire your leadership first, then build the team around them.',
    caps: [['usercheck', 'Leadership hiring'], ['users', 'Build functional teams'], ['trend', 'Scale with your roadmap']] },
  { art: 'operate', title: 'Operate', body: 'Payroll, compliance and workforce support continue for as long as you need them.',
    caps: [['settings', 'Manage payroll & HR'], ['file', 'Ensure ongoing compliance'], ['message', 'Provide continuous support']] },
  { art: 'transition', title: 'Transition', body: 'When you are ready to run it yourself, we hand over cleanly — people, records and vendors.',
    caps: [['graduation', 'Knowledge transfer'], ['file', 'Handover people & records'], ['check', 'Transition vendors']] },
];

const WHY: WhyGccPoint[] = [
  { art: 'hyderabad', title: 'Hyderabad specialists', body: 'One city, known deeply — landlords, authorities, salary benchmarks and talent pools.' },
  { art: 'partner', title: 'One partner, not six', body: 'Lawyers, brokers, compliance vendors and recruiters coordinated by us, billed and tracked in one place.' },
  { art: 'global', title: 'Any headquarters, one destination', body: 'North America, Europe, the Middle East or APAC — the India end of the operation works the same way.' },
  { art: 'control', title: 'You keep control', body: 'Your entity, your people, your IP. We remove the friction, we do not sit between you and your team.' },
];

export default function GccPage() {
  return (
    <>
      <GccHero />

      <ScopeCards
        id="scope"
        eyebrow="Scope of support"
        heading="Everything under one roof"
        lead="Setting up in India means dealing with lawyers, brokers, accountants, government offices and recruiters at once. We carry that load so your transition is frictionless."
        items={SCOPE}
      />

      <RunJourney eyebrow="How it runs" heading="From plan to operating center" stages={STAGES} />

      <WhyGcc eyebrow="Why Amani Tech" heading="A landing partner, not a vendor list" points={WHY} />

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">Considering India?</span><h2>Let&apos;s map your Hyderabad setup</h2><p>Tell us the function you want to build and the headcount you have in mind. We will come back with an indicative plan, timeline and cost.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Start the conversation</Link><Link className="btn btn-outline-light btn-lg" href="/services">Our other services</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
