import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Counter, Enter, Item, Reveal, Stagger } from '@/components/motion';
import { HeroSearch } from '@/components/HeroSearch';
import { HeroVisual } from '@/components/HeroVisual';
import { HowItWorks } from '@/components/HowItWorks';
import { JobCard } from '@/components/JobCard';
import { Testimonials } from '@/components/Testimonials';
import { BlogCard, CatTile, Empty, FaqList, ServiceCard } from '@/components/cards';
import { getCategories, getContent, getFaqs, getFeaturedJobs, getJobCountsByCategory, getPosts, getPublishedJobs, getServices, getTestimonials } from '@/lib/queries';
import type { EmployerCtaContent, HeroContent, StatisticsContent, TrustBandContent } from '@/lib/types';

const HERO: HeroContent = { eyebrow: 'Staffing & Recruitment · IT and Non-IT', heading: 'Find work that moves your career forward.', accent: 'career forward.', subheading: 'Amani Tech connects skilled professionals with verified employers across IT and non-IT roles. Search open positions, apply in minutes, and let our recruitment team support you through every step.', primary_cta: 'Search Jobs', secondary_cta: 'Hiring? Request talent', secondary_url: '/employers', popular: ['Java Developer', 'Data Engineer', 'Accountant', 'DevOps', 'Mechanical Engineer'] };
const TRUST: TrustBandContent = { heading: 'Trusted by employers across industries', industries: ['IT Services', 'Banking & Finance', 'Manufacturing', 'Healthcare', 'Retail & E-commerce', 'Education', 'Logistics', 'Telecom'], logos: [] };
const CTA: EmployerCtaContent = { heading: 'Looking for the right talent?', text: 'Tell us about the role. Our recruiters will source, screen and shortlist candidates for you.', primary_cta: 'Request Talent', secondary_cta: 'Become a staffing partner' };

const WHY = [['user', 'Human recruiters, not just algorithms', 'Every application is reviewed by a person who understands the role.'], ['layers', 'IT and non-IT under one roof', 'From software teams to plant engineers and finance staff.'], ['shield', 'Verified employers only', 'We work directly with hiring companies. No unverified listings.'], ['eye', 'Transparent process', 'You always know where your application or requirement stands.']];

export default async function HomePage() {
  const [hero, trust, stats, cta, categories, counts, services, featured, allJobs, testimonials, posts, faqs] = await Promise.all([
    getContent<HeroContent>('hero', HERO), getContent<TrustBandContent>('trust_band', TRUST), getContent<StatisticsContent>('statistics', { items: [] }), getContent<EmployerCtaContent>('employer_cta', CTA),
    getCategories(), getJobCountsByCategory(), getServices(), getFeaturedJobs(6), getPublishedJobs(), getTestimonials(true), getPosts(), getFaqs(),
  ]);
  const h = hero.payload;
  const headingParts = h.accent && h.heading.endsWith(h.accent) ? [h.heading.slice(0, -h.accent.length), h.accent] : [h.heading, ''];
  const industries = [...trust.payload.industries, ...trust.payload.industries];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <Enter><span className="eyebrow">{h.eyebrow}</span></Enter>
            <Enter delay={0.08}><h1>{headingParts[0]}{headingParts[1] && <span className="accent">{headingParts[1]}</span>}</h1></Enter>
            <Enter delay={0.16}><p className="lead">{h.subheading}</p></Enter>
            <Enter delay={0.24}><HeroSearch cta={h.primary_cta} /></Enter>
            <Enter delay={0.3}>
              <div className="popular"><span>Popular:</span>{h.popular.map(p => <Link key={p} className="chip" href={`/jobs?q=${encodeURIComponent(p)}`}>{p}</Link>)}</div>
              <div className="trust-line"><span><Icon name="check" />No fees for job seekers</span><span><Icon name="shield" />Verified employers</span><span><Icon name="user" />Human recruiters</span></div>
              <p className="mt-24"><Link className="link" href={h.secondary_url || '/employers'}>{h.secondary_cta} <Icon name="arrow" /></Link></p>
            </Enter>
          </div>
          <HeroVisual job={featured[0] || allJobs[0] || null} openCount={allJobs.length} image={h.image} />
        </div>
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
          </div>
        </section>
      )}

      {stats.is_visible && stats.payload.items.length > 0 && (
        <section className="section-tight"><div className="container"><Reveal><div className="stats">{stats.payload.items.map(s => <div key={s.label} className="stat"><Counter value={s.number} suffix={s.suffix} /><span>{s.label}</span></div>)}</div></Reveal></div></section>
      )}

      <section className="section" id="categories">
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">Browse by category</span><h2>Browse jobs by category</h2><p className="lead">Explore openings across technology, finance, engineering and more.</p></div></Reveal>
          <Stagger className="cat-grid">{categories.map(c => <Item key={c.id}><CatTile c={c} count={counts[c.id] || 0} /></Item>)}</Stagger>
          <Reveal><p className="mt-24"><Link className="link" href="/jobs">View all open jobs <Icon name="arrow" /></Link></p></Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">What we do</span><h2>Staffing services built around how you hire</h2><p className="lead">Whether you need one specialist or a full team, we handle sourcing, screening and coordination so you can focus on the interview.</p></div></Reveal>
          <Stagger className="grid grid-3">{services.map(s => <Item key={s.id}><ServiceCard s={s} /></Item>)}</Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><div className="section-head center"><span className="eyebrow">How it works</span><h2>Simple for candidates. Predictable for employers.</h2></div></Reveal>
          <Reveal delay={0.1}><HowItWorks /></Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal><div className="row between" style={{ alignItems: 'flex-end', marginBottom: 32 }}>
            <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Featured opportunities</span><h2>Featured opportunities</h2><p className="lead">Hand-picked roles from employers hiring right now.</p></div>
            <Link className="link" href="/jobs">View all jobs <Icon name="arrow" /></Link>
          </div></Reveal>
          {featured.length ? <Stagger className="job-grid">{featured.map(j => <Item key={j.id}><JobCard job={j} /></Item>)}</Stagger>
            : <Empty icon="briefcase" title="No featured jobs at the moment" text="Browse all open positions." action={<Link className="btn btn-secondary" href="/jobs">View all jobs</Link>} />}
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">Why Amani Tech</span><h2>Why people and companies choose Amani Tech</h2></div></Reveal>
          <Stagger className="grid grid-2" style={{ gap: 32 }}>{WHY.map(([i, t, d]) => <Item key={t}><div className="why-item"><div className="ico"><Icon name={i} /></div><div><h3>{t}</h3><p>{d}</p></div></div></Item>)}</Stagger>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section" id="testimonials">
          <div className="container">
            <Reveal><div className="row between" style={{ alignItems: 'flex-end', marginBottom: 32 }}>
              <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Testimonials</span><h2>What candidates and employers say</h2></div>
              <Link className="link" href="/write-a-review">Write a review <Icon name="arrow" /></Link>
            </div></Reveal>
            <Reveal delay={0.1}><Testimonials items={testimonials} /></Reveal>
          </div>
        </section>
      )}

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
              <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Resources</span><h2>Insights and career advice</h2></div>
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
          <h2>Ready to take the next step?</h2><p>Register in minutes, or tell us who you need to hire.</p>
          <div className="row"><Link className="btn btn-primary btn-lg" href="/register">Register as a candidate</Link><Link className="btn btn-outline btn-lg" href="/employers#request-talent">Request Talent</Link></div>
        </Reveal></div>
      </section>
    </>
  );
}
