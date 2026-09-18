import Link from 'next/link';
import Image from 'next/image';
import { CAT_ICON, Icon, Stars } from './Icon';
import { CatArt, hasCatArt } from './CatArt';
import { fmtDate, initials, label, timeAgo } from '@/lib/format';
import type { BlogPost, CareerOpening, Category, Faq, Service, Testimonial } from '@/lib/types';

export function CatTile({ c, count }: { c: Category; count: number }) {
  const icon = CAT_ICON[c.slug] || 'briefcase';
  const subs = c.subcategories.map(s => s.name);
  const blurb = subs.length ? subs.slice(0, 3).join(' · ') + (subs.length > 3 ? ` +${subs.length - 3} more` : '') : 'Roles across all experience levels.';
  return (
    <Link className="cat-tile" href={`/jobs/category/${c.slug}`}>
      <div className="ico">{hasCatArt(c.slug) ? <CatArt slug={c.slug} /> : <Icon name={icon} />}</div>
      <strong>{c.name}</strong>
      <small>{blurb}</small>
      <span className="more">{count} open {count === 1 ? 'role' : 'roles'} <Icon name="arrow" /></span>
      {hasCatArt(c.slug) ? <CatArt slug={c.slug} className="cat-art wm" /> : <Icon name={icon} className="wm" />}
    </Link>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="card service-card card-hover" style={{ overflow: 'hidden', padding: 0 }}>
      {s.image && <div style={{ position: 'relative', aspectRatio: '16/8' }}><Image src={s.image} alt="" fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: 'cover' }} /></div>}
      <div style={{ padding: 24 }}>
        <div className="ico"><Icon name={s.icon} /></div>
        <h3>{s.title}</h3>
        <p>{s.short_description}</p>
        <Link className="link" href={`/services/${s.slug}`}>{s.cta_text || 'Learn more'} <Icon name="arrow" /></Link>
      </div>
    </article>
  );
}

export function BlogCard({ b, featured = false }: { b: BlogPost; featured?: boolean }) {
  const href = `/blog/${b.slug}`;
  return (
    <article className={`card blog-card card-hover ${featured ? 'featured' : ''}`}>
      <Link className="thumb" href={href} aria-hidden="true" tabIndex={-1} style={{ position: 'relative', overflow: 'hidden' }}>
        {b.cover_image && <Image src={b.cover_image} alt="" fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />}
        <span className="tag" style={{ position: 'relative', zIndex: 1 }}>{b.category}</span>
      </Link>
      <div className="body">
        <h3><Link href={href}>{b.title}</Link></h3>
        <p>{b.excerpt}</p>
        <div className="meta"><span>{fmtDate(b.published_at)}</span><span>·</span><span>{b.read_minutes} min read</span></div>
      </div>
    </article>
  );
}

export function CareerCard({ c }: { c: CareerOpening }) {
  const href = `/careers/${c.slug}`;
  return (
    <article className="card career-card card-hover">
      <div className="row between"><span className="badge badge-neutral">{c.department}</span><span className="small muted">Posted {timeAgo(c.published_at)}</span></div>
      <h3><Link href={href}>{c.position}</Link></h3>
      <div className="meta"><span><Icon name="pin" />{c.location} · {c.work_mode}</span><span><Icon name="briefcase" />{c.experience}</span></div>
      <p className="muted small" style={{ margin: 0 }}>{c.description}</p>
      <div><Link className="link" href={href}>View role <Icon name="arrow" /></Link></div>
    </article>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="t-card">
      <Stars n={t.rating} />
      <blockquote>“{t.review}”</blockquote>
      <div className="who">
        <div className="avatar" aria-hidden="true">{initials(t.name)}</div>
        <div><strong>{t.name}</strong><small>{t.designation} · {t.company}</small></div>
      </div>
    </div>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return <div className="faq">{items.map(f => <details key={f.id}><summary>{f.question} <Icon name="plus" /></summary><p>{f.answer}</p></details>)}</div>;
}

export function StatusBadge({ s }: { s: string }) { return <span className={`status status-${s}`}>{label(s)}</span>; }

export function Empty({ icon = 'search', title, text, action }: { icon?: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="empty"><div className="ico"><Icon name={icon} /></div><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function Steps({ items }: { items: [string, string][] }) {
  return <div className="steps">{items.map(([h, p], i) => <div key={h} className="step"><div className="num">{i + 1}</div><h3>{h}</h3><p>{p}</p></div>)}</div>;
}

export const CANDIDATE_STEPS: [string, string][] = [['Search', 'Browse open roles by keyword, category or location.'], ['Apply', 'Submit your details and resume in a couple of minutes.'], ['Get reviewed', 'A recruiter reads your application and matches it to the role.'], ['Get connected', 'If you fit, we introduce you to the employer and support you through interviews.']];
export const EMPLOYER_STEPS: [string, string][] = [['Tell us what you need', 'Submit a requirement with role, location and timeline.'], ['We source and screen', 'We shortlist from our network and active sourcing.'], ['Review the shortlist', 'Profiles typically reach you within days, not weeks.'], ['Interview and hire', 'We coordinate interviews, offers and joining.']];
