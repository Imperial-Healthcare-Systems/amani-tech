import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/motion';
import { ApplyModal } from '@/components/ApplyModal';
import { getCategories, getJobBySlug, getSimilarJobs } from '@/lib/queries';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { expText, fmtDate, initials, salary, timeAgo } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const j = await getJobBySlug((await params).slug);
  return j ? { title: `${j.title} at ${j.company_name} — ${j.location}`, description: j.description.slice(0, 155), alternates: { canonical: `/jobs/${j.slug}` } } : { title: 'Job not found' };
}

export default async function JobDetail({ params }: Props) {
  const { slug } = await params;
  const j = await getJobBySlug(slug);
  if (!j) notFound();
  const [similar, categories, user] = await Promise.all([getSimilarJobs(j), getCategories(), getUser()]);
  let prefill = null;
  if (user) { const sb = await createClient(); const { data } = await sb.from('candidates').select('name,email,phone,location').eq('user_id', user.id).maybeSingle(); prefill = data; }

  const ld = { '@context': 'https://schema.org', '@type': 'JobPosting', title: j.title, description: j.description, datePosted: j.published_at, validThrough: j.application_deadline, employmentType: j.employment_type.toUpperCase().replace('-', '_'),
    hiringOrganization: { '@type': 'Organization', name: j.company_name }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location, addressCountry: 'IN' } },
    ...(j.salary_min ? { baseSalary: { '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', minValue: Number(j.salary_min) * 100000, maxValue: Number(j.salary_max) * 100000, unitText: 'YEAR' } } } : {}) };
  const List = ({ items }: { items: string[] }) => <ul>{items.map(x => <li key={x}>{x}</li>)}</ul>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="job-head"><div className="container" id="job-head">
        <ol className="breadcrumb"><li><Link href="/">Home</Link></li><li><Link href="/jobs">Jobs</Link></li>{j.category && <li><Link href={`/jobs/category/${j.category.slug}`}>{j.category.name}</Link></li>}<li aria-current="page">{j.title}</li></ol>
        <div className="top">
          <div className={`co-mark ${j.company_logo ? 'has-logo' : ''}`} aria-hidden="true">{j.company_logo ? <img src={j.company_logo} alt="" /> : initials(j.company_name)}</div>
          <div style={{ flex: 1 }}>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>{j.is_featured && <span className="badge badge-featured">Featured</span>}{j.subcategory && <span className="badge badge-neutral">{j.subcategory.name}</span>}</div>
            <h1>{j.title}</h1><div className="co">{j.company_name}</div>
            <div className="meta"><span><Icon name="pin" />{j.location} · {j.work_mode}</span><span><Icon name="briefcase" />{expText(j)}</span><span><Icon name="rupee" />{salary(j)}</span><span><Icon name="clock" />{j.employment_type}</span></div>
            <div className="actions"><button type="button" className="btn btn-primary btn-lg" data-apply>Apply Now</button><span className="dates">Posted {timeAgo(j.published_at)} · Apply by {fmtDate(j.application_deadline)}</span></div>
          </div>
        </div>
      </div></section>

      <div className="container job-layout">
        <article className="prose">
          <Reveal><h2>About the role</h2><p>{j.description}</p></Reveal>
          {j.responsibilities.length > 0 && <Reveal><h2>Responsibilities</h2><List items={j.responsibilities} /></Reveal>}
          {j.requirements.length > 0 && <Reveal><h2>Requirements</h2><List items={j.requirements} /></Reveal>}
          {j.qualification && <Reveal><h2>Qualification</h2><p>{j.qualification}</p></Reveal>}
          {j.benefits.length > 0 && <Reveal><h2>Benefits</h2><List items={j.benefits} /></Reveal>}
          <Reveal><h2>Skills</h2><div className="row" style={{ gap: 8 }}>{j.skills.map(s => <span key={s} className="tag">{s}</span>)}</div></Reveal>
        </article>
        <aside className="stack" style={{ gap: 16 }}>
          <div className="side-card apply-card"><h3>Interested in this role?</h3><p>Apply in under two minutes. A recruiter will review your profile and contact you if it is a fit.</p><button type="button" className="btn btn-primary btn-block" data-apply>Apply Now</button><p className="small mt-16" style={{ marginBottom: 0, color: 'rgba(255,255,255,.6)' }}>No fees for job seekers · Your resume is only shared for roles you apply to.</p></div>
          <div className="side-card"><h3>Job overview</h3><dl className="overview">
            <div><dt>Category</dt><dd>{j.category?.name || '—'}</dd></div><div><dt>Specialisation</dt><dd>{j.subcategory?.name || '—'}</dd></div><div><dt>Experience</dt><dd>{expText(j)}</dd></div><div><dt>Salary</dt><dd>{salary(j)}</dd></div>
            <div><dt>Work mode</dt><dd>{j.work_mode}</dd></div><div><dt>Employment type</dt><dd>{j.employment_type}</dd></div><div><dt>Job source</dt><dd>{j.job_source || '—'}</dd></div><div><dt>Apply by</dt><dd>{fmtDate(j.application_deadline)}</dd></div>
          </dl></div>
          <div className="side-card"><h3>Similar roles</h3><div className="similar">{similar.length ? similar.map(s => <Link key={s.id} href={`/jobs/${s.slug}`}><strong>{s.title}</strong><small>{s.company_name} · {s.location} · {salary(s)}</small></Link>) : <p className="muted small">No similar roles right now.</p>}</div></div>
        </aside>
      </div>
      <ApplyModal job={j} categories={categories} prefill={prefill} />
    </>
  );
}
