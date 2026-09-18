import Link from 'next/link';
import { Icon } from './Icon';
import { JobCard } from './JobCard';
import { Item, Reveal, Stagger } from './motion';
import { hand } from './fonts';
import type { Job } from '@/lib/types';

/** Decorative placeholders for the empty state only. Real featured jobs render through JobCard. */
const SAMPLE = [
  { k: 'back', title: 'Product Manager' },
  { k: 'main', title: 'Software Engineer', location: 'Bengaluru, India', tags: ['Full-time', 'Hybrid'] },
  { k: 'front', title: 'Data Analyst', location: 'Delhi, India' },
];

const BENEFITS = [['shield', 'Verified Employers', 'Trusted opportunities'], ['users', 'Diverse Roles', 'Across industries'], ['zap', 'Regularly Updated', 'Fresh opportunities']];

export function FeaturedJobs({ jobs }: { jobs: Job[] }) {
  return (
    <section className={`section section-feat ${hand.variable}`} id="featured">
      <span className="feat-dots feat-dots-tr" aria-hidden="true" />
      <span className="feat-dots feat-dots-bl" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <div className="feat-head">
            <div className="section-head"><span className="eyebrow">Featured opportunities</span><h2>Featured opportunities</h2><p className="lead">Hand-picked roles from employers hiring right now.</p></div>
            <Link className="link feat-more" href="/jobs">View all jobs <Icon name="arrow" /></Link>
          </div>
        </Reveal>

        {jobs.length > 0 ? (
          <Stagger className="job-grid">{jobs.map(j => <Item key={j.id}><JobCard job={j} /></Item>)}</Stagger>
        ) : (
          <Reveal delay={0.1}>
            <div className="feat-box">
              <div className="feat-grid">
                <div className="feat-copy">
                  <span className="feat-pill"><Icon name="star" />New opportunities coming soon</span>
                  <h3>More opportunities<br />are coming your way.</h3>
                  <p>We&apos;re currently updating our featured roles. Explore all available opportunities in the meantime.</p>
                  <Link className="btn btn-primary btn-lg" href="/jobs">View all jobs <Icon name="arrow" /></Link>
                </div>

                <div className="feat-visual" aria-hidden="true">
                  <svg className="feat-plane" viewBox="0 0 120 120" aria-hidden="true">
                    <path className="arc" d="M14 110C4 70 20 40 60 22" />
                    <path className="plane" d="M64 8l40 12-24 26-4-14-14-8z" />
                  </svg>
                  <Stagger className="feat-cards">
                    {SAMPLE.map((c, i) => (
                      <Item key={c.k} className={`fj-pos fj-${c.k}`}>
                        <article className="fj" style={{ animationDelay: `${i * -2.3}s` }}>
                          <span className="fj-ico"><Icon name="building" /></span>
                          <div className="fj-body">
                            <strong>{c.title}</strong>
                            <span className="fj-line" /><span className="fj-line short" />
                            {c.location && <span className="fj-loc"><Icon name="pin" />{c.location}</span>}
                            {c.tags && <span className="fj-tags">{c.tags.map(t => <span key={t}>{t}</span>)}</span>}
                          </div>
                        </article>
                      </Item>
                    ))}
                  </Stagger>
                  <p className="feat-note">Great<br />careers<br />await!<svg viewBox="0 0 60 40" aria-hidden="true"><path d="M6 34c14 4 30 2 48-10M50 28l6-6-8-2" /><path d="M8 6l3-5M16 8l1-6M2 12l-4-3" /></svg></p>
                </div>

                <ul className="feat-benefits">
                  {BENEFITS.map(([icon, t, s]) => <li key={t}><span className="fb-ico"><Icon name={icon} /></span><div><strong>{t}</strong><small>{s}</small></div></li>)}
                </ul>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
