import Link from 'next/link';
import { Icon } from './Icon';
import { Item, Reveal, Stagger } from './motion';
import { WhyArt } from './WhyArt';
import s from './WhyCards.module.css';

export type WhyPoint = { art: string; title: string; body: string; href: string };

/** "Why Amani Tech" — four capability cards under a wide heading, on a lightly decorated background. */
export function WhyCards({ eyebrow, heading, lead, points }: { eyebrow: string; heading: string; lead: string; points: WhyPoint[] }) {
  return (
    <section className={s.section}>
      <span className={s.arc} aria-hidden="true" />
      <span className={s.dots} aria-hidden="true" />
      <div className={`container ${s.inner}`}>
        <Reveal>
          <div className={s.head}>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{heading}</h2>
            <span className={s.rule} aria-hidden="true" />
            <p className={s.lead}>{lead}</p>
          </div>
        </Reveal>

        <Stagger className={s.grid}>
          {points.map((p, i) => (
            <Item key={p.title}>
              <Link href={p.href} className={s.card}>
                <span className={s.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className={s.artWrap}><WhyArt name={p.art} /></div>
                <h3 className={s.title}>{p.title}</h3>
                <p className={s.body}>{p.body}</p>
                <span className={s.cta}>
                  <span className={s.ctaDot}><Icon name="arrow" /></span>
                  <span className={s.ctaText}>Learn more</span>
                </span>
              </Link>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
