'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './Icon';
import { Counter } from './motion';
import s from './HeroBase.module.css';

/** The foot of the hero: proof, then a way in. Both sit outside the deck, so they stay put while
 *  the pictures and the headline change behind them. */
const STATS = [
  { to: 10000, suffix: '+', label: 'Talents placed' },
  { to: 450, suffix: '+', label: 'Global clients' },
  { to: 4, suffix: '', label: 'Continents' },
  { to: 98, suffix: '%', label: 'Client retention' },
];

const TYPES = ['Full-time', 'Contract', 'Part-time', 'Internship'];
const MODES = ['Any work mode', 'Remote', 'Hybrid', 'On-site'];

export function HeroBase() {
  const router = useRouter();
  const [tab, setTab] = useState<'jobs' | 'talent'>('jobs');
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [type, setType] = useState('');
  const [mode, setMode] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (tab === 'jobs') {
      if (q.trim()) p.set('q', q.trim());
      if (loc.trim()) p.set('location', loc.trim());
      if (type) p.set('type', type);
      router.push(`/jobs${p.toString() ? `?${p}` : ''}`);
    } else {
      if (q.trim()) p.set('role', q.trim());
      if (loc.trim()) p.set('location', loc.trim());
      if (mode) p.set('mode', mode);
      router.push(`/employers?${p}#request-talent`);
    }
  };

  return (
    <div className={s.base}>
      <dl className={s.stats}>
        {STATS.map(n => (
          <div key={n.label}>
            <dt><Counter value={n.to} suffix={n.suffix} /></dt>
            <dd>{n.label}</dd>
          </div>
        ))}
      </dl>

      <form className={s.tools} onSubmit={submit} role="search"
        aria-label={tab === 'jobs' ? 'Search jobs' : 'Tell us who you need to hire'}>
        <div className={s.tabs} role="tablist" aria-label="What are you here for?">
          {([['jobs', 'Find Jobs', 'briefcase'], ['talent', 'Hire Talent', 'users']] as const).map(([k, label, icon]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k}
              className={`${s.tab} ${tab === k ? s.isOn : ''}`} onClick={() => setTab(k)}>
              <Icon name={icon} />{label}
            </button>
          ))}
        </div>

        <div className={s.fields}>
          <label className={s.field}>
            <Icon name="search" />
            <span className="sr-only">{tab === 'jobs' ? 'Job title, skills or keywords' : 'Role you are hiring for'}</span>
            <input value={q} onChange={e => setQ(e.target.value)} autoComplete="off"
              placeholder={tab === 'jobs' ? 'Job title, skills or keywords' : 'Role you are hiring for'} />
          </label>

          <label className={s.field}>
            <Icon name="pin" />
            <span className="sr-only">Location</span>
            <input value={loc} onChange={e => setLoc(e.target.value)} autoComplete="off" placeholder="Location" />
          </label>

          <label className={`${s.field} ${s.select}`}>
            <Icon name={tab === 'jobs' ? 'briefcase' : 'layers'} />
            <span className="sr-only">{tab === 'jobs' ? 'Job type' : 'Work mode'}</span>
            {tab === 'jobs'
              ? <select value={type} onChange={e => setType(e.target.value)}><option value="">Job type</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
              : <select value={mode} onChange={e => setMode(e.target.value)}>{MODES.map(m => <option key={m} value={m === MODES[0] ? '' : m}>{m}</option>)}</select>}
            <Icon name="chevron" className={s.caret} />
          </label>

          <button className={s.go} type="submit">
            {tab === 'jobs' ? 'Search Jobs' : 'Request Talent'} <Icon name="arrow" />
          </button>
        </div>
      </form>
    </div>
  );
}
