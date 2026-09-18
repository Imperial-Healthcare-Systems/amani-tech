'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Icon, LogoMark } from '../Icon';
import { useToast } from '../Toast';
import { adminSignOut } from '@/lib/actions/admin';

type Item = { href: string; label: string; icon: string; count?: number; sub?: { href: string; label: string }[] };
const TITLES: [string, string][] = [['/admin/jobs/new', 'Create Job'], ['/admin/jobs', 'Jobs'], ['/admin/categories', 'Categories'], ['/admin/applications', 'Applications'], ['/admin/candidates', 'Candidates'], ['/admin/employers', 'Employer Enquiries'], ['/admin/vendors', 'Vendor Enquiries'], ['/admin/testimonials', 'Testimonials'], ['/admin/blog', 'Blog'], ['/admin/careers', 'Career Openings'], ['/admin/cms', 'Website CMS'], ['/admin/settings', 'Settings'], ['/admin', 'Dashboard']];

export function AdminShell({ children, admin, counts }: { children: ReactNode; admin: { name: string; email: string }; counts: { applications: number; employers: number; vendors: number; testimonials: number } }) {
  const path = usePathname(); const router = useRouter(); const toast = useToast();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const groups: { g: string; items: Item[] }[] = [
    { g: '', items: [{ href: '/admin', label: 'Dashboard', icon: 'home' }] },
    { g: 'Recruitment', items: [{ href: '/admin/jobs', label: 'Jobs', icon: 'briefcase', sub: [{ href: '/admin/jobs', label: 'All Jobs' }, { href: '/admin/jobs/new', label: 'Create Job' }, { href: '/admin/categories', label: 'Categories' }] }, { href: '/admin/applications', label: 'Applications', icon: 'file', count: counts.applications }, { href: '/admin/candidates', label: 'Candidates', icon: 'users' }] },
    { g: 'Leads', items: [{ href: '/admin/employers', label: 'Employers', icon: 'building', count: counts.employers }, { href: '/admin/vendors', label: 'Vendors', icon: 'globe', count: counts.vendors }] },
    { g: 'Content', items: [{ href: '/admin/testimonials', label: 'Testimonials', icon: 'star', count: counts.testimonials }, { href: '/admin/blog', label: 'Blog', icon: 'message' }, { href: '/admin/careers', label: 'Careers', icon: 'graduation' }, { href: '/admin/cms', label: 'Website CMS', icon: 'grid', sub: ['hero', 'trust', 'services', 'stats', 'faq', 'footer'].map(s => ({ href: `/admin/cms#${s}`, label: { hero: 'Hero', trust: 'Trust Band', services: 'Services', stats: 'Statistics', faq: 'FAQ', footer: 'Footer' }[s]! })) }] },
    { g: 'System', items: [{ href: '/admin/settings', label: 'Settings', icon: 'settings' }] },
  ];
  const isActive = (i: Item) => i.href === '/admin' ? path === '/admin' : path.startsWith(i.href) || (i.sub?.some(s => path.startsWith(s.href.split('#')[0]) && s.href.split('#')[0] !== '/admin/jobs') ?? false) || (i.href === '/admin/jobs' && path.startsWith('/admin/categories'));
  const title = TITLES.find(([p]) => path.startsWith(p))?.[1] || 'Admin';
  const total = counts.applications + counts.employers + counts.vendors + counts.testimonials;

  return (
    <div className="admin-shell">
      <aside className={`a-side ${open ? 'is-open' : ''}`}>
        <Link className="brand" href="/admin"><LogoMark /><span>amani tech<small>Admin</small></span></Link>
        <nav className="a-nav" aria-label="Admin">
          {groups.map(g => <div key={g.g || 'top'}>{g.g && <div className="group">{g.g}</div>}{g.items.map(i => (
            <div key={i.href}>
              <Link href={i.href} className={isActive(i) ? 'is-active' : ''} onClick={() => setOpen(false)}><Icon name={i.icon} />{i.label}{i.count ? <span className="count">{i.count}</span> : null}</Link>
              {i.sub && isActive(i) && <div className="sub">{i.sub.map(s => <Link key={s.href} href={s.href} onClick={() => setOpen(false)}>{s.label}</Link>)}</div>}
            </div>
          ))}</div>)}
        </nav>
        <div className="foot"><div className="avatar">{admin.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'A'}</div><div><strong>{admin.name}</strong><small>{admin.email}</small></div><form action={adminSignOut}><button type="submit" aria-label="Sign out" style={{ background: 'none', border: 0, color: '#94A3B8', display: 'inline-flex', cursor: 'pointer' }}><Icon name="logout" /></button></form></div>
      </aside>
      <div className={`a-backdrop ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <div className="a-main">
        <header className="a-top">
          <button className="menu-btn" type="button" aria-label="Open navigation" onClick={() => setOpen(true)}><Icon name="menu" /></button>
          <h1>{title}</h1>
          <div className="search"><Icon name="search" /><input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search jobs, candidates, leads…" aria-label="Global search" onKeyDown={e => { if (e.key === 'Enter' && q.trim()) router.push(`/admin/jobs?q=${encodeURIComponent(q.trim())}`); }} /></div>
          <a className="btn btn-ghost btn-sm view-site" href="/" target="_blank"><Icon name="external" />View site</a>
          <button className="bell" type="button" aria-label="Notifications" onClick={() => toast(`${counts.applications} new applications · ${counts.employers} new employer leads · ${counts.testimonials} testimonials pending`)}><Icon name="alert" />{total > 0 && <span className="dot" />}</button>
        </header>
        <div className="a-content">{children}</div>
      </div>
    </div>
  );
}
