import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { HeroSearch } from '@/components/HeroSearch';
import { HowItWorks } from '@/components/HowItWorks';
import { FeaturedJobs } from '@/components/FeaturedJobs';
import { Testimonials } from '@/components/Testimonials';
import { CatTile } from '@/components/cards';
import { getCategories, getFeaturedJobs, getJobCountsByCategory, getTestimonials } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'For Candidates — Jobs, Resume Upload & Placement Support',
  description: 'Browse live IT and non-IT openings, upload your resume once, set your work mode and shift preferences, and track your progress from profile to placement.',
  alternates: { canonical: '/candidates' },
};

const WAYS = [
  ['search', 'Browse opportunities', 'Explore current openings across our client network — IT and non-IT, contract and permanent.', '/jobs', 'See all jobs'],
  ['file', 'Upload your resume', 'Submit your profile once and be considered for every relevant role we work on.', '/register', 'Create a free profile'],
  ['usercheck', 'Set your preferences', 'Tell us how you want to work — WFH, WFO or hybrid, and the shifts you can cover.', '/register', 'Set preferences'],
] as const;

const PROMISES = [
  ['shield', 'No fees, ever', 'Job seekers never pay Amani Tech. Our clients do.'],
  ['user', 'A person reads your profile', 'Every submission is reviewed by a recruiter, not filtered out by a keyword match.'],
  ['eye', 'You always know where you stand', 'Your dashboard shows exactly which stage you are at and what happens next.'],
  ['graduation', 'Help closing the gaps', 'If a skill, a resume or an interview is holding you back, we tell you and help you fix it.'],
] as const;

export default async function CandidatesPage() {
  const [categories, counts, featured, testimonials] = await Promise.all([
    getCategories(), getJobCountsByCategory(), getFeaturedJobs(6), getTestimonials(true),
  ]);

  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">For candidates</span></Enter>
        <Enter delay={0.08}><h1>Find your next opportunity</h1></Enter>
        <Enter delay={0.16}><p className="lead">Whether you&rsquo;re looking for your next full-time role or flexible contract work, Amani Tech connects you with opportunities across leading technology and business functions.</p></Enter>
        <Enter delay={0.24}><div style={{ maxWidth: 720 }}><HeroSearch cta="Search jobs" /></div></Enter>
        <Enter delay={0.3}><div className="row" style={{ marginTop: 18 }}><Link className="btn btn-primary" href="/register"><Icon name="file" />Upload your resume</Link><Link className="btn btn-ghost" href="/login">Sign in to your dashboard</Link></div></Enter>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Three ways to start</span><h2>However you want to begin</h2></div></Reveal>
        <Stagger className="grid grid-3">{WAYS.map(([i, t, d, href, label]) => (
          <Item key={t}><Link className="pillar-card" href={href}>
            <div className="ico"><Icon name={i} /></div>
            <h3>{t}</h3><p>{d}</p>
            <span className="link">{label} <Icon name="arrow" className="icon-arrow" /></span>
          </Link></Item>
        ))}</Stagger>
      </div></section>

      <section className="section section-cats section-alt" id="categories">
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">Explore opportunities</span><h2>Browse jobs by category</h2><p className="lead">Find the right opportunities across industries, skills and experience levels.</p></div></Reveal>
          <Stagger className="cat-grid">{categories.map(c => <Item key={c.id}><CatTile c={c} count={counts[c.id] || 0} /></Item>)}</Stagger>
          <Reveal><div className="section-foot"><Link className="btn btn-primary" href="/jobs">View all open jobs <Icon name="arrow" /></Link></div></Reveal>
        </div>
      </section>

      <FeaturedJobs jobs={featured} />

      <HowItWorks />

      <section className="section section-dark">
        <div className="container">
          <Reveal><div className="section-head"><span className="eyebrow">Our promise</span><h2>What you get from working with us</h2></div></Reveal>
          <Stagger className="grid grid-2" style={{ gap: 32 }}>{PROMISES.map(([i, t, d]) => <Item key={t}><div className="why-item"><div className="ico"><Icon name={i} /></div><div><h3>{t}</h3><p>{d}</p></div></div></Item>)}</Stagger>
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

      <section className="cta-final">
        <div className="container"><Reveal>
          <h2>Ready to take the next step?</h2><p>Register in minutes. No fees, no spam — just a recruiter who reads your profile.</p>
          <div className="row"><Link className="btn btn-primary btn-lg" href="/register">Create your profile</Link><Link className="btn btn-outline btn-lg" href="/jobs">Browse jobs first</Link></div>
        </Reveal></div>
      </section>
    </>
  );
}
