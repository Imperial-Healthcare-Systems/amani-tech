'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { RunArt } from './RunArt';
import s from './RunJourney.module.css';

export type RunStage = { art: string; title: string; body: string; caps: [icon: string, label: string][] };

/** The GCC lifecycle on one timeline. Hovering (or keyboard focus) previews how far along the journey a
 *  stage sits; clicking makes it the active stage. One stage is active at a time. On phones and tablets
 *  the same journey reads as a vertical timeline and works by tap. */
export function RunJourney({ eyebrow, heading, stages }: { eyebrow: string; heading: string; stages: RunStage[] }) {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  // The entrance plays once, when the section comes into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  // Escape releases the active stage.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  // The timeline fills to the stage being looked at, otherwise to the active one.
  const progress = hovered ?? active;
  const last = stages.length - 1;
  // Touch screens report a tap as a hover that never ends; only real pointers get the preview.
  const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <section ref={ref} className={`${s.section} ${started ? s.started : ''}`} aria-labelledby="run-heading">
      <span className={s.arc} aria-hidden="true" />
      <span className={s.facade} aria-hidden="true" />
      <div className={`container ${s.inner}`}>
        <div className={s.head}>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="run-heading">{heading}</h2>
          <span className={s.rule} aria-hidden="true" />
        </div>

        <div className={s.journey} style={{ '--n': stages.length } as React.CSSProperties}>
          <span className={s.line} aria-hidden="true">
            <span className={s.lineFill} style={{ transform: `scaleX(${progress === null ? 0 : progress / last})` }} />
          </span>

          <ol className={s.track}>
            {stages.map((st, i) => {
              const cls = [
                s.stage,
                active === i && s.isActive,
                hovered === i && s.isHover,
                progress !== null && i <= progress && s.reached,
                progress !== null && i < progress && s.segOn,
              ].filter(Boolean).join(' ');
              return (
                <li key={st.title} className={cls} style={{ '--i': i } as React.CSSProperties}
                  onMouseEnter={() => { if (canHover()) setHovered(i); }}
                  onMouseLeave={() => setHovered(h => (h === i ? null : h))}>
                  <span className={s.seg} aria-hidden="true" />
                  <span className={s.marker} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>

                  <div className={s.card}>
                    <div className={s.artWrap}><RunArt name={st.art} /></div>
                    <div className={s.text}>
                      <h3 className={s.title}>{st.title}</h3>
                      <p className={s.body}>{st.body}</p>
                      <span className={s.divider} aria-hidden="true" />
                      <ul className={s.caps}>
                        {st.caps.map(([icon, label]) => <li key={label} className={s.cap}><Icon name={icon} /><span>{label}</span></li>)}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={s.hit}
                    aria-pressed={active === i}
                    aria-label={`Stage ${i + 1} of ${stages.length}: ${st.title}`}
                    onClick={() => setActive(a => (a === i ? null : i))}
                    // keyboard focus previews the stage the way hover does; a mouse or finger press does not
                    onFocus={e => { if (e.currentTarget.matches(':focus-visible')) setHovered(i); }}
                    onBlur={() => setHovered(h => (h === i ? null : h))}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
