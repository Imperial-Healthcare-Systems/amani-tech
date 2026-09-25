'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icon';
import { NavMenu } from './NavMenu';
import { NAV } from './nav-items';
import { BrandLogo } from './BrandLogo';

export type HeaderUser = { name: string } | null;

export function Header({ user }: { user: HeaderUser }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);
  const menuActive = (m: readonly string[]) => m.some(active);

  // Pages that open on a dark hero let the bar sit transparent over it until the reader scrolls off.
  useEffect(() => { setOnDark(!!document.querySelector('[data-hero="dark"]')); }, [path]);

  // The bar stays put on every scroll; only its treatment changes once the reader leaves the hero.
  useEffect(() => {
    let frame = 0;
    const read = () => { frame = 0; setScrolled(window.scrollY > 8); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => { document.body.classList.toggle('modal-open', open); return () => document.body.classList.remove('modal-open'); }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setMenu(null); } }; document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${onDark && !scrolled ? 'is-over-hero' : ''}`}>
        <div className="container header-inner">
          <span className="logo-mobile"><BrandLogo onDark={onDark && !scrolled} /></span>
          <nav className="nav-slot" aria-label="Main">
            <NavMenu open={menu} setOpen={setMenu} isActive={active} menuActive={menuActive} onDark={onDark && !scrolled} user={user} />
          </nav>
          <button className="menu-btn" type="button" aria-label="Open menu" aria-controls="mobile-nav" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" /></button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <div className="mobile-nav is-open" id="mobile-nav">
            <motion.div className="backdrop" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="panel" role="dialog" aria-label="Menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}>
              <div className="panel-head"><BrandLogo /><button className="close-btn" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="x" /></button></div>
              <ul>
                {NAV.map(n => n.kind === 'link'
                  ? <li key={n.href}><Link href={n.href} className={active(n.href) ? 'is-active' : ''}>{n.label}</Link></li>
                  : (
                    <li key={n.key}>
                      <Link href={n.href} className={active(n.href) ? 'is-active' : ''}>{n.label}</Link>
                      <div className="sub is-open">{n.cols.map(col => col.href
                        ? <Link key={col.title} href={col.href} className={active(col.href) ? 'is-active' : ''}>{col.title}</Link>
                        : col.items.map(([href, label], i) => <Link key={`${href}-${i}`} href={href} className={active(href) ? 'is-active' : ''}>{label}</Link>))}</div>
                    </li>
                  ))}
              </ul>
              <div className="panel-foot">
                <Link className="btn btn-primary" href="/contact">Talk to us</Link>
                <Link className="btn btn-outline" href="/employers#request-talent">Request Talent</Link>
                {user ? <Link className="btn btn-ghost" href="/candidate/dashboard">My dashboard</Link> : <Link className="btn btn-ghost" href="/candidates">For candidates</Link>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
