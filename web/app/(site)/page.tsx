import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Counter, Enter, Item, Reveal, Stagger } from '@/components/motion';
import { HeroSearch } from '@/components/HeroSearch';
import { HeroVisual } from '@/components/HeroVisual';
import { HowItWorks } from '@/components/HowItWorks';
import { ServiceOrbit } from '@/components/ServiceOrbit';
import { FeaturedJobs } from '@/components/FeaturedJobs';
import { Testimonials } from '@/components/Testimonials';
import { BlogCard, CatTile, FaqList } from '@/components/cards';
import { getCategories, getContent, getFaqs, getFeaturedJobs, getJobCountsByCategory, getPosts, getServices, getTestimonials } from '@/lib/queries';
import type { EmployerCtaContent, HeroContent, StatisticsContent, TrustBandContent } from '@/lib/types';

const HERO: HeroContent = { eyebrow: 'Technology • Talent • Training', heading: 'From profile to placement, we’re with you every step.', accent: 'we’re with you every step.', subheading: 'Amani Tech connects skilled professionals with the right opportunities while supporting you through profile review, career assessment, skill development, job applications and placement.', primary_cta: 'Find Jobs', secondary_cta: 'Build My Profile', secondary_url: '/register', image: '/hero_section/hero_img.png' };
const STAT_ICONS = ['briefcase', 'building', 'users', 'graduation', 'star'];
const TRUST: TrustBandContent = { heading: 'Trusted by employers across industries', industries: ['IT Services', 'Banking & Finance', 'Manufacturing', 'Healthcare', 'Retail & E-commerce', 'Education', 'Logistics', 'Telecom'], logos: [] };
const STATS: StatisticsContent = { items: [{ number: 1200, suffix: '+', label: 'Candidates placed' }, { number: 180, suffix: '+', label: 'Client companies' }, { number: 25, suffix: '+', label: 'Job categories' }, { number: 9, suffix: '', label: 'Years in staffing' }] };
const CTA: EmployerCtaContent = { heading: 'Looking for the right talent?', text: 'Tell us about the role. Our recruiters will source, screen and shortlist candidates for you.', primary_cta: 'Request Talent', secondary_cta: 'Become a staffing partner' };

const WHY = [['user', 'Human recruiters, not just algorithms', 'Every application is reviewed by a person who understands the role.'], ['layers', 'IT and non-IT under one roof', 'From software teams to plant engineers and finance staff.'], ['shield', 'Verified employers only', 'We work directly with hiring companies. No unverified listings.'], ['eye', 'Transparent process', 'You always know where your application or requirement stands.']];

export default async function HomePage() {
  const [hero, trust, stats, cta, categories, counts, services, featured, testimonials, posts, faqs] = await Promise.all([
    getContent<HeroContent>('hero', HERO), getContent<TrustBandContent>('trust_band', TRUST), getContent<StatisticsContent>('statistics', STATS), getContent<EmployerCtaContent>('employer_cta', CTA),
    getCategories(), getJobCountsByCategory(), getServices(), getFeaturedJobs(6), getTestimonials(true), getPosts(), getFaqs(),
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
                <Link className="btn btn-primary btn-lg" href="/jobs"><Icon name="search" />{h.primary_cta} <Icon name="arrow" /></Link>
                <Link className="btn btn-outline btn-lg" href={h.secondary_url || '/register'}><Icon name="user" />{h.secondary_cta}</Link>
              </div>
            </Enter>
            <Enter delay={0.28}><HeroSearch cta="Search" /></Enter>
          </div>
          <HeroVisual image={h.image} />
          </div>
          <Enter delay={0.34}>
            <div className="hero-trust"><span><Icon name="shield" />No fees for job seekers</span><span><Icon name="users" />Verified employers</span><span><Icon name="trend" />Career guidance &amp; training</span><span><Icon name="user" />Human recruiters</span></div>
          </Enter>
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
            <p className="more">and many more…</p>
          </div>
        </section>
      )}

      {stats.is_visible && stats.payload.items.length > 0 && (
        <section className="section-tight"><div className="container"><Reveal><div className="stats">{stats.payload.items.map((s, i) => <div key={s.label} className="stat"><span className="stat-icon"><Icon name={STAT_ICONS[i % STAT_ICONS.length]} /></span><div><Counter value={s.number} suffix={s.suffix} /><span>{s.label}</span></div></div>)}</div></Reveal></div></section>
      )}

      <section className="section section-cats" id="categories">
        <div className="container">
          <span className="dots" aria-hidden="true" />
          <Reveal>
            <div className="section-head section-head-row">
              <div><span className="eyebrow">Explore opportunities</span><h2>Browse jobs by category</h2><p className="lead">Find the right opportunities across industries, skills and experience levels.</p></div>
              <p className="side-tag">Different talents<br />A brighter tomorrow</p>
            </div>
          </Reveal>
          <Stagger className="cat-grid">{categories.map(c => <Item key={c.id}><CatTile c={c} count={counts[c.id] || 0} /></Item>)}</Stagger>
          <Reveal>
            <div className="section-foot">
              <Link className="btn btn-primary" href="/jobs">View all open jobs <Icon name="arrow" /></Link>
              <p className="side-tag">More opportunities<br />A stronger you</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-services" id="services">
        <div className="container">
          <span className="svc-dots" aria-hidden="true" />
          <div className="svc-layout">
            <Stagger className="svc-copy">
              <Item><span className="eyebrow">What we do</span></Item>
              <Item><h2>Staffing services built around <span className="accent">how you hire</span></h2></Item>
              <Item><p className="lead">Whether you need one expert or an entire team, we provide flexible staffing solutions that save time, reduce hiring risk and connect you with the right talent, faster.</p></Item>
              <Item><Link className="btn btn-primary btn-lg" href="/services">Explore Our Services <Icon name="arrow" /></Link></Item>
              <Item>
                <ul className="svc-benefits">
                  <li><Icon name="clock" /><div><strong>Faster Hiring</strong><small>Reduce time-to-hire</small></div></li>
                  <li><Icon name="usercheck" /><div><strong>Pre-vetted Talent</strong><small>Skilled &amp; verified</small></div></li>
                  <li><Icon name="layers" /><div><strong>Flexible Engagement</strong><small>Contract, project or permanent</small></div></li>
                </ul>
              </Item>
            </Stagger>
            <div className="svc-visual">
              <ServiceOrbit services={services} />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <FeaturedJobs jobs={featured} />

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
