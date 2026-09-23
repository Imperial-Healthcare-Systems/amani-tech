'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, Logo } from './Icon';

const NAV = [['/jobs', 'Find Jobs'], ['/employers', 'Employers'], ['/services', 'Services'], ['/blog', 'Blog'], ['/about', 'About'], ['/contact', 'Contact']] as const;
// What sits under the Services dropdown (desktop) and indented under Services (mobile drawer).
const SERVICES = [
  ['/services', 'Staffing Services', 'IT and non-IT hiring, contract to permanent'],
  ['/services/it-consulting', 'IT Consulting', 'AI, cloud, security, software and data'],
  ['/gcc', 'GCC Practice', 'Set up your capability center in Hyderabad'],
  ['/lms', 'Training & LMS', 'Corporate upskilling — coming soon'],
] as const;
// Secondary pages: mobile drawer + footer only, to keep the desktop bar uncluttered.
const MORE = [['/careers', 'Careers at Amani Tech'], ['/faqs', 'FAQs']] as const;

export type HeaderUser = { name: string } | null;

export function Header({ user }: { user: HeaderUser }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);

  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); setSvcOpen(false); }, [path]);
  useEffect(() => { const c = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest?.('.has-dropdown')) setSvcOpen(false); }; document.addEventListener('click', c); return () => document.removeEventListener('click', c); }, []);
  useEffect(() => { document.body.classList.toggle('modal-open', open); return () => document.body.classList.remove('modal-open'); }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Logo />
          <nav className="nav" aria-label="Main">
            <ul>{NAV.map(n => n[0] === '/services' ? (
              <li key={n[0]} className={`has-dropdown ${svcOpen ? 'is-open' : ''}`} onMouseEnter={() => setSvcOpen(true)} onMouseLeave={() => setSvcOpen(false)}>
                <button type="button" aria-expanded={svcOpen} onClick={() => setSvcOpen(v => !v)} className={active('/services') || active('/gcc') || active('/lms') ? 'is-active' : ''}>{n[1]}<Icon name="chevron" /></button>
                <div className="dropdown">{SERVICES.map(s => <Link key={s[0]} href={s[0]}>{s[1]}<small>{s[2]}</small></Link>)}</div>
              </li>
            ) : <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li>)}</ul>
          </nav>
          <div className="header-actions">
            {user ? <Link className="btn btn-ghost btn-sm" href="/candidate/dashboard"><Icon name="user" className="icon-sm" />{user.name.split(' ')[0]}</Link>
              : <><Link className="btn btn-ghost btn-sm" href="/login">Login</Link><Link className="btn btn-primary btn-sm" href="/register">Register</Link></>}
            <Link className="btn btn-outline btn-sm" href="/employers#request-talent">Request Talent</Link>
          </div>
          <button className="menu-btn" type="button" aria-label="Open menu" aria-controls="mobile-nav" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" /></button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <div className="mobile-nav is-open" id="mobile-nav">
            <motion.div className="backdrop" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="panel" role="dialog" aria-label="Menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}>
              <div className="panel-head"><Logo /><button className="close-btn" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="x" /></button></div>
              <ul>
                {NAV.map(n => n[0] === '/services' ? (
                  <li key={n[0]}>
                    <Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link>
                    <div className="sub is-open">{SERVICES.slice(1).map(s => <Link key={s[0]} href={s[0]} className={active(s[0]) ? 'is-active' : ''}>{s[1]}</Link>)}</div>
                  </li>
                ) : <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li>)}
                {MORE.map(n => <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li>)}
              </ul>
              <div className="panel-foot">
                {user ? <Link className="btn btn-primary" href="/candidate/dashboard">My dashboard</Link> : <Link className="btn btn-primary" href="/register">Register as a candidate</Link>}
                <Link className="btn btn-outline" href="/employers#request-talent">Request Talent</Link>
                {!user && <Link className="btn btn-ghost" href="/login">Login</Link>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
