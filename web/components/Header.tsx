'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, Logo } from './Icon';

type Entry = readonly [href: string, label: string, note?: string];
type Column = { title: string; href?: string; items: readonly Entry[] };
type NavItem =
  | { kind: 'link'; href: string; label: string }
  | { kind: 'menu'; key: string; label: string; href: string; match: readonly string[]; mega?: boolean; cols: readonly Column[] };

/** The four practices are the spine of the site: every menu, page and card uses these names. */
const SERVICE_COLS: readonly Column[] = [
  { title: 'Technology Services', href: '/services/it-consulting', items: [
    ['/services/it-consulting#niches', 'Cloud Platforms', 'AWS, Azure and GCP'],
    ['/services/it-consulting#niches', 'Custom Web & App Development', 'Product engineering'],
    ['/services/it-consulting#niches', 'QA Automation', 'Playwright frameworks'],
    ['/services/it-consulting#niches', 'DevOps & CI/CD', 'Pipelines and release'],
    ['/services/it-consulting#niches', 'Cybersecurity & Data Protection', 'Audits and compliance'],
    ['/services/it-consulting#niches', 'Applied AI & Data Analytics', 'Insight and dashboards'],
  ] },
  { title: 'Talent Solutions', href: '/services/talent', items: [
    ['/services/talent#models', 'Permanent Recruitment', 'Full-time hiring'],
    ['/services/talent#models', 'Contract Staffing', 'Project-based teams'],
    ['/services/talent#models', 'Executive Search', 'Leadership roles'],
    ['/services/talent', 'IT & Non-IT Coverage', 'Every business function'],
  ] },
  { title: 'GCC Practice', href: '/gcc', items: [
    ['/gcc#scope', 'GCC Setup & Advisory', 'Incorporation to office'],
    ['/gcc#talent', 'GCC Talent & Staffing', 'Build the team'],
  ] },
  { title: 'Digital Transformation', href: '/services/transformation', items: [
    ['/services/transformation#ecosystem', 'Growth & Operations', 'CRM and pipeline automation'],
    ['/services/transformation#ecosystem', 'AI Process Automation', 'Replace manual work'],
    ['/lms', 'Training & LMS', 'Coming soon'],
  ] },
];

const NAV: readonly NavItem[] = [
  { kind: 'menu', key: 'services', label: 'Services', href: '/services', match: ['/services', '/lms'], mega: true, cols: SERVICE_COLS },
  { kind: 'link', href: '/gcc', label: 'GCC Practice' },
  { kind: 'link', href: '/employers', label: 'Employers' },
  { kind: 'menu', key: 'candidates', label: 'Candidates', href: '/candidates', match: ['/candidates', '/jobs', '/register', '/login', '/candidate'], cols: [
    { title: 'For candidates', items: [
      ['/candidates', 'Candidate hub', 'Everything in one place'],
      ['/jobs', 'Browse opportunities', 'All live openings'],
      ['/register', 'Upload your resume', 'Create a free profile'],
      ['/candidate/dashboard', 'My dashboard', 'Track your placement'],
      ['/login', 'Sign in'],
    ] },
  ] },
  { kind: 'menu', key: 'about', label: 'About', href: '/about', match: ['/about', '/blog', '/faqs', '/careers', '/contact'], cols: [
    { title: 'Company', items: [
      ['/about', 'About Amani Tech', 'Hyderabad and Toronto'],
      ['/careers', 'Careers at Amani Tech', 'Join our own team'],
      ['/blog', 'Insights', 'Articles and career advice'],
      ['/faqs', 'FAQs'],
      ['/contact', 'Contact us'],
    ] },
  ] },
];

export type HeaderUser = { name: string } | null;

export function Header({ user }: { user: HeaderUser }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);
  const menuActive = (m: readonly string[]) => m.some(active);

  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); setMenu(null); }, [path]);
  useEffect(() => { const c = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest?.('.has-dropdown')) setMenu(null); }; document.addEventListener('click', c); return () => document.removeEventListener('click', c); }, []);
  useEffect(() => { document.body.classList.toggle('modal-open', open); return () => document.body.classList.remove('modal-open'); }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setMenu(null); } }; document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Logo />
          <nav className="nav" aria-label="Main">
            <ul>{NAV.map(n => n.kind === 'link'
              ? <li key={n.href}><Link href={n.href} className={active(n.href) ? 'is-active' : ''}>{n.label}</Link></li>
              : (
                <li key={n.key} className={`has-dropdown ${n.mega ? 'is-mega' : ''} ${menu === n.key ? 'is-open' : ''}`}
                  onMouseEnter={() => setMenu(n.key)} onMouseLeave={() => setMenu(m => m === n.key ? null : m)}>
                  <button type="button" aria-expanded={menu === n.key} onClick={() => setMenu(m => m === n.key ? null : n.key)} className={menuActive(n.match) ? 'is-active' : ''}>{n.label}<Icon name="chevron" /></button>
                  <div className={`dropdown ${n.mega ? 'mega' : ''}`}>
                    {n.cols.map(col => (
                      <div key={col.title} className="dd-col">
                        {col.href
                          ? <Link className="dd-title" href={col.href}>{col.title}<Icon name="arrow" className="icon-arrow" /></Link>
                          : <span className="dd-title">{col.title}</span>}
                        {col.items.map(([href, label, note], i) => <Link key={`${href}-${i}`} href={href}>{label}{note ? <small>{note}</small> : null}</Link>)}
                      </div>
                    ))}
                  </div>
                </li>
              ))}</ul>
          </nav>
          <div className="header-actions">
            {user && <Link className="btn btn-ghost btn-sm" href="/candidate/dashboard"><Icon name="user" className="icon-sm" />{user.name.split(' ')[0]}</Link>}
            <Link className="btn btn-primary btn-sm" href="/contact">Talk to us</Link>
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
