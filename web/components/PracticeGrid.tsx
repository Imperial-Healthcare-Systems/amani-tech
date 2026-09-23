'use client';
import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon';
import { PracticeArt } from './PracticeArt';
import s from './PracticeGrid.module.css';

export type Practice = { art: string; title: string; lead: string; points: string[] };

/** The five consulting practices as an explorer: minimal on load, a preview on hover,
 *  the full detail on click (or tap, or Enter). One card is open at a time. */
export function PracticeGrid({ items }: { items: Practice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const uid = useId();

  // Escape closes the open card wherever focus happens to be.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <div className={s.wrap}>
      <div className={s.grid}>
        {items.map((p, i) => (
          <Card key={p.title} p={p} index={i} id={`${uid}-${i}`}
            open={active === i || (active === null && hovered === i)}
            isActive={active === i}
            onEnter={() => setHovered(i)}
            onLeave={() => setHovered(hovered === i ? null : hovered)}
            onToggle={() => setActive(active === i ? null : i)}
            onClose={() => { setActive(null); setHovered(null); }}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ p, index, id, open, isActive, onEnter, onLeave, onToggle, onClose }: {
  p: Practice; index: number; id: string; open: boolean; isActive: boolean;
  onEnter: () => void; onLeave: () => void; onToggle: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);
  const num = String(index + 1).padStart(2, '0');

  // The illustration drifts a few pixels toward the cursor. Pointer devices only, and never on a phone.
  const track = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', `${(((e.clientX - r.left) / r.width) - .5) * 14}px`);
    el.style.setProperty('--py', `${(((e.clientY - r.top) / r.height) - .5) * 10}px`);
    if (!fine) setFine(true);
  }, [fine]);
  const reset = () => { const el = ref.current; if (el) { el.style.setProperty('--px', '0px'); el.style.setProperty('--py', '0px'); } };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-controls={`${id}-panel`}
      aria-label={`${p.title}. ${isActive ? 'Hide' : 'Show'} details`}
      className={`${s.card} ${open ? s.isOpen : ''}`}
      onMouseEnter={onEnter}
      onMouseMove={track}
      onMouseLeave={() => { onLeave(); reset(); }}
      onFocus={onEnter}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) onLeave(); }}
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
        if (e.key === 'Escape' && isActive) { e.preventDefault(); onClose(); }
      }}
    >
      <div className={s.inner}>
        <div className={`${s.face} ${s.front}`} aria-hidden={open}>
          <span className={s.num}>{num}</span>
          <div className={s.artWrap}><PracticeArt name={p.art} /></div>
          <h3 className={s.title}>{p.title}</h3>
          <p className={s.hint}>Click to explore</p>
        </div>

        <div className={`${s.face} ${s.back}`} id={`${id}-panel`} aria-hidden={!open}>
          <div className={s.backHead}>
            <span className={s.num}>{num}</span>
            {isActive && (
              <button type="button" className={s.close} aria-label={`Close ${p.title}`}
                onClick={e => { e.stopPropagation(); onClose(); }}>
                <Icon name="x" />
              </button>
            )}
          </div>
          <h3 className={s.title}>{p.title}</h3>
          <p className={s.desc}>{p.lead}</p>
          <ul className={s.list}>
            {p.points.map(pt => <li key={pt} className={s.item}><Icon name="check" /><span>{pt}</span></li>)}
          </ul>
          <Link className={`btn btn-primary btn-sm ${s.cta}`} href="/contact" tabIndex={open ? 0 : -1} onClick={e => e.stopPropagation()}>
            Talk to us about this <Icon name="arrow" className="icon-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}
