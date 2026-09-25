'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { HeroBase } from './HeroBase';
import s from './HeroCarousel.module.css';

export type HeroSlide = {
  image: string;
  alt: string;
  eyebrow: string;
  heading: string;
  /** Tail of `heading` to print in accent blue. */
  accent?: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const DURATION = 4500;

/* The frames ship as 1920px WebP, already sized and compressed for a full-bleed hero, so they go
   out as-is: running them back through the image optimiser only re-encodes them larger, and in dev
   it left the first paint blank while it generated up to 3840px variants of all four at once. */

/** The four practices, one frame each, on the pictures they were shot for. The deck runs
 *  continuously — hovering does not stop it. It holds only while a keyboard user is inside it,
 *  while the tab is hidden, and for anyone who asks for less motion. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const still = useRef(false);

  const go = useCallback((n: number) => setI(((n % slides.length) + slides.length) % slides.length), [slides.length]);

  useEffect(() => { still.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);

  useEffect(() => {
    if (paused || still.current || slides.length < 2) return;
    const t = setTimeout(() => go(i + 1), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, go, slides.length]);

  // A tab in the background should not burn through the deck while nobody is watching.
  useEffect(() => {
    const vis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
  };

  return (
    <section
      className={`${s.hero} ${paused ? s.isPaused : ''}`}
      aria-roledescription="carousel" aria-label="What Amani Tech does" data-hero="dark"
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={onKey}
    >
      {slides.map((sl, n) => (
        <div key={sl.image} className={`${s.frame} ${n === i ? s.isOn : ''}`} aria-hidden="true">
          <Image src={sl.image} alt="" fill priority unoptimized sizes="100vw" />
        </div>
      ))}
      <span className={s.tint} aria-hidden="true" />

      <div className={`container ${s.inner}`}>
        <div className={s.copy} aria-live="polite">
          {slides.map((sl, n) => {
            const head = sl.accent && sl.heading.endsWith(sl.accent)
              ? [sl.heading.slice(0, -sl.accent.length), sl.accent]
              : [sl.heading, ''];
            return (
              <div key={sl.image} className={`${s.slide} ${n === i ? s.isOn : ''}`}
                role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}: ${sl.eyebrow}`}>
                <span className={s.eyebrow}>{sl.eyebrow}</span>
                <h1>{head[0]}{head[1] && <em>{head[1]}</em>}</h1>
                <p>{sl.body}</p>
                <div className={s.actions}>
                  <Link className="btn btn-primary btn-lg" href={sl.primary.href} tabIndex={n === i ? 0 : -1}>
                    {sl.primary.label} <Icon name="arrow" />
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" href={sl.secondary.href} tabIndex={n === i ? 0 : -1}>
                    {sl.secondary.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className={s.controls}>
          <ul className={s.dots}>
          {slides.map((sl, n) => (
            <li key={sl.image}>
              <button type="button" className={s.dot} aria-current={n === i} onClick={() => go(n)}
                aria-label={`Show slide ${n + 1} of ${slides.length}: ${sl.eyebrow}`}>
                <span className={s.rail} style={{ ['--dur' as string]: `${DURATION}ms` }}>
                  <span className={s.fill} />
                </span>
              </button>
            </li>
          ))}
        </ul>
          <span className={s.count}><b>{String(i + 1).padStart(2, '0')}</b> / {String(slides.length).padStart(2, '0')}</span>
      </div>
        {/* Outside the deck, so it holds still while the slides turn. */}
        <HeroBase />
      </div>

    </section>
  );
}
