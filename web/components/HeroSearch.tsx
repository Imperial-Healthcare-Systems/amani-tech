'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './Icon';

export function HeroSearch({ cta = 'Search Jobs', initialQ = '', initialLoc = '', onSearch }: { cta?: string; initialQ?: string; initialLoc?: string; onSearch?: (q: string, loc: string) => void }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [loc, setLoc] = useState(initialLoc);
  return (
    <form className="search-bar" role="search" aria-label="Job search" onSubmit={e => {
      e.preventDefault();
      if (onSearch) return onSearch(q.trim(), loc.trim());
      const p = new URLSearchParams(); if (q.trim()) p.set('q', q.trim()); if (loc.trim()) p.set('location', loc.trim());
      router.push(`/jobs${p.toString() ? `?${p}` : ''}`);
    }}>
      <label className="sfield"><Icon name="search" /><span className="sr-only">Keyword</span><input value={q} onChange={e => setQ(e.target.value)} type="text" placeholder="Job title, skill or company" autoComplete="off" /></label>
      <label className="sfield"><Icon name="pin" /><span className="sr-only">Location</span><input value={loc} onChange={e => setLoc(e.target.value)} type="text" placeholder="City or 'Remote'" autoComplete="off" /></label>
      <button className="btn btn-primary" type="submit">{cta}</button>
    </form>
  );
}
