'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, Logo } from './Icon';

const NAV = [['/about', 'About'], ['/services', 'Services'], ['/jobs', 'Find Jobs'], ['/employers', 'Employers'], null, ['/careers', 'Careers'], ['/contact', 'Contact']] as const;
const RESOURCES = [['/blog', 'Blog', 'Insights and career advice'], ['/blog?category=insights', 'Insights', 'Hiring trends and industry views'], ['/blog?category=career-advice', 'Career Advice', 'Resumes, interviews, growth'], ['/faqs', 'FAQs', 'Answers for candidates and employers']];

export function Header({ user }: { user: { name: string } | null }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [sub, setSub] = useState(false);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);

  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); setDd(false); }, [path]);
  useEffect(() => { document.body.classList.toggle('modal-open', open); return () => document.body.classList.remove('modal-open'); }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setDd(false); } }; document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Logo />
          <nav className="nav" aria-label="Main">
            <ul>
              {NAV.map((n, i) => n ? <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li> : (
                <li key={i} className={`has-dropdown ${dd ? 'is-open' : ''}`} onMouseEnter={() => setDd(true)} onMouseLeave={() => setDd(false)}>
                  <button type="button" aria-expanded={dd} aria-haspopup="true" onClick={() => setDd(v => !v)}>Resources <Icon name="chevron" /></button>
                  <div className="dropdown">{RESOURCES.map(r => <Link key={r[0]} href={r[0]}>{r[1]}<small>{r[2]}</small></Link>)}</div>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-actions">
            {user ? <Link className="btn btn-ghost btn-sm" href="/candidate/dashboard"><Icon name="user" className="icon-sm" />{user.name.split(' ')[0]}</Link>
              : <><Link className="btn btn-ghost btn-sm" href="/login">Candidate Login</Link><Link className="btn btn-primary btn-sm" href="/register">Register</Link></>}
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
                  {NAV.map((n, i) => n ? <li key={n[0]}><Link href={n[0]} className={active(n[0]) ? 'is-active' : ''}>{n[1]}</Link></li> : (
                    <li key={i}><a href="#" onClick={e => { e.preventDefault(); setSub(v => !v); }}>Resources <Icon name="chevron" className="icon-sm" /></a>
                      <ul className={`sub ${sub ? 'is-open' : ''}`}>{RESOURCES.map(r => <li key={r[0]}><Link href={r[0]}>{r[1]}</Link></li>)}</ul></li>
                  ))}
                </ul>
                <div className="panel-foot">
                  {user ? <Link className="btn btn-primary" href="/candidate/dashboard">My dashboard</Link> : <Link className="btn btn-primary" href="/register">Register as a candidate</Link>}
                  <Link className="btn btn-outline" href="/employers#request-talent">Request Talent</Link>
                  {!user && <Link className="btn btn-ghost" href="/login">Candidate Login</Link>}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
