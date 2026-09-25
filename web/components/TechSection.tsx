'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './Icon';
import { BRANDS } from '@/lib/brands';
import s from './TechSection.module.css';

const CAPABILITIES = [
  ['layers', 'Cloud Platforms', 'AWS, Azure and GCP'],
  ['code', 'Custom Web & App Development', 'Web and mobile products'],
  ['usercheck', 'Software Testing / QA Automation', 'Playwright, test automation'],
  ['zap', 'DevOps & CI/CD Pipelines', 'Faster, safer releases'],
  ['shield', 'Cybersecurity & Data Protection', 'Audits and compliance'],
  ['chart', 'Applied AI & Data Analytics', 'Insights and reporting'],
] as const;

/** Writes the cursor's position onto the card so the CSS can light the border under it. */
const spot = (e: React.PointerEvent<HTMLAnchorElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export function TechSection() {
  return (
    <>
      <div className={s.wrap}>
        <div className={s.copy}>
          <div className={s.head}>
            <div>
              <span className="eyebrow">Technology Services</span>
              <h2>Six engineering <span className="accent">capabilities</span></h2>
              <p className={s.lead}>High-impact technology that helps organisations build, secure and scale their digital infrastructure.</p>
            </div>
            <Link className="btn btn-outline" href="/services/it-consulting">See the practice <Icon name="arrow" /></Link>
          </div>

          <div className={s.grid}>
            {CAPABILITIES.map(([icon, title, note]) => (
              <Link key={title} className={s.card} href="/services/it-consulting#niches" onPointerMove={spot}>
                <span className={s.tile}><Icon name={icon} /></span>
                <span className={s.text}><b>{title}</b><span>{note}</span></span>
                <span className={s.arrow}><Icon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </div>

        <div className={s.art}>
          <Image src="/practices/01.webp" alt="" width={1200} height={800} sizes="(max-width: 1023px) 100vw, 44vw" />
        </div>
      </div>

      <div className={s.strip}>
        <p>Platforms and stacks we build on</p>
        <div className="marquee"><div className="marquee-track">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className={s.chip} style={{ ['--c' as string]: b.hex }} aria-hidden={i >= BRANDS.length}>
              <svg viewBox="0 0 24 24" role="img" aria-label={b.name} fill={b.hex}><path d={b.path} /></svg>
              {b.name}
            </span>
          ))}
        </div></div>
      </div>
    </>
  );
}
