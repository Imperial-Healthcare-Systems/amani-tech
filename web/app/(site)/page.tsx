import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Counter, Enter, Item, Reveal, Stagger } from '@/components/motion';
import { HeroVisual } from '@/components/HeroVisual';
import { EngageJourney } from '@/components/EngageJourney';
import { JobCard } from '@/components/JobCard';
import { BlogCard, FaqList } from '@/components/cards';
import { getContent, getFaqs, getFeaturedJobs, getPosts } from '@/lib/queries';
import type { EmployerCtaContent, HeroContent, StatisticsContent, TrustBandContent } from '@/lib/types';

const HERO: HeroContent = { eyebrow: 'Technology • Talent • Transform', heading: 'Building global teams. Powering digital transformation.', accent: 'Powering digital transformation.', subheading: 'Amani Tech is a global staffing and technology partner helping enterprises build world-class teams and digital capabilities — from Global Capability Centers in Hyderabad to end-to-end technology services delivered worldwide.', primary_cta: 'For Employers', secondary_cta: 'For Candidates', secondary_url: '/candidates', image: '' };
const STAT_ICONS = ['briefcase', 'building', 'users', 'graduation', 'star'];
const TRUST: TrustBandContent = { heading: 'Trusted by employers across industries', industries: ['IT Services', 'Banking & Finance', 'Manufacturing', 'Healthcare', 'Retail & E-commerce', 'Education', 'Logistics', 'Telecom'], logos: [] };
const STATS: StatisticsContent = { items: [{ number: 1200, suffix: '+', label: 'Candidates placed' }, { number: 180, suffix: '+', label: 'Client companies' }, { number: 25, suffix: '+', label: 'Job categories' }, { number: 9, suffix: '', label: 'Years in staffing' }] };
const CTA: EmployerCtaContent = { heading: 'Looking for the right talent?', text: 'Tell us about the role. Our recruiters will source, screen and shortlist candidates for you.', primary_cta: 'Request Talent', secondary_cta: 'Become a staffing partner' };

// Where we work from, and who we serve from there. Kept to one line each — the detail is on /about.
const FOOTPRINT = [
  ['Hyderabad, India', 'Headquarters and delivery'],
  ['Toronto, Canada', 'North American operations'],
  ['Worldwide', 'Clients across four continents'],
] as const;

/** The four practices. These names are the spine of the site — the menu, the service pages and
 *  the footer all use the same four and no others. */
const PRACTICES = [
  ['zap', 'Technology Services', 'Cloud, application development, QA automation, DevOps, cybersecurity and applied AI.', '/services/it-consulting', 'Explore technology'],
  ['users', 'Talent Solutions', 'Permanent recruitment, contract staffing and executive search across IT and non-IT.', '/services/talent', 'Explore talent'],
  ['globe', 'GCC Practice', 'End-to-end advisory and talent partner for companies building capability centers in Hyderabad.', '/gcc', 'Explore GCC'],
  ['trend', 'Digital Transformation', 'Automation and growth systems that help businesses scale their operations.', '/services/transformation', 'Explore transformation'],
] as const;

const TECH = [
  ['layers', 'Cloud Platforms', 'AWS, Azure and GCP'],
  ['code', 'Custom Web & App Development', 'Web and mobile products'],
  ['usercheck', 'Software Testing / QA Automation', 'Playwright frameworks'],
  ['zap', 'DevOps & CI/CD Pipelines', 'Faster, safer releases'],
  ['shield', 'Cybersecurity & Data Protection', 'Audits and compliance'],
  ['chart', 'Applied AI & Data Analytics', 'Insight and reporting'],
] as const;

const ENGAGE = [
  { art: 'discovery', title: 'Discovery', body: 'A short, focused review of what you are trying to build, hire or move — no obligation.', points: ['Understand your goals', 'Assess the current setup', 'Identify the fastest route'] },
  { art: 'proposal', title: 'Proposal', body: 'A scoped plan with timelines, team and cost, written in plain language.', points: ['Clear scope and deliverables', 'Transparent pricing', 'Timeline and team structure'] },
  { art: 'build', title: 'Deliver', body: 'A dedicated team delivers in increments you can see, whether that is software or a shortlist.', points: ['Milestone-driven delivery', 'Regular updates', 'Continuous feedback'] },
  { art: 'handover', title: 'Partner', body: 'We stay on after go-live — support, extra hands, and the next phase when you are ready.', points: ['Knowledge transfer', 'Ongoing support', 'Scale up on demand'] },
];

const WHY = [
  ['user', 'People and technology under one partner', 'We understand both the engineering and the hiring market behind every role we fill.'],
  ['globe', 'Hyderabad and Toronto', 'Local market expertise in India, backed by a North American presence for our clients there.'],
  ['layers', 'One partner across every stage', 'Recruitment, GCC setup and technology delivery from a single relationship.'],
  ['eye', 'Transparent process', 'You always know where your project, requirement or application stands.'],
] as const;

export default async function HomePage() {
  const [hero, trust, stats, cta, featured, posts, faqs] = await Promise.all([
    getContent<HeroContent>('hero', HERO), getContent<TrustBandContent>('trust_band', TRUST), getContent<StatisticsContent>('statistics', STATS), getContent<EmployerCtaContent>('employer_cta', CTA),
    getFeaturedJobs(2), getPosts(), getFaqs(),
  ]);
  const h = hero.payload;
  const headingParts = h.accent && h.heading.endsWith(h.accent) ? [h.heading.slice(0, -h.accent.length), h.accent] : [h.heading, ''];
  const industries = [...trust.payload.industries, ...trust.payload.industries];

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <Enter><span className="eyebrow">{h.eyebrow}</span></Enter>
              <Enter delay={0.08}><h1>{headingParts[0]}{headingParts[1] && <span className="accent">{headingParts[1]}</span>}</h1></Enter>
              <Enter delay={0.16}><p className="lead">{h.subheading}</p></Enter>
              <Enter delay={0.22}>
                <div className="hero-actions">
                  <Link className="btn btn-primary btn-lg" href="/employers">{h.primary_cta} <Icon name="arrow" /></Link>
                  <Link className="btn btn-outline btn-lg" href={h.secondary_url || '/candidates'}>{h.secondary_cta}</Link>
                </div>
              </Enter>
            </div>
            <HeroVisual image={h.image} />
          </div>
          <Enter delay={0.3}>
            <div className="hero-trust"><span><Icon name="globe" />Delivered worldwide</span><span><Icon name="building" />Hyderabad &amp; Toronto</span><span><Icon name="shield" />Verified employers</span><span><Icon name="user" />Human recruiters</span></div>
          </Enter>
        </div>
      </section>

      <section className="footprint" aria-label="Our global footprint">
        <div className="container">
          {FOOTPRINT.map(([place, what]) => <div key={place}><strong>{place}</strong><span>{what}</span></div>)}
          <Link className="link" href="/about">Our footprint <Icon name="arrow" className="icon-arrow" /></Link>
        </div>
      </section>

      <section className="section section-pillars" id="what-we-do">
        <div className="container">
          <Reveal><div className="section-head center"><span className="eyebrow">What we do</span><h2>Four practices, one partner</h2><p className="lead">Amani Tech helps enterprises build, scale and transform their teams and operations — combining talent acquisition expertise with real technical delivery capability.</p></div></Reveal>
          <Stagger className="grid grid-4">{PRACTICES.map(([i, t, d, href, label]) => (
            <Item key={t}><Link className="pillar-card" href={href}>
              <div className="ico"><Icon name={i} /></div>
              <h3>{t}</h3><p>{d}</p>
              <span className="link">{label} <Icon name="arrow" className="icon-arrow" /></span>
            </Link></Item>
          ))}</Stagger>
        </div>
      </section>

      <section className="section section-tech" id="technology">
        <div className="container">
          <Reveal><div className="section-head section-head-row">
            <div><span className="eyebrow">Technology Services</span><h2>Six engineering capabilities</h2><p className="lead">High-impact technology that helps organisations build, secure and scale their digital infrastructure.</p></div>
            <Link className="btn btn-outline" href="/services/it-consulting">See the practice <Icon name="arrow" /></Link>
          </div></Reveal>
          <Stagger className="tech-strip">{TECH.map(([i, t, note]) => <Item key={t}><Link className="tech-chip" href="/services/it-consulting#niches"><span className="ico"><Icon name={i} /></span><span>{t}<small>{note}</small></span><Icon name="arrow" className="icon-arrow" /></Link></Item>)}</Stagger>
        </div>
      </section>

      <section className="section-tight">
        <div className="container"><Reveal>
          <div className="gcc-band is-dark">
            <div>
              <span className="eyebrow">GCC Practice</span>
              <h2>Land in Hyderabad without touching the paperwork</h2>
              <p>We act as an end-to-end landing partner for enterprises establishing Global Capability Centers — legal incorporation, office leasing and local compliance, then the technology team that fills it.</p>
            </div>
            <Link className="btn btn-primary btn-lg" href="/gcc">Explore the GCC Practice <Icon name="arrow" /></Link>
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
            {stats.is_visible && stats.payload.items.length > 0 && (
              <Reveal className="trust-stats"><div className="stats">{stats.payload.items.map((s, i) => <div key={s.label} className="stat"><span className="stat-icon"><Icon name={STAT_ICONS[i % STAT_ICONS.length]} /></span><div><Counter value={s.number} suffix={s.suffix} /><span>{s.label}</span></div></div>)}</div></Reveal>
            )}
          </div>
        </section>
      )}

      <EngageJourney
        eyebrow="How we engage"
        heading="From first conversation to long-term partner"
        lead="The same four steps whether you are hiring one specialist, building a capability centre, or shipping a product."
        stages={ENGAGE}
      />

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
            </Reveal>
            {featured.length > 0 && (
              <Stagger className="cand-jobs">{featured.slice(0, 2).map(j => <Item key={j.id}><JobCard job={j} /></Item>)}</Stagger>
            )}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">Why Amani Tech</span><h2>Why companies and candidates choose us</h2></div></Reveal>
          <Stagger className="grid grid-2" style={{ gap: 32 }}>{WHY.map(([i, t, d]) => <Item key={t}><div className="why-item"><div className="ico"><Icon name={i} /></div><div><h3>{t}</h3><p>{d}</p></div></div></Item>)}</Stagger>
        </div>
      </section>

      <section className="section-tight">
        <div className="container"><Reveal>
          <div className="cta-band"><span className="eyebrow">For employers</span><h2>{cta.payload.heading}</h2><p>{cta.payload.text}</p>
            <div className="row"><Link className="btn btn-primary btn-lg" href="/employers#request-talent">{cta.payload.primary_cta}</Link><Link className="btn btn-outline-light btn-lg" href="/vendor-registration">{cta.payload.secondary_cta}</Link></div></div>
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
