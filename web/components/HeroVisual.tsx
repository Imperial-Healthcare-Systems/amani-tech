import Image from 'next/image';
import { Icon } from './Icon';
import { Enter, Float } from './motion';
import type { Job } from '@/lib/types';

/** Product-composed hero visual: a real featured job card, a confirmation, a recruiter note and a live count — plus a photo tile. */
export function HeroVisual({ job, openCount, image }: { job: Job | null; openCount: number; image?: string }) {
  return (
    <Enter delay={0.25} className="hero-visual">
      <div aria-hidden="true" style={{ position: 'relative', minHeight: 420 }}>
        {image && (
          <div style={{ position: 'absolute', right: 0, top: 0, width: '78%', height: '100%', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--sh-lg)' }}>
            <Image src={image} alt="" fill priority sizes="(max-width:1024px) 0px, 520px" style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,37,69,.05), rgba(11,37,69,.55))' }} />
          </div>
        )}
        <div className="hv-card hv-job" style={{ left: 0, top: 48 }}>
          <span className="badge badge-featured">Featured</span>
          <div className="title">{job?.title || 'Senior Java Developer'}</div>
          <div className="co">{job ? `${job.company_name} · ${job.location}` : 'Finserv Product Company · Hyderabad'}</div>
          <div className="meta">
            <span>{job ? `${job.exp_min}–${job.exp_max} yrs` : '5–8 yrs'}</span>
            <span>{job?.salary_min ? `₹${Number(job.salary_min)}–${Number(job.salary_max)} LPA` : 'Salary on request'}</span>
            <span>{job?.work_mode || 'Hybrid'}</span><span>{job?.employment_type || 'Full-time'}</span>
          </div>
          <span className="btn btn-primary btn-sm">Apply Now</span>
        </div>
        <Float className="hv-card hv-notify" style={{ right: 0, top: 0, position: 'absolute', animation: 'none' }}>
          <div className="dot"><Icon name="check" /></div>
          <div><strong>Application received</strong><small>We&apos;ve emailed your confirmation. A recruiter will review it shortly.</small></div>
        </Float>
        <Float reverse duration={7} className="hv-card hv-recruiter" style={{ right: 20, bottom: 0, position: 'absolute', animation: 'none' }}>
          <div className="who"><div className="avatar">RK</div><div><strong>Ramesh K. · Recruiter</strong><small>Amani Tech</small></div></div>
          <p>“Your profile fits the role well. Are you available for a call tomorrow at 11?”</p>
        </Float>
        <div className="hv-card hv-stat" style={{ left: 40, bottom: 40 }}>
          <Icon name="briefcase" /><div><b>{openCount}</b><small>open roles this week</small></div>
        </div>
      </div>
    </Enter>
  );
}
