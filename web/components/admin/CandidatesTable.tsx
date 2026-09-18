'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { useToast } from '../Toast';
import { EmptyRow, ExportButton, PageHead, Search, Toolbar } from './shared';
import { CandidateDrawer } from './CandidateDrawer';
import { fileLink } from '@/lib/actions/admin';
import { fmtDate } from '@/lib/format';
import type { Candidate, Category } from '@/lib/types';

type Row = Candidate & { applications: { count: number }[] };

export function CandidatesTable({ candidates, categories }: { candidates: Row[]; categories: Category[] }) {
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const toast = useToast();
  const [view, setView] = useState<Row | null>(null);
  const rows = useMemo(() => candidates.filter(c => (!q || [c.name, c.email, c.phone, c.current_title, c.location].join(' ').toLowerCase().includes(q.toLowerCase())) && (!cat || c.category_id === cat)), [candidates, q, cat]);
  const download = async (path: string | null) => { if (!path) return toast('No resume on file.', 'error'); try { window.open(await fileLink('resumes', path), '_blank'); } catch { toast('Could not create download link.', 'error'); } };
  return (
    <>
      <PageHead title="Candidates" text="Everyone who has registered or applied. One record per email address." actions={<ExportButton entity="candidates" />} />
      <Toolbar><Search value={q} onChange={setQ} placeholder="Search name, email, phone, title or location" /><select className="select" value={cat} onChange={e => setCat(e.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Toolbar>
      <div className="a-table-wrap">
        <table className="a-table"><thead><tr><th>Candidate</th><th>Phone</th><th>Location</th><th>Profile</th><th>Experience</th><th className="num">Apps</th><th>Registered</th><th></th></tr></thead><tbody>
          {rows.length ? rows.map(c => (
            <tr key={c.id}>
              <td><span className="primary">{c.name}</span><span className="sub">{c.email}</span></td><td>{c.phone}</td><td>{c.location}</td>
              <td>{c.profile_type}<span className="sub">{c.category?.name}{c.subcategory ? ` · ${c.subcategory.name}` : ''}</span></td>
              <td>{c.experience || '—'}<span className="sub">{c.current_title}</span></td><td className="num">{c.applications?.[0]?.count ?? 0}</td><td><span className="sub nowrap">{fmtDate(c.created_at)}</span></td>
              <td><div className="actions"><button className="icon-btn" type="button" aria-label="View profile" onClick={() => setView(c)}><Icon name="eye" /></button><Link className="icon-btn" href={`/admin/applications?q=${encodeURIComponent(c.email)}`} aria-label="View applications"><Icon name="file" /></Link><button className="icon-btn" type="button" aria-label="Download resume" onClick={() => download(c.resume_path)}><Icon name="download" /></button></div></td>
            </tr>
          )) : <EmptyRow cols={8} title="No candidates found" text="Try a different search." />}
        </tbody></table>
        <div className="a-table-foot"><span>{rows.length} candidates</span></div>
      </div>
      <CandidateDrawer c={view} onClose={() => setView(null)} />
    </>
  );
}
