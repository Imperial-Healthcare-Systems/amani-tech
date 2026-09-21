'use client';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icon';
import { JobCard } from './JobCard';
import { HeroSearch } from './HeroSearch';
import { Empty } from './cards';
import { daysAgo } from '@/lib/format';
import type { Category, Job } from '@/lib/types';

/* ponytail: client-side filtering over all published jobs (instant, URL-synced). Move to SQL/RPC when jobs > ~1,000. */

const EXP_BANDS: [string, string, number, number][] = [['0-1', 'Fresher (0–1 yr)', 0, 1], ['1-3', '1–3 years', 1, 3], ['3-5', '3–5 years', 3, 5], ['5-8', '5–8 years', 5, 8], ['8+', '8+ years', 8, 99]];
const POSTED: [string, string][] = [['', 'Any time'], ['1', 'Last 24 hours'], ['3', 'Last 3 days'], ['7', 'Last 7 days'], ['30', 'Last 30 days']];
const MODES = ['On-site', 'Hybrid', 'Remote'], TYPES = ['Full-time', 'Contract', 'Part-time', 'Internship'];
const PER_PAGE = 8;

type State = { q: string; location: string; category: string[]; sub: string[]; loc: string[]; exp: string[]; salary: string; mode: string[]; type: string[]; posted: string; sort: string; page: number };
const EMPTY: State = { q: '', location: '', category: [], sub: [], loc: [], exp: [], salary: '', mode: [], type: [], posted: '', sort: 'relevance', page: 1 };
const LIST_KEYS = ['category', 'sub', 'loc', 'exp', 'mode', 'type'] as const;

export function JobsExplorer({ jobs, categories, locations, preset }: { jobs: Job[]; categories: Category[]; locations: string[]; preset?: { category?: string; sub?: string } }) {
  const router = useRouter(), pathname = usePathname(), sp = useSearchParams();
  const [state, setState] = useState<State>(() => {
    const s: State = { ...EMPTY, category: preset?.category ? [preset.category] : [], sub: preset?.sub ? [preset.sub] : [] };
    for (const k of Object.keys(EMPTY) as (keyof State)[]) { const v = sp.get(k); if (v == null) continue; if (k === 'page') s.page = +v || 1; else if ((LIST_KEYS as readonly string[]).includes(k)) (s[k] as string[]) = v.split(',').filter(Boolean); else (s[k] as string) = v; }
    return s;
  });
  const [railOpen, setRailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) { if (Array.isArray(v) ? v.length : v && !(k === 'sort' && v === 'relevance') && !(k === 'page' && v === 1)) p.set(k, Array.isArray(v) ? v.join(',') : String(v)); }
    if (preset?.category) p.delete('category'); if (preset?.sub) p.delete('sub');
    router.replace(`${pathname}${p.toString() ? `?${p}` : ''}`, { scroll: false });
    setLoading(true); const t = setTimeout(() => setLoading(false), 180); return () => clearTimeout(t);
  // Depend on the preset's values, not the object: category pages pass a new object each render, which re-ran this effect and kept the list on its loading skeleton.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, pathname, router, preset?.category, preset?.sub]);
  useEffect(() => { document.body.classList.toggle('modal-open', railOpen && window.innerWidth < 768); return () => document.body.classList.remove('modal-open'); }, [railOpen]);

  const set = (patch: Partial<State>) => setState(s => ({ ...s, ...patch, page: patch.page ?? 1 }));
  const toggle = (k: typeof LIST_KEYS[number], v: string) => setState(s => {
    const arr = s[k].includes(v) ? s[k].filter(x => x !== v) : [...s[k], v];
    if (k === 'category') { const c = categories.find(c => c.id === v); return { ...s, category: arr, sub: s.sub.filter(x => !c?.subcategories.some(sc => sc.id === x)), page: 1 }; }
    if (k === 'sub') { const parent = categories.find(c => c.subcategories.some(sc => sc.id === v)); return { ...s, sub: arr, category: s.category.filter(x => x !== parent?.id), page: 1 }; }
    return { ...s, [k]: arr, page: 1 };
  });
  const clearAll = () => setState({ ...EMPTY, category: preset?.category ? [preset.category] : [], sub: preset?.sub ? [preset.sub] : [] });

  const results = useMemo(() => {
    const q = state.q.toLowerCase(), l = state.location.toLowerCase();
    const out = jobs.filter(j => {
      const hay = [j.title, j.company_name, j.location, ...j.skills, j.category?.name, j.subcategory?.name].join(' ').toLowerCase();
      if (q && !q.split(/\s+/).every(w => hay.includes(w))) return false;
      if (l && !(j.location.toLowerCase().includes(l) || (l === 'remote' && j.work_mode === 'Remote'))) return false;
      if ((state.category.length || state.sub.length) && !(state.category.includes(j.category_id || '') || state.sub.includes(j.subcategory_id || ''))) return false;
      if (state.loc.length && !state.loc.includes(j.location)) return false;
      if (state.exp.length && !state.exp.some(b => { const band = EXP_BANDS.find(x => x[0] === b)!; return j.exp_min <= band[3] && j.exp_max >= band[2]; })) return false;
      if (state.salary && !(Number(j.salary_max) >= +state.salary)) return false;
      if (state.mode.length && !state.mode.includes(j.work_mode)) return false;
      if (state.type.length && !state.type.includes(j.employment_type)) return false;
      if (state.posted && daysAgo(j.published_at) > +state.posted) return false;
      return true;
    });
    const score = (j: Job) => (q ? (j.title.toLowerCase().includes(q) ? 3 : 0) + (j.skills.some(s => s.toLowerCase().includes(q)) ? 2 : 0) : 0) - daysAgo(j.published_at) / 100;
    const by: (a: Job, b: Job) => number =
      state.sort === 'newest' ? (a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
      : state.sort === 'salary' ? (a, b) => Number(b.salary_max || 0) - Number(a.salary_max || 0)
      : (a, b) => score(b) - score(a);
    // Featured jobs always form the first tier, whatever filters or sort are active; the chosen sort orders within each tier.
    out.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || by(a, b));
    return out;
  }, [jobs, state]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE)), page = Math.min(state.page, pages);
  const slice = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const count = (fn: (j: Job) => boolean) => jobs.filter(fn).length;
  const catName = (id: string) => categories.find(c => c.id === id)?.name || id;
  const subName = (id: string) => categories.flatMap(c => c.subcategories).find(s => s.id === id)?.name || id;

  const chips: [string, string, string][] = [];
  if (state.q) chips.push(['q', '', `“${state.q}”`]); if (state.location) chips.push(['location', '', state.location]);
  state.category.filter(c => c !== preset?.category).forEach(v => chips.push(['category', v, catName(v)])); state.sub.filter(s => s !== preset?.sub).forEach(v => chips.push(['sub', v, subName(v)]));
  state.loc.forEach(v => chips.push(['loc', v, v])); state.exp.forEach(v => chips.push(['exp', v, EXP_BANDS.find(x => x[0] === v)![1]]));
  if (state.salary) chips.push(['salary', '', `₹${state.salary} LPA+`]); state.mode.forEach(v => chips.push(['mode', v, v])); state.type.forEach(v => chips.push(['type', v, v]));
  if (state.posted) chips.push(['posted', '', POSTED.find(p => p[0] === state.posted)![1]]);
  const removeChip = (k: string, v: string) => { if ((LIST_KEYS as readonly string[]).includes(k)) toggle(k as typeof LIST_KEYS[number], v); else set({ [k]: '' } as Partial<State>); };

  const Check = ({ name, value, label, count, partial }: { name: typeof LIST_KEYS[number]; value: string; label: string; count?: number; partial?: boolean }) => (
    <label className="check"><input type="checkbox" checked={state[name].includes(value)} ref={el => { if (el) el.indeterminate = !!partial; }} onChange={() => toggle(name, value)} /><span>{label}</span>{count != null && <span className="count">{count}</span>}</label>
  );

  return (
    <>
      <section className="jobs-hero">
        <div className="container">
          <h1>Find your next role</h1>
          <p className="lead">Search open positions across IT and non-IT categories.</p>
          <HeroSearch cta="Search" initialQ={state.q} initialLoc={state.location} onSearch={(q, location) => set({ q, location })} />
        </div>
      </section>

      <div className="container jobs-layout">
        <aside className={`filter-rail ${railOpen ? 'is-open' : ''}`} aria-label="Filters" onClick={e => { if (e.target === e.currentTarget) setRailOpen(false); }}>
          <div className="filter-panel">
            <div className="fp-head"><h2>Filters</h2><div className="row" style={{ gap: 8 }}><button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>Clear all</button><button type="button" className="close-btn" aria-label="Close filters" onClick={() => setRailOpen(false)}><Icon name="x" /></button></div></div>
            <div className="fp-body">
              {!preset?.category && (
                <details className="filter-group" open><summary>Category <Icon name="chevron" /></summary><div className="fg-body">
                  {categories.map(c => (<div key={c.id}>
                    <Check name="category" value={c.id} label={c.name} count={count(j => j.category_id === c.id)} partial={!state.category.includes(c.id) && c.subcategories.some(s => state.sub.includes(s.id))} />
                    <div className="sub-list is-open">{c.subcategories.map(s => <Check key={s.id} name="sub" value={s.id} label={s.name} count={count(j => j.subcategory_id === s.id)} />)}</div>
                  </div>))}
                </div></details>
              )}
              <details className="filter-group" open><summary>Location <Icon name="chevron" /></summary><div className="fg-body">{locations.map(l => <Check key={l} name="loc" value={l} label={l} count={count(j => j.location === l)} />)}</div></details>
              <details className="filter-group" open><summary>Experience <Icon name="chevron" /></summary><div className="fg-body">{EXP_BANDS.map(b => <Check key={b[0]} name="exp" value={b[0]} label={b[1]} />)}</div></details>
              <details className="filter-group"><summary>Salary <Icon name="chevron" /></summary><div className="fg-body"><select className="select" aria-label="Minimum salary" value={state.salary} onChange={e => set({ salary: e.target.value })}><option value="">Any salary</option>{[3, 5, 8, 10, 15, 20, 25].map(v => <option key={v} value={v}>₹{v} LPA and above</option>)}</select></div></details>
              <details className="filter-group"><summary>Work mode <Icon name="chevron" /></summary><div className="fg-body">{MODES.map(m => <Check key={m} name="mode" value={m} label={m} count={count(j => j.work_mode === m)} />)}</div></details>
              <details className="filter-group"><summary>Employment type <Icon name="chevron" /></summary><div className="fg-body">{TYPES.map(m => <Check key={m} name="type" value={m} label={m} count={count(j => j.employment_type === m)} />)}</div></details>
              <details className="filter-group"><summary>Date posted <Icon name="chevron" /></summary><div className="fg-body">{POSTED.map(p => <label key={p[0]} className="check"><input type="radio" name="posted" checked={state.posted === p[0]} onChange={() => set({ posted: p[0] })} /><span>{p[1]}</span></label>)}</div></details>
            </div>
            <div className="fp-foot"><button type="button" className="btn btn-primary" onClick={() => setRailOpen(false)}>Show results</button></div>
          </div>
        </aside>

        <section aria-label="Job results">
          <div className="mobile-tools"><button type="button" className="btn btn-outline" onClick={() => setRailOpen(true)}><Icon name="sliders" />Filters{chips.length ? ` (${chips.length})` : ''}</button></div>
          <div className="results-head">
            <h2 aria-live="polite">{loading ? 'Searching…' : <><b>{results.length}</b> {results.length === 1 ? 'job' : 'jobs'} found{state.q && <> for <b>“{state.q}”</b></>}{state.location && <> in <b>{state.location}</b></>}</>}</h2>
            <div className="sort"><label htmlFor="sort">Sort by</label><select className="select" id="sort" value={state.sort} onChange={e => set({ sort: e.target.value })}><option value="relevance">Relevance</option><option value="newest">Newest</option><option value="salary">Salary: high to low</option></select></div>
          </div>
          {chips.length > 0 && (
            <div className="applied-chips">
              {chips.map(([k, v, l]) => <span key={k + v} className="chip">{l}<button type="button" className="chip-remove" aria-label={`Remove ${l}`} onClick={() => removeChip(k, v)}><Icon name="x" className="icon-sm" /></button></span>)}
              <button type="button" className="chip" onClick={clearAll}>Clear all</button>
            </div>
          )}
          <div className="job-grid list">
            {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton"><div className="sk h-20 w-60" /><div className="sk w-40" /><div className="sk w-80" /><div className="sk w-60" /></div>)
              : slice.length ? (
                <AnimatePresence mode="popLayout">
                  {slice.map((j, i) => <motion.div key={j.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}><JobCard job={j} /></motion.div>)}
                </AnimatePresence>
              ) : <Empty title="No jobs match your search" text="Try fewer filters, a broader location, or browse all categories." action={<button type="button" className="btn btn-secondary" onClick={clearAll}>Clear filters</button>} />}
          </div>
          {pages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button type="button" disabled={page === 1} onClick={() => set({ page: page - 1 })} aria-label="Previous page">‹</button>
              {Array.from({ length: pages }, (_, i) => <button key={i} type="button" aria-current={page === i + 1 ? 'page' : undefined} onClick={() => { set({ page: i + 1 }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{i + 1}</button>)}
              <button type="button" disabled={page === pages} onClick={() => set({ page: page + 1 })} aria-label="Next page">›</button>
            </nav>
          )}
        </section>
      </div>
    </>
  );
}
