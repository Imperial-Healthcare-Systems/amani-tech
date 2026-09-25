import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { WhyCards } from '@/components/WhyCards';
import { EngageJourney } from '@/components/EngageJourney';

export const metadata: Metadata = {
  title: 'Digital Transformation — Growth & Operations Automation',
  description: 'A unified Client Growth & Operations Ecosystem: unified client communications, automated lead and pipeline management, onboarding automation, reputation automation and AI-driven process automation.',
  alternates: { canonical: '/services/transformation' },
};

const ECOSYSTEM = [
  ['message', 'Unified Client Communications', 'We centralise email, WhatsApp and SMS into a single inbox, so no client or prospect enquiry is ever missed and response times stay fast and consistent.'],
  ['trend', 'Automated Lead & Pipeline Management', 'We design and implement custom sales pipelines that automatically track prospects from first contact through to closed deal, giving leadership full visibility into deal flow.'],
  ['usercheck', 'Client Onboarding Automation', 'We build automated onboarding sequences that trigger the moment a contract is signed — sending intake forms, scheduling kickoff calls and setting expectations from day one.'],
  ['star', 'Reputation & Review Automation', 'We set up automated review-request workflows tied to project or service completion, helping you build a stronger online reputation and improve local search visibility.'],
  ['zap', 'AI-Driven Process Automation', 'We identify manual, repetitive operational processes and replace them with intelligent automation — reducing administrative overhead and freeing teams for higher-value work.'],
] as const;

const SIGNS = [
  'Enquiries arrive across four channels and get answered inconsistently.',
  'Nobody can say how many deals are actually in the pipeline this month.',
  'Onboarding a new client depends on one person remembering the steps.',
  'Your team re-keys the same data into two or three systems every week.',
  'Good work goes unreviewed because nobody asks at the right moment.',
];

const WHY = [
  { art: 'growth', title: 'Built on your process', body: 'We automate the way your business already works rather than forcing it into someone else’s template.', href: '#ecosystem' },
  { art: 'people', title: 'Adoption, not just setup', body: 'The system is handed over with training and documentation, so your team actually uses it after we leave.', href: '/about' },
  { art: 'outcomes', title: 'Measured in hours returned', body: 'Every automation we build is scoped against the manual hours it removes, so the value is visible.', href: '/contact' },
  { art: 'talent', title: 'Engineering behind it', body: 'Backed by our technology practice, so a custom integration is never out of reach.', href: '/services/it-consulting' },
];

const HOW = [
  { art: 'discovery', title: 'Process audit', body: 'We map how work actually moves through your business today, including the parts that live in someone’s inbox.', points: ['Map current workflows', 'Find the manual bottlenecks', 'Quantify the hours lost'] },
  { art: 'proposal', title: 'Automation plan', body: 'A prioritised plan: what gets automated first, what it costs and what it gives back.', points: ['Prioritised by payback', 'Transparent pricing', 'Clear success measures'] },
  { art: 'build', title: 'Build & integrate', body: 'We configure the ecosystem and connect it to the tools you already pay for.', points: ['Channel consolidation', 'Pipeline and workflow build', 'Integration with existing tools'] },
  { art: 'handover', title: 'Train & optimise', body: 'Your team is trained on the new flow, then we tune it as real usage shows what to change.', points: ['Team training', 'Playbooks and documentation', 'Ongoing optimisation'] },
];

export default function TransformationPage() {
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">Digital Transformation</span></Enter>
        <Enter delay={0.08}><h1>Scale the business without scaling the admin</h1></Enter>
        <Enter delay={0.16}><p className="lead">Amani Tech gives clients a unified Client Growth &amp; Operations Ecosystem — an all-in-one platform automating CRM, pipeline management, client acquisition, multi-channel marketing and operational workflows, so the business can grow without the overhead growing with it.</p></Enter>
        <Enter delay={0.24}><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Book a process audit</Link><Link className="btn btn-outline btn-lg" href="#ecosystem">See the ecosystem</Link></div></Enter>
      </div></section>

      <section className="section" id="ecosystem"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">The ecosystem</span><h2>Five systems that run themselves</h2><p className="lead">Each one stands alone. Together they replace most of the manual coordination a growing business accumulates.</p></div></Reveal>
        <Stagger className="grid grid-3">{ECOSYSTEM.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Is this you?</span><h2>The signs we usually get called about</h2></div></Reveal>
        <Reveal delay={0.1}><ul className="check-list">{SIGNS.map(s => <li key={s}><Icon name="check" />{s}</li>)}</ul></Reveal>
      </div></section>

      <WhyCards
        eyebrow="Why Amani Tech"
        heading="Automation that survives contact with your team"
        lead="Most automation projects fail on adoption, not technology. We build for the people who have to live with it."
        points={WHY}
      />

      <EngageJourney
        eyebrow="How we engage"
        heading="From process audit to a system that runs"
        lead="Four steps, each with something you can see and sign off before the next begins."
        stages={HOW}
      />

      <section className="section-tight"><div className="container"><Reveal>
        <div className="cta-band"><span className="eyebrow">Start a conversation</span><h2>Tell us what your team keeps doing by hand</h2><p>Describe the repetitive work in a few lines. We will come back with an honest view of what can be automated and what cannot.</p><div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Contact us</Link><Link className="btn btn-outline-light btn-lg" href="/services/it-consulting">Need engineering instead?</Link></div></div>
      </Reveal></div></section>
    </>
  );
}
