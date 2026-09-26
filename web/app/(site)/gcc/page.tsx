import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Item, Reveal, Stagger } from '@/components/motion';
import { GccHero } from '@/components/GccHero';
import { ScopeCards } from '@/components/ScopeCards';
import { EngageTimeline } from '@/components/EngageTimeline';
import type { RunStage } from '@/components/RunJourney';
import { WhyGcc, type WhyGccPoint } from '@/components/WhyGcc';

export const metadata: Metadata = {
  title: 'GCC Practice — Set Up Your Global Capability Center in Hyderabad',
  description: 'A complete landing partner for companies worldwide establishing a Global Capability Center in Hyderabad: incorporation, office space, compliances, permissions and the team itself.',
  alternates: { canonical: '/gcc' },
};

// The technology domains a new capability centre hires into first.
const GCC_TALENT = [
  ['zap', 'Artificial Intelligence & Machine Learning', 'Applied AI, ML engineering and data science roles — the hardest hires in the Hyderabad market, and the ones we run most.'],
  ['code', 'Software Engineering', 'Backend, frontend and full-stack engineers, plus the leads and architects who hold a new team together.'],
  ['chart', 'Data', 'Data engineering, platform and analytics roles that turn a new centre into a reporting capability, not just a cost centre.'],
  ['layers', 'Cloud / DevOps', 'Platform, infrastructure and reliability engineers to stand up the environments your teams build on.'],
  ['shield', 'Cybersecurity', 'Security engineering and compliance roles, aligned to the frameworks your parent company already answers to.'],
  ['users', 'Other high-demand domains', 'QA automation, ERP, product and programme management — the roles that appear once the centre finds its shape.'],
] as const;

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
  { art: 'plan', title: 'Assess & Plan', body: 'We map your scope, headcount, budget and timeline, and tell you honestly what is realistic.',
    caps: [['target', 'Define scope & goals'], ['users', 'Estimate headcount'], ['chart', 'Build budget & timeline']] },
  { art: 'establish', title: 'Build', body: 'Entity incorporation, office fit-out and statutory compliance run in parallel, tracked on one plan with a single point of contact.',
    caps: [['file', 'Set up legal entity'], ['building', 'Office & infrastructure'], ['shield', 'Handle compliances']] },
  { art: 'staff', title: 'Staff & Scale', body: 'We hire your leadership first, then build the functional teams around them.',
    caps: [['usercheck', 'Leadership hiring'], ['users', 'Build functional teams'], ['trend', 'Scale with your roadmap']] },
  { art: 'operate', title: 'Operate', body: 'Payroll administration, statutory compliance and workforce support continue for as long as you need them.',
    caps: [['settings', 'Manage payroll & HR'], ['file', 'Ensure ongoing compliance'], ['message', 'Provide continuous support']] },
  { art: 'transition', title: 'Transfer', body: 'When you are ready to run it yourself, we hand over cleanly — people, records and vendor relationships.',
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

      <section className="section section-alt" id="talent"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">GCC Talent &amp; Staffing</span><h2>The centre is the easy part. The team is the practice.</h2><p className="lead">We build specialised talent and staffing solutions for GCCs, helping new and expanding centres stand up technology teams quickly — then keep them staffed as the centre matures.</p></div></Reveal>
        <Stagger className="grid grid-3">{GCC_TALENT.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
        <Reveal delay={0.1}><div className="gcc-band" style={{ marginTop: 28 }}>
          <div>
            <span className="eyebrow">Engagement model</span>
            <h2>Permanent first, then whatever the centre needs</h2>
            <p>Our engagement begins with permanent recruitment and scales into contract staffing and broader workforce solutions as your GCC matures — giving you a single partner across every stage of growth.</p>
          </div>
          <Link className="btn btn-primary btn-lg" href="/services/talent">See Talent Solutions <Icon name="arrow" /></Link>
        </div></Reveal>
      </div></section>

      <section className="section-engage" id="how-it-runs">
        <EngageTimeline
          eyebrow="How it runs"
          heading="From plan to operating center"
          period="Build · Operate · Transfer"
          image="/practices/03.webp"
          stages={STAGES.map(st => ({ title: st.title, body: st.body, points: st.caps.map(c => c[1]) }))}
        />
      </section>

      <WhyGcc eyebrow="Why Amani Tech" heading="A landing partner, not a vendor list" points={WHY} />

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">Considering India?</span><h2>Let&apos;s map your Hyderabad setup</h2><p>Tell us the function you want to build and the headcount you have in mind. We will come back with an indicative plan, timeline and cost.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Start the conversation</Link><Link className="btn btn-outline-light btn-lg" href="/services">Our other practices</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
