import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel';
import { ServiceTicker } from '@/components/ServiceTicker';
import { TechSection } from '@/components/TechSection';
import { PracticeShowcase, type Practice } from '@/components/PracticeShowcase';
import { EngageTimeline } from '@/components/EngageTimeline';
import { JobCard } from '@/components/JobCard';
import { BlogCard, FaqList } from '@/components/cards';
import { getContent, getFaqs, getFeaturedJobs, getPosts } from '@/lib/queries';
import type { EmployerCtaContent, HeroContent, TrustBandContent } from '@/lib/types';

const HERO: HeroContent = { eyebrow: 'Technology • Talent • Transform', heading: 'Building global teams. Powering digital transformation.', accent: 'Powering digital transformation.', subheading: 'A global staffing and technology partner: world-class teams, real engineering delivery, and Global Capability Centers in Hyderabad.', primary_cta: 'For Employers', secondary_cta: 'For Candidates', secondary_url: '/candidates', image: '' };
// Slides 2-4 are the practices, each on the frame it was shot for. Slide 1 comes from
// Admin -> Website CMS -> Hero, so the opening claim stays editable.
const SLIDES: HeroSlide[] = [
  {
    image: '/hero/2.webp',
    alt: 'A cloud platform rendered as a lit data centre beneath a global network',
    eyebrow: 'Technology Services',
    heading: 'Cloud, code and security, delivered end to end.', accent: 'delivered end to end.',
    body: 'Six engineering capabilities under one team — cloud, applications, QA automation, DevOps, security and applied AI.',
    primary: { label: 'Explore Technology Services', href: '/services/it-consulting' },
    secondary: { label: 'Talk to a consultant', href: '/contact' },
  },
  {
    image: '/hero/4.webp',
    alt: 'A recruiter reviewing candidate profiles projected across a connected globe',
    eyebrow: 'Talent Solutions',
    heading: 'The right skills, found by people who read every profile.', accent: 'read every profile.',
    body: 'Permanent hiring, contract staffing and executive search across IT and non-IT — sourced, screened and shortlisted by specialist recruiters.',
    primary: { label: 'Explore Talent Solutions', href: '/services/talent' },
    secondary: { label: 'Request Talent', href: '/employers#request-talent' },
  },
  {
    image: '/hero/3.webp',
    alt: 'Laptops, dashboards and cloud services connected as one working system',
    eyebrow: 'Digital Transformation',
    heading: 'Scale the business without scaling the admin.', accent: 'without scaling the admin.',
    body: 'One inbox, automated pipelines, onboarding that triggers itself, and AI replacing the repetitive work.',
    primary: { label: 'Explore Digital Transformation', href: '/services/transformation' },
    secondary: { label: 'Book a process audit', href: '/contact' },
  },
];

const TRUST: TrustBandContent = { heading: 'Trusted by employers across industries', industries: ['IT Services', 'Banking & Finance', 'Manufacturing', 'Healthcare', 'Retail & E-commerce', 'Education', 'Logistics', 'Telecom'], logos: [] };
const CTA: EmployerCtaContent = { heading: 'Looking for the right talent?', text: 'Tell us about the role. Our recruiters will source, screen and shortlist candidates for you.', primary_cta: 'Request Talent', secondary_cta: 'Become a staffing partner' };

// Where we work from, and who we serve from there. Kept to one line each — the detail is on /about.
const FOOTPRINT = [
  ['building', 'Hyderabad, India', 'Headquarters and delivery'],
  ['pin', 'Toronto, Canada', 'North American operations'],
  ['globe', 'Worldwide', 'Clients across four continents'],
  ['user', 'Human recruiters', 'A person reads every profile'],
] as const;

/** The four practices. These names are the spine of the site — the menu, the service pages and
 *  the footer all use the same four and no others. */
const PRACTICES: Practice[] = [
  {
    id: 'technology', title: 'Technology Services',
    body: 'Six engineering capabilities under one delivery team, from architecture through to the release pipeline.',
    services: ['Cloud Engineering', 'Application Development', 'QA Automation', 'DevOps & CI/CD', 'Cybersecurity', 'Applied AI'],
    image: '/practices/01.webp', href: '/services/it-consulting', cta: 'Explore technology',
  },
  {
    id: 'talent', title: 'Talent Solutions',
    body: 'Permanent, contract and executive search across IT and non-IT — every profile read by a recruiter, not a keyword filter.',
    services: ['Permanent Hiring', 'Contract Staffing', 'Executive Search', 'RPO'],
    image: '/practices/02.webp', href: '/services/talent', cta: 'Explore talent',
  },
  {
    id: 'gcc', title: 'GCC Practice',
    body: 'A landing partner for a capability centre in Hyderabad: incorporation, office, compliance, then the team that fills it.',
    services: ['Entity Incorporation', 'Office & Infrastructure', 'Statutory Compliance', 'Team Build-out'],
    image: '/practices/03.webp', href: '/gcc', cta: 'Explore GCC',
  },
  {
    id: 'transformation', title: 'Digital Transformation',
    body: 'One inbox, automated pipelines, onboarding that triggers itself, and AI taking over the repetitive work.',
    services: ['Process Automation', 'Systems Integration', 'Workflow Orchestration', 'AI Enablement'],
    image: '/practices/04.webp', href: '/services/transformation', cta: 'Explore transformation',
  },
];

const ENGAGE = [
  { image: '/engage/discover.webp', title: 'Discovery & Assessment', body: 'A focused review of your requirements, current state and constraints — no obligation.', points: ['Requirement gathering', 'Current-state assessment', 'Solution roadmap'] },
  { image: '/engage/proposal.webp', title: 'Proposal & SOW', body: 'A scoped statement of work with timelines, team mix and commercials, written in plain language.', points: ['Defined scope & deliverables', 'Transparent commercials', 'Timeline & team mix'] },
  { image: '/engage/deliver.webp', title: 'Delivery & Execution', body: 'A dedicated delivery team works in increments you can see, whether that is software or a shortlist.', points: ['Milestone-based delivery', 'Weekly status reporting', 'Dedicated account manager'] },
  { image: '/engage/partner.webp', title: 'Support & Scale', body: 'We stay on after go-live — SLA-backed support, additional capacity, and the next phase when you are ready.', points: ['Knowledge transfer', 'SLA-backed support', 'On-demand scaling'] },
];

const WHY = [
  ['user', 'People and technology under one partner', 'We understand both the engineering and the hiring market behind every role we fill.'],
  ['globe', 'Hyderabad and Toronto', 'Local market expertise in India, backed by a North American presence for our clients there.'],
  ['layers', 'One partner across every stage', 'Recruitment, GCC setup and technology delivery from a single accountable partner.'],
  ['eye', 'Transparent engagement', 'You always know where your project, requisition or application stands.'],
] as const;

export default async function HomePage() {
  const [hero, trust, cta, featured, posts, faqs] = await Promise.all([
    getContent<HeroContent>('hero', HERO), getContent<TrustBandContent>('trust_band', TRUST), getContent<EmployerCtaContent>('employer_cta', CTA),
    getFeaturedJobs(2), getPosts(), getFaqs(),
  ]);
  const h = hero.payload;
  const industries = [...trust.payload.industries, ...trust.payload.industries];

  return (
    <>
      <HeroCarousel slides={[{
        image: '/hero/1.webp',
        alt: 'A global network linking Hyderabad and Toronto',
        eyebrow: h.eyebrow,
        heading: h.heading,
        accent: h.accent,
        body: h.subheading,
        primary: { label: h.primary_cta, href: '/employers' },
        secondary: { label: h.secondary_cta, href: h.secondary_url || '/candidates' },
      }, ...SLIDES]} />

      <ServiceTicker />

      <section className="footprint" aria-label="Our global footprint">
        <div className="container">
          {FOOTPRINT.map(([icon, place, what]) => <div key={place}><Icon name={icon} /><div><strong>{place}</strong><span>{what}</span></div></div>)}
          <Link className="link" href="/about">Our footprint <Icon name="arrow" className="icon-arrow" /></Link>
        </div>
      </section>

      <section className="section-pillars" id="what-we-do">
        <PracticeShowcase items={PRACTICES} head={
          <div className="section-head center"><span className="eyebrow">What we do</span><h2>Four practices, one partner</h2><p className="lead">Amani Tech helps enterprises build, scale and transform their teams and operations — combining talent acquisition expertise with real technical delivery capability.</p></div>
        } />
      </section>

      <section className="section section-tech" id="technology">
        <div className="container"><Reveal><TechSection /></Reveal></div>
      </section>

      <section className="section-tight">
        <div className="container"><Reveal>
          <div className="gcc-band is-dark">
            <div>
              <span className="eyebrow">GCC Practice</span>
              <h2>Land in Hyderabad without touching the paperwork</h2>
              <p>A complete Build–Operate–Transfer engagement for enterprises establishing Global Capability Centers — entity incorporation, office leasing and statutory compliance, then the technology team that fills it.</p>
              <div className="band-points">
                <span><span className="ico"><Icon name="building" /></span>Incorporation<br/>&amp; Compliance</span>
                <span><span className="ico"><Icon name="users" /></span>Office Setup<br/>&amp; Leasing</span>
                <span><span className="ico"><Icon name="settings" /></span>Talent &amp;<br/>Technology</span>
              </div>
            </div>
            <div className="gcc-panel">
              <Link className="btn btn-primary btn-lg" href="/gcc">Explore the GCC Practice <Icon name="arrow" /></Link>
              <small>Get expert guidance from incorporation to team launch.</small>
              <div className="gcc-checks">
                <span><Icon name="check" />End-to-end support</span>
                <span><Icon name="check" />India local expertise</span>
                <span><Icon name="check" />Faster setup</span>
              </div>
            </div>
          </div>
        </Reveal></div>
      </section>

      {trust.is_visible && (
        <section className="trust-band" aria-label="Industries served">
          <div className="container">
            <p className="label">{trust.payload.heading}</p>
            <div className="marquee"><div className="marquee-track">
              {trust.payload.logos.length
                ? [...trust.payload.logos, ...trust.payload.logos].map((l, i) => <span key={i} className="chip" style={{ padding: '6px 18px' }}><img src={l.url} alt={l.alt} style={{ height: 28, width: 'auto', filter: 'grayscale(1)', opacity: .8 }} /></span>)
                : industries.map((x, i) => <span key={i} className="chip">{x}</span>)}
            </div></div>
            <p className="more">and many more…</p>
          </div>
        </section>
      )}

      <section className="section-engage" id="how-we-engage">
        <EngageTimeline
          eyebrow="How we engage"
          heading="From first conversation to long-term partner"
          period="Four steps · every engagement"
          image="/practices/03.webp"
          stages={ENGAGE}
        />
      </section>

      <section className="section section-candidates" id="candidates">
        <div className="container">
          <div className="cand-layout">
            <Reveal>
              <span className="eyebrow">Candidates</span>
              <h2>Looking for your next role?</h2>
              <p className="lead">Whether you want your next full-time role or flexible contract work, Amani Tech connects you with opportunities across leading technology and business functions — and stays with you from resume to placement.</p>
              <div className="row">
                <Link className="btn btn-primary btn-lg" href="/candidates">Go to the candidate hub <Icon name="arrow" /></Link>
                <Link className="btn btn-outline btn-lg" href="/register">Upload your resume</Link>
              </div>
              <div className="cand-points">
                <span><span className="ico"><Icon name="briefcase" /></span>Curated<br/>opportunities</span>
                <span><span className="ico"><Icon name="users" /></span>Leading<br/>tech companies</span>
                <span><span className="ico"><Icon name="chart" /></span>End-to-end<br/>placement support</span>
              </div>
            </Reveal>
            {featured.length > 0 && (
              <Stagger className="cand-jobs">{featured.slice(0, 2).map(j => <Item key={j.id}><JobCard job={j} /></Item>)}</Stagger>
            )}
          </div>
        </div>
      </section>

      <section className="section section-dark section-why">
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">Why Amani Tech</span><h2>Why companies and candidates <span className="accent">choose us</span></h2></div></Reveal>
          <Stagger className="choose-grid">{WHY.map(([i, t, d]) => <Item key={t}><div className="choose-card"><div className="ico"><Icon name={i} /></div><div><h3>{t}</h3><p>{d}</p></div></div></Item>)}</Stagger>
        </div>
      </section>

      <section className="section-tight">
        <div className="container"><Reveal>
          <div className="cta-band"><span className="eyebrow">For employers</span><h2>{cta.payload.heading}</h2><p>{cta.payload.text}</p>
            <div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">{cta.payload.primary_cta} <Icon name="arrow" /></Link><Link className="btn btn-outline-light btn-lg" href="/vendor-registration">{cta.payload.secondary_cta} <Icon name="arrow" /></Link></div>
            <div className="band-points">
              <span><span className="ico"><Icon name="usercheck" /></span>Pre-vetted<br/>candidates</span>
              <span><span className="ico"><Icon name="shield" /></span>Reduced<br/>time-to-hire</span>
              <span><span className="ico"><Icon name="chart" /></span>Industry-aligned<br/>talent pools</span>
            </div></div>
        </Reveal></div>
      </section>

      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal><div className="row between" style={{ alignItems: 'flex-end', marginBottom: 32 }}>
              <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Insights</span><h2>Perspectives on talent and technology</h2></div>
              <Link className="link" href="/blog">Read the blog <Icon name="arrow" /></Link>
            </div></Reveal>
            <Stagger className="grid grid-3">{posts.slice(0, 3).map(b => <Item key={b.id}><BlogCard b={b} /></Item>)}</Stagger>
          </div>
        </section>
      )}

      <section className="section section-alt">
        <div className="container">
          <Reveal><div className="section-head center"><span className="eyebrow">FAQ</span><h2>Questions people ask us</h2></div></Reveal>
          <Reveal delay={0.1}><FaqList items={faqs.slice(0, 6)} /></Reveal>
          <p className="center mt-24"><Link className="link" href="/faqs">See all FAQs <Icon name="arrow" /></Link></p>
        </div>
      </section>

      <section className="cta-final">
        <div className="container"><Reveal>
          <h2>Get in touch</h2><p>Whether you&rsquo;re hiring, scaling a GCC, or exploring a career move — we&rsquo;re here to help.</p>
          <div className="row"><Link className="btn btn-primary btn-lg" href="/contact">Contact us</Link><Link className="btn btn-outline btn-lg" href="/employers#request-talent">Request Talent</Link></div>
        </Reveal></div>
      </section>
    </>
  );
}
