'use client';
import Image from 'next/image';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import s from './EngageTimeline.module.css';

export type Stage = { title: string; body: string; points: string[] };

/** How we engage, read as a process: the section pins, the track slides sideways, and each stage
 *  draws its stem and lifts its copy as it reaches the middle.
 *
 *  Pinning is a desktop, full-motion affordance — on a phone or with reduced motion the same markup
 *  is an ordinary vertical timeline. */
export function EngageTimeline({ eyebrow, heading, period, image, stages }: {
  eyebrow: string;
  heading: string;
  period: string;
  image: string;
  stages: Stage[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [drive, setDrive] = useState(false);
  const [shift, setShift] = useState(0);
  const [reached, setReached] = useState(1);
  const [arrived, setArrived] = useState(false);
  const reduce = useReducedMotion();

  /* The track holds still at both ends of the pin: the section arrives, settles, and only then
     starts moving — and it comes to rest on the last stage before it lets the page go. Without
     these the rail was already sliding the instant the section touched the top of the screen. */
  const LEAD = 0.16, TAIL = 0.88;

  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  /* Runs 0 → 1 while the section is still travelling up the screen, hitting 1 exactly when it pins.
     Nothing reveals before that, so the reader sees the whole section at rest first. */
  const { scrollYProgress: arrival } = useScroll({ target: track, offset: ['start end', 'start start'] });
  const x = useTransform(scrollYProgress, [LEAD, TAIL], [0, -shift], { clamp: true });
  const drawn = useTransform(scrollYProgress, [LEAD, TAIL], [0, 1], { clamp: true });

  /* Travel = the rail's width less the screen. It has to be measured against the stage: the rail is
     `width: max-content`, so its own scrollWidth and clientWidth are always equal. */
  const measure = useCallback(() => {
    const el = rail.current, box = stage.current;
    setShift(el && box ? Math.max(0, el.scrollWidth - box.clientWidth) : 0);
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

  useMotionValueEvent(arrival, 'change', v => setArrived(v >= 0.999));

  // A stage lights up a little before it reaches the middle, so the reveal leads the eye.
  useMotionValueEvent(scrollYProgress, 'change', p => {
    if (!drive) return;
    const q = Math.min(1, Math.max(0, (p - LEAD) / (TAIL - LEAD)));
    setReached(Math.max(1, Math.min(stages.length, Math.floor(q * stages.length + 0.9))));
  });

  return (
    <div ref={track} className={`${s.track} ${drive ? s.isDriven : ''}`}>
      <div ref={stage} className={s.stage}>
        <motion.div ref={rail} className={s.rail} style={drive ? { x } : undefined}>
          <div className={s.lead}>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{heading}</h2>
            <span className={s.period}>{period}</span>
            <div className={s.photo}>
              <Image src={image} alt="" width={900} height={1200} sizes="(max-width: 1023px) 100vw, 28vw" />
            </div>
          </div>

          <div className={s.body}>
            <div className={s.axis} aria-hidden="true"><motion.span style={drive ? { scaleX: drawn } : undefined} /></div>

            <ol className={s.steps}>
              {stages.map((st, i) => (
                <li key={st.title} className={s.step} data-on={!drive || (arrived && i < Math.max(1, reached))}>
                  <div className={s.rule} aria-hidden="true">
                    <span className={s.dot} />
                    <span className={s.stem} />
                  </div>
                  <div className={s.inner}>
                    <span className={s.mask}><span className={s.num}>{String(i + 1).padStart(2, '0')}</span></span>
                    <span className={s.mask}><h3>{st.title}</h3></span>
                    <span className={s.mask}><p>{st.body}</p></span>
                    <span className={s.points}>{st.points.join(' · ')}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
