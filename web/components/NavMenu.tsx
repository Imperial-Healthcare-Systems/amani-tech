'use client';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { BrandLogo } from './BrandLogo';
import { NAV, type Column } from './nav-items';
import s from './NavMenu.module.css';

/** One spring for the panel, so opening, resizing and moving between menus all feel like the
 *  same object rather than three different animations. */
const SPRING = { type: 'spring' as const, mass: 0.5, damping: 11.5, stiffness: 100, restDelta: 0.001, restSpeed: 0.001 };

export function NavMenu({ open, setOpen, isActive, menuActive, onDark, user }: {
  open: string | null;
  setOpen: (key: string | null) => void;
  isActive: (href: string) => boolean;
  menuActive: (match: readonly string[]) => boolean;
  onDark: boolean;
  user: { name: string } | null;
}) {
  const current = NAV.find(n => n.kind === 'menu' && n.key === open);
  const pillRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const [left, setLeft] = useState(0);

  /* The panel hangs under the item it belongs to, but a four-column menu is wider than the space
     left of it — so the ideal centred position is clamped to the viewport. Measured before paint,
     so it never appears in the wrong place first. */
  useLayoutEffect(() => {
    const place = () => {
      const pill = pillRef.current, panel = panelRef.current, btn = open ? buttons.current[open] : null;
      if (!pill || !panel || !btn) return;
      const p = pill.getBoundingClientRect(), b = btn.getBoundingClientRect();
      const w = panel.offsetWidth, gutter = 16;
      const ideal = b.left + b.width / 2 - w / 2;
      const max = Math.max(gutter, window.innerWidth - w - gutter);
      setLeft(Math.min(Math.max(ideal, gutter), max) - p.left);
    };
    place();
    if (!open) return;
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open]);

  return (
    <div ref={pillRef} data-nav-root className={`${s.pill} ${onDark ? s.onDark : ''}`} onMouseLeave={() => setOpen(null)}>
      <BrandLogo onDark={onDark} />

      <div className={s.links}>
      {NAV.map(n => n.kind === 'link' ? (
        <Link key={n.href} href={n.href} className={`${s.item} ${isActive(n.href) ? s.isActive : ''}`}
          onMouseEnter={() => setOpen(null)}>{n.label}</Link>
      ) : (
        <button key={n.key} type="button" className={`${s.item} ${menuActive(n.match) ? s.isActive : ''}`}
          data-open={open === n.key} aria-expanded={open === n.key}
          ref={el => { buttons.current[n.key] = el; }}
          onMouseEnter={() => setOpen(n.key)}
          onClick={() => setOpen(open === n.key ? null : n.key)}>
          {n.label}<Icon name="chevron" />
        </button>
      ))}
      </div>

      <div className={s.actions}>
        {user && <Link className={s.ghost} href="/candidate/dashboard"><Icon name="user" />{user.name.split(' ')[0]}</Link>}
        <Link className={s.cta} href="/contact">Talk to us</Link>
      </div>

      {/* One panel for the whole bar, centred under it. Switching menus keeps the same element, so
          layout animates it from one size to the next instead of swapping two boxes. */}
      {current?.kind === 'menu' && (
        <motion.div ref={panelRef} className={s.anchor} style={{ left }}
          initial={{ opacity: 0, scale: .94, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={SPRING}>
          <motion.div layout transition={SPRING} className={s.panel}>
            <motion.div layout className={s.inner}>
              <div className={`${s.cols} ${current.cols.length > 1 ? s.four : s.one}`}>
                {current.cols.map(col => <MenuColumn key={col.title} col={col} />)}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function MenuColumn({ col }: { col: Column }) {
  return (
    <div>
      {col.href
        ? <Link className={s.colTitle} href={col.href}>{col.title}<Icon name="arrow" /></Link>
        : <span className={s.colTitle}>{col.title}</span>}
      {col.items.map(([href, label, note], i) => (
        <Link key={`${href}-${i}`} className={s.link} href={href}>{label}{note ? <small>{note}</small> : null}</Link>
      ))}
    </div>
  );
}
