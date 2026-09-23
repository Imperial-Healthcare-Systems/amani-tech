'use client';
import { useEffect, useRef, useState } from 'react';
import { WhyGccArt } from './WhyGccArt';
import s from './WhyGcc.module.css';

export type WhyGccPoint = { art: string; title: string; body: string };

/** A faint curtain-wall building for the backdrop. */
function Facade() {
  const cols = Array.from({ length: 9 }, (_, i) => i);
  const rows = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg className={s.building} viewBox="0 0 300 420" aria-hidden="true">
      <g fill="none" stroke="#2563EB" strokeOpacity=".12" strokeWidth="1">
        <path d="M40 420V70L170 20L300 60V420" />
        <path d="M170 20V420" />
        {cols.map(c => <path key={`l${c}`} d={`M${40 + c * 14.4} ${70 - c * 5.55}V420`} />)}
        {rows.map(r => <path key={`r${r}`} d={`M40 ${90 + r * 21}L170 ${40 + r * 21}L300 ${80 + r * 21}`} />)}
      </g>
    </svg>
  );
}

/** "Why Amani Tech" for the GCC practice: four editorial cards, each led by an illustration. */
export function WhyGcc({ eyebrow, heading, points }: { eyebrow: string; heading: string; points: WhyGccPoint[] }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // The entrance plays once, when the section comes into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  return (
    <section ref={ref} className={`${s.section} ${started ? s.started : ''}`} aria-labelledby="why-gcc-heading">
      <div className={s.decor} aria-hidden="true">
        <span className={s.arcWide} />
        <span className={s.arcLine} />
        <Facade />
      </div>
      <div className={`container ${s.inner}`}>
        <div className={s.head}>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="why-gcc-heading">{heading}</h2>
          <span className={s.rule} aria-hidden="true" />
        </div>

        <ul className={s.grid}>
          {points.map((pt, i) => (
            <li key={pt.title}>
              <article className={s.card} style={{ '--i': i } as React.CSSProperties}>
                <div className={s.stage}><div className={s.art}><WhyGccArt name={pt.art} /></div></div>
                <div className={s.body}>
                  <h3 className={s.title}>{pt.title}</h3>
                  <p className={s.text}>{pt.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
