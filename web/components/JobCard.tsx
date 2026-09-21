import Link from 'next/link';
import { Icon } from './Icon';
import { daysAgo, expText, initials, salary, timeAgo } from '@/lib/format';
import type { Job } from '@/lib/types';

export function JobCard({ job: j }: { job: Job }) {
  const href = `/jobs/${j.slug}`;
  return (
    <article className={`job-card ${j.is_featured ? 'is-featured' : ''}`}>
      <div className="top">
        <div className={`co-mark ${j.company_logo ? 'has-logo' : ''}`} aria-hidden="true">{j.company_logo ? <img src={j.company_logo} alt="" /> : initials(j.company_name)}</div>
        <div><h3><Link href={href}>{j.title}</Link></h3><div className="co">{j.company_name}</div></div>
        <div className="badges">
          {j.is_featured && <span className="badge badge-featured"><Icon name="star" className="icon-sm" />Featured</span>}
          {!j.is_featured && daysAgo(j.published_at) <= 2 && <span className="badge badge-new">New</span>}
        </div>
      </div>
      <div className="meta">
        <span><Icon name="pin" />{j.location}{j.work_mode !== 'On-site' && j.work_mode !== j.location ? ` · ${j.work_mode}` : ''}</span>
        <span><Icon name="briefcase" />{expText(j)}</span>
        <span><Icon name="rupee" />{salary(j)}</span>
        <span><Icon name="clock" />{j.employment_type}</span>
      </div>
      <div className="skills">{j.skills.slice(0, 4).map(s => <span key={s} className="tag">{s}</span>)}{j.skills.length > 4 && <span className="tag">+{j.skills.length - 4}</span>}</div>
      <div className="foot"><span>Posted {timeAgo(j.published_at)}</span><Link className={`btn btn-sm ${j.is_featured ? 'btn-secondary' : 'btn-outline'}`} href={href}>View Job <Icon name="arrow" className="icon-sm" /></Link></div>
    </article>
  );
}
