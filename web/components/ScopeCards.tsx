'use client';
import { useEffect, useId, useState } from 'react';
import { Icon } from './Icon';
import { Item, Reveal, Stagger } from './motion';
import { ScopeArt } from './ScopeArt';
import s from './ScopeCards.module.css';

export type ScopeItem = { art: string; title: string; text: string; points: string[]; detail: string; detailPoints: string[] };

/** The GCC scope as four flip cards: hover previews a card's detail, click (or tap) keeps it open,
 *  and only one card is ever turned over at a time. */
export function ScopeCards({ id, eyebrow, heading, lead, items }: { id?: string; eyebrow: string; heading: string; lead: string; items: ScopeItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const uid = useId();

  // Escape closes whichever card is open.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  // A card is shown turned over when it is the locked one, or when it is hovered and nothing is locked —
  // so moving from one card to the next closes the first as the second opens.
  const isOpen = (i: number) => active === i || (active === null && hovered === i);

  // Clicking an open card closes it and drops the hover preview too, so it turns back even under the pointer.
  const toggle = (i: number) => { if (active === i) { setActive(null); setHovered(null); } else setActive(i); };
  // Touch screens report a tap as a hover that never ends; only real pointers get the preview.
  const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <section id={id} className={s.section}>
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
          {items.map((it, i) => {
            const open = isOpen(i);
            const num = String(i + 1).padStart(2, '0');
            return (
              <Item key={it.title}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={active === i}
                  aria-controls={`${uid}-${i}-back`}
                  aria-label={`${it.title}. ${active === i ? 'Hide' : 'Show'} details`}
                  className={`${s.card} ${open ? s.isOpen : ''}`}
                  onMouseEnter={() => { if (canHover()) setHovered(i); }}
                  onMouseLeave={() => setHovered(hovered === i ? null : hovered)}
                  onClick={() => toggle(i)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}
                >
                  <div className={s.flipper}>
                    {/* front */}
                    <div className={`${s.face} ${s.front}`} aria-hidden={open}>
                      <span className={s.num} aria-hidden="true">{num}</span>
                      <div className={s.artWrap}><ScopeArt name={it.art} /></div>
                      <h3 className={s.title}>{it.title}</h3>
                      <p className={s.desc}>{it.text}</p>
                      <ul className={s.list}>
                        {it.points.slice(0, 2).map(p => <li key={p} className={s.item}><Icon name="check" /><span>{p}</span></li>)}
                      </ul>
                      <span className={s.more}><span className={s.moreDot}><Icon name="arrow" /></span>Learn more</span>
                    </div>

                    {/* back */}
                    <div className={`${s.face} ${s.back}`} id={`${uid}-${i}-back`} aria-hidden={!open}>
                      <div className={s.backHead}>
                        <span className={s.backNum} aria-hidden="true">{num}</span>
                        <button type="button" className={s.close} aria-label={`Close ${it.title}`} tabIndex={open ? 0 : -1}
                          onClick={e => { e.stopPropagation(); setActive(null); setHovered(null); }}>
                          <Icon name="x" />
                        </button>
                      </div>
                      <h3 className={s.backTitle}>{it.title}</h3>
                      <p className={s.backDesc}>{it.detail}</p>
                      <div className={s.divider} aria-hidden="true" />
                      <ul className={s.backList}>
                        {it.detailPoints.map(p => <li key={p} className={s.backItem}><span className={s.backCheck}><Icon name="check" /></span><span>{p}</span></li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </Item>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
