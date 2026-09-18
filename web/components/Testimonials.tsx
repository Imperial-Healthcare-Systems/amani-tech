'use client';
import { useRef } from 'react';
import { Icon } from './Icon';
import { TestimonialCard } from './cards';
import type { Testimonial } from '@/lib/types';

export function Testimonials({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (dir: number) => { const t = track.current; if (!t?.firstElementChild) return; t.scrollBy({ left: dir * ((t.firstElementChild as HTMLElement).offsetWidth + 16), behavior: 'smooth' }); };
  return (
    <div className="carousel">
      <div className="carousel-track" ref={track}>{items.map(t => <TestimonialCard key={t.id} t={t} />)}</div>
      <div className="carousel-nav">
        <button type="button" aria-label="Previous" onClick={() => go(-1)}><span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" /></span></button>
        <button type="button" aria-label="Next" onClick={() => go(1)}><Icon name="arrow" /></button>
      </div>
    </div>
  );
}
