'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import s from './PracticeShowcase.module.css';

export type Practice = {
  id: string;
  title: string;
  body: string;
  services: string[];
  image: string;
  href: string;
  cta: string;
};

/** The four practices as a rail that scrolls sideways while the section is pinned. Each card holds
 *  its picture until you hover, then lifts a panel of detail over it.
 *
 *  Pinning is a desktop, full-motion affordance only: on a phone, or for anyone who asks for less
 *  motion, the same markup becomes an ordinary swipeable row with snap points. */
export function PracticeShowcase({ items, head }: { items: Practice[]; head?: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [drive, setDrive] = useState(false);
  const [shift, setShift] = useState(0);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* Card i is centred at progress i/(n-1). A card opens only once it has arrived near the middle
     and closes again as it leaves, so the panel belongs to whichever card is sitting there. The
     first card starts centred but shut — it opens on the first nudge of scroll, not on arrival. */
  useMotionValueEvent(scrollYProgress, 'change', p => {
    if (!drive) return;
    const last = items.length - 1;
    const i = Math.min(last, Math.max(0, Math.round(p * last)));
    const reach = i === 0 || i === last ? 0.26 : 0.13;   // the ends get the whole half-band
    setActive(i);
    setOpen(Math.abs(p - i / last) <= reach && !(i === 0 && p < 0.06));
  });

  /* The rail travels exactly from the first card centred to the last card centred — measured card
     to card rather than from scrollWidth, which reports end padding inconsistently. */
  const measure = useCallback(() => {
    const cards = rail.current?.querySelectorAll('article');
    if (!cards?.length) return setShift(0);
    setShift(Math.max(0, (cards[cards.length - 1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => { setDrive(mq.matches && !reduce); measure(); };
    sync();
    mq.addEventListener('change', sync);
    window.addEventListener('resize', measure);
    return () => { mq.removeEventListener('change', sync); window.removeEventListener('resize', measure); };
  }, [reduce, measure]);

  /* Re-measure once the pinned layout is actually on the page: switching `drive` changes the rail
     from a stacked list to a row, and a measurement taken before that render reads zero. */
  useEffect(measure, [drive, measure]);

  return (
    <div ref={track} className={`${s.track} ${drive ? s.isDriven : ''}`}>
      <div className={s.stage}>
        {head && <div className={`container ${s.head}`}>{head}</div>}
        <motion.div ref={rail} className={s.rail} style={drive ? { x } : undefined}>
          {items.map((p, i) => (
            <article key={p.id} className={`${s.card} ${drive && active === i && open ? s.isActive : ''}`}>
              <div className={s.shot}>
                <Image src={p.image} alt="" width={1200} height={800} sizes="(max-width: 1023px) 80vw, 32vw" />
              </div>

              <h3 className={s.resting}>{p.title}</h3>

              <div className={s.reveal}>
                <ul className={s.tags}>{p.services.map(t => <li key={t}>{t}</li>)}</ul>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <Link className={s.go} href={p.href}>{p.cta} <Icon name="arrow" /></Link>
              </div>
            </article>
          ))}
        </motion.div>

        <div className={s.progress} aria-hidden="true">
          <motion.span style={drive ? { scaleX } : undefined} />
        </div>
      </div>
    </div>
  );
}
