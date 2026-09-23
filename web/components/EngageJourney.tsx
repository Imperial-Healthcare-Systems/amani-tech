'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { Reveal } from './motion';
import { EngageArt } from './EngageArt';
import s from './EngageJourney.module.css';

export type Stage = { art: string; title: string; body: string; points: string[] };

/** The four engagement stages as one connected journey: the rail draws in as the section arrives,
 *  a stage can be made active, and everything degrades to a vertical timeline on a phone. */
export function EngageJourney({ eyebrow, heading, lead, stages }: { eyebrow: string; heading: string; lead: string; stages: Stage[] }) {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLOListElement>(null);

  // The entrance plays once, when the journey actually comes into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  return (
    <section className={s.section} aria-labelledby="engage-heading">
      <div className={`container ${s.inner}`}>
        <Reveal>
          <div className={s.head}>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="engage-heading">{heading}</h2>
            <p className={s.lead}>{lead}</p>
          </div>
        </Reveal>

        <ol ref={ref} className={`${s.track} ${started ? s.started : ''}`}>
          {stages.map((st, i) => (
            <li key={st.title}>
              <button
                type="button"
                className={`${s.stage} ${active === i ? s.isActive : ''}`}
                aria-pressed={active === i}
                onClick={() => setActive(active === i ? null : i)}
              >
                <span className={s.top}>
                  <span className={s.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className={s.artWrap}><EngageArt name={st.art} /></span>
                </span>

                <span className={s.rail} aria-hidden="true">
                  <span className={s.mark}><Icon name="arrow" /></span>
                </span>

                <span className={s.title}>{st.title}</span>
                <span className={s.body}>{st.body}</span>
                <span className={s.list}>
                  {st.points.map(p => (
                    <span key={p} className={s.item}>
                      <span className={s.check}><Icon name="check" /></span>
                      <span>{p}</span>
                    </span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
