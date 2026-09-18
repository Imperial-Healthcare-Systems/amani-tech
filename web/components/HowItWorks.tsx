'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { Icon } from './Icon';
import { Reveal } from './motion';
import { hand } from './fonts';

type Stage = { title: string; text: string; icon: string };
/** Visual summary of the candidate lifecycle. The real process lets candidates move back and forth between stages. */
const CANDIDATE: Stage[] = [
  { title: 'Profile & Resume', text: 'Create your profile and submit your resume.', icon: 'file' },
  { title: 'Profile Review', text: 'Our recruitment team reviews your experience, skills and career goals.', icon: 'search' },
  { title: 'Assessment & Readiness', text: 'Evaluate your skills, identify gaps and determine job readiness.', icon: 'chart' },
  { title: 'Preparation', text: 'Improve your resume, skills, communication and interview readiness where required.', icon: 'layers' },
  { title: 'Job Matching', text: 'Get matched with relevant opportunities and track applications.', icon: 'briefcase' },
  { title: 'Interviews', text: 'Track interview rounds, feedback and next steps.', icon: 'users' },
  { title: 'Offer & Placement', text: 'Move from offer acceptance to joining and placement confirmation.', icon: 'trophy' },
];
const EMPLOYER: Stage[] = [
  { title: 'Tell Us What You Need', text: 'Submit your hiring requirement, role, location and timeline.', icon: 'edit' },
  { title: 'Source & Screen', text: 'We source relevant professionals and screen candidates.', icon: 'search' },
  { title: 'Review Shortlist', text: 'Review qualified profiles matched to your requirement.', icon: 'usercheck' },
  { title: 'Interview & Hire', text: 'Coordinate interviews, offers and joining.', icon: 'users' },
  { title: 'Ongoing Support', text: 'Continue receiving recruitment support based on your hiring needs.', icon: 'message' },
];
const COLORS = ['#2563EB', '#7C3AED', '#0E9F6E', '#EA580C'];
const TABS = [['c', 'For Candidates', 'user'], ['e', 'For Employers', 'building']] as const;
const EASE = [0.2, 0.7, 0.2, 1] as const;

// Wave path in a 1000×80 box; nodes sit on alternating heights so the line gently undulates between them.
const W = 1000, YS = [30, 50];
function wave(n: number) {
  const pts = Array.from({ length: n }, (_, i) => [((i + 0.5) / n) * W, YS[i % 2]]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  const mids: [number, number][] = [];
  for (let i = 1; i < n; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
    mids.push([mx, (y0 + y1) / 2]);
  }
  return { d, mids };
}

function Arrow({ d, className = '' }: { d: string; className?: string }) {
  return <svg viewBox="0 0 60 40" className={`how-arrow ${className}`} aria-hidden="true"><path d={d} /></svg>;
}

/** `audience="employer"` renders the employer journey only: no toggle, employer header copy and CTAs, no candidate visual. */
export function HowItWorks({ audience = 'both' }: { audience?: 'both' | 'employer' }) {
  const employerOnly = audience === 'employer';
  const [tab, setTab] = useState<'c' | 'e'>(employerOnly ? 'e' : 'c');
  const reduce = useReducedMotion();
  const id = useId();
  const stages = tab === 'c' ? CANDIDATE : EMPLOYER;
  const { d, mids } = wave(stages.length);

  const appear = (delay: number): HTMLMotionProps<'div'> => reduce ? {} : {
    initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.55, ease: EASE, delay },
  };
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = tab === 'c' ? 'e' : 'c';
    setTab(next);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
  };

  return (
    <section className={`section section-how ${hand.variable}`} id="how-it-works">
      <span className="how-orbit" aria-hidden="true" />
      <span className="how-dots" aria-hidden="true" />
      {!employerOnly && <>
        <div className="how-visual" aria-hidden="true"><Image src="/male_candidate.png" alt="" width={1434} height={1097} sizes="360px" /></div>
        <p className="how-note how-note-right" aria-hidden="true">Your next opportunity<br />is closer than you think.<Arrow d="M56 6C46 14 34 22 8 34M16 34l-9 1 2-9" className="flip" /></p>
      </>}

      <div className="container">
        <Reveal>
          <div className="section-head center how-head">
            <span className="eyebrow">How it works</span>
            {employerOnly ? <>
              <h2>From requirement{" "}<br className="how-br" />to <span className="accent">joining.</span></h2>
              <p className="lead">Tell us what you need and we handle sourcing, screening, interviews and onboarding, with one recruiter as your point of contact throughout.</p>
            </> : <>
              <h2>A clear path from{" "}<br className="how-br" />opportunity to <span className="accent">placement.</span></h2>
              <p className="lead">From your first profile submission to interviews, offers and placement, Amani Tech supports every stage of your journey.</p>
            </>}
          </div>
        </Reveal>
        {!employerOnly && <Reveal delay={0.1}>
          <div className="center">
            <div className="how-seg" role="tablist" aria-label="How it works" onKeyDown={onKey}>
              {TABS.map(([k, label, icon]) => (
                <button key={k} type="button" role="tab" data-tab={k} id={`${id}-tab-${k}`} aria-selected={tab === k} aria-controls={`${id}-panel`} tabIndex={tab === k ? 0 : -1} onClick={() => setTab(k)}>
                  {tab === k && <motion.span className="how-seg-pill" layoutId={`${id}-pill`} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <Icon name={icon} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} id={`${id}-panel`} role={employerOnly ? undefined : 'tabpanel'} aria-labelledby={employerOnly ? undefined : `${id}-tab-${tab}`}
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? undefined : { opacity: 0, y: -10, scale: 0.99 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className={`how-track n${stages.length}`}>
              <p className="how-note how-note-start" aria-hidden="true">Start here<Arrow d="M10 4c6 12 14 22 30 30M30 34l10 1-3-9" /></p>
              <svg className="how-wave" viewBox={`0 0 ${W} 80`} preserveAspectRatio="none" aria-hidden="true">
                <motion.path d={d} initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }} />
                {mids.map(([x, y], i) => (
                  <motion.circle key={i} cx={x} cy={y} r="5" style={{ color: COLORS[(i + 1) % COLORS.length] }}
                    initial={reduce ? false : { opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.16, duration: 0.3 }} />
                ))}
              </svg>
              {stages.map((s, i) => (
                <motion.div key={s.title} className={`how-stage${i === 0 ? ' is-first' : ''}`} style={{ '--c': COLORS[i % COLORS.length], '--y': `${YS[i % 2]}px` } as React.CSSProperties} {...appear(0.3 + i * 0.08)}>
                  <span className="how-node"><span className="how-node-in"><Icon name={s.icon} /></span></span>
                  <span className="how-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </motion.div>
              ))}
            </div>
            <div className="how-cta">
              {tab === 'c'
                ? <><Link className="btn btn-primary btn-lg" href="/register">Build Your Profile <Icon name="arrow" /></Link><Link className="btn btn-outline btn-lg" href="/jobs">Find Jobs <Icon name="arrow" /></Link></>
                : <><Link className="btn btn-primary btn-lg" href="/employers#request-talent">Request Talent <Icon name="arrow" /></Link><Link className="btn btn-outline btn-lg" href="/contact">Talk to Us <Icon name="arrow" /></Link></>}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="how-foot">
          <ul className="how-trust">
            {employerOnly ? <>
              <li><Icon name="usercheck" /><div><strong>Screened, not scraped</strong><small>Every profile reviewed by a recruiter</small></div></li>
              <li><Icon name="layers" /><div><strong>IT and non-IT</strong><small>One partner for every role</small></div></li>
              <li><Icon name="clock" /><div><strong>Shortlists in days</strong><small>Not weeks</small></div></li>
            </> : <>
              <li><Icon name="shield" /><div><strong>Verified Employers</strong><small>Trusted opportunities</small></div></li>
              <li><Icon name="users" /><div><strong>Expert Recruiters</strong><small>Guidance at every step</small></div></li>
              <li><Icon name="star" /><div><strong>No Fees</strong><small>For job seekers</small></div></li>
            </>}
          </ul>
          <p className="how-note how-note-end" aria-hidden="true"><Arrow d="M4 24c14 6 30 4 52-14M48 8l8 1-3 8" />{employerOnly ? <>The right people.<br />Right on time.</> : <>More than jobs.<br />A brighter tomorrow.</>}</p>
        </div>
      </div>
    </section>
  );
}
