'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, Logo } from './Icon';

const NAV = [['/jobs', 'Find Jobs'], ['/employers', 'Employers'], ['/services', 'Services'], ['/blog', 'Blog'], ['/about', 'About'], ['/contact', 'Contact']] as const;
// Secondary pages: mobile drawer + footer only, to keep the desktop bar uncluttered.
const MORE = [['/careers', 'Careers at Amani Tech'], ['/faqs', 'FAQs']] as const;

export type HeaderUser = { name: string; isStaff: boolean } | null;

export function Header({ user }: { user: HeaderUser }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);
  const account = user ? (user.isStaff ? { href: '/admin', label: 'Admin panel', icon: 'settings' } : { href: '/candidate/dashboard', label: user.name.split(' ')[0], icon: 'user' }) : null;

  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.classList.toggle('modal-open', open); return () => document.body.classList.remove('modal-open'); }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Logo />
          <nav className="nav" aria-label="Main">
            <ul>{NAV.map(n => <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li>)}</ul>
          </nav>
          <div className="header-actions">
            {account ? <Link className="btn btn-ghost btn-sm" href={account.href}><Icon name={account.icon} className="icon-sm" />{account.label}</Link>
              : <><Link className="btn btn-ghost btn-sm" href="/login">Login</Link><Link className="btn btn-primary btn-sm" href="/register">Register</Link></>}
            <Link className="btn btn-outline btn-sm" href="/employers#request-talent">Request Talent</Link>
          </div>
          <button className="menu-btn" type="button" aria-label="Open menu" aria-controls="mobile-nav" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" /></button>
        </div>
        <AnimatePresence>
          {open && (
            <div className="mobile-nav is-open" id="mobile-nav">
              <motion.div className="backdrop" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.div className="panel" role="dialog" aria-label="Menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}>
                <div className="panel-head"><Logo /><button className="close-btn" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="x" /></button></div>
                <ul>
                  {NAV.map(n => <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li>)}
                  {MORE.map(n => <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li>)}
                </ul>
                <div className="panel-foot">
                  {account ? <Link className="btn btn-primary" href={account.href}>{user?.isStaff ? 'Admin panel' : 'My dashboard'}</Link> : <Link className="btn btn-primary" href="/register">Register as a candidate</Link>}
                  <Link className="btn btn-outline" href="/employers#request-talent">Request Talent</Link>
                  {!account && <Link className="btn btn-ghost" href="/login">Login</Link>}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
