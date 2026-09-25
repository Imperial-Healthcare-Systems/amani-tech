'use client';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Fade-up on scroll (once). */
export function Reveal({ children, delay = 0, className, style, y = 18 }: { children: ReactNode; delay?: number; className?: string; style?: React.CSSProperties; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} style={style} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

/** Staggered children (grids of cards). */
export function Stagger({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} style={style} variants={container} initial={reduce ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.1 }}>{children}</motion.div>;
}
export function Item({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <motion.div className={className} style={style} variants={item}>{children}</motion.div>;
}

/** Hero-style staged entrance (no viewport trigger). */
export function Enter({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} style={style} initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay }}>{children}</motion.div>;
}

/** Card hover lift. */
export function Lift({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <motion.div className={className} style={style} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>{children}</motion.div>;
}

/** Animated counter. */
export function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t0 = performance.now(); let raf = 0;
    const tick = (now: number) => { const p = Math.max(0, Math.min(1, (now - t0) / 1400)); setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  return <b ref={ref}>{n.toLocaleString('en-IN')}{suffix}</b>;
}

