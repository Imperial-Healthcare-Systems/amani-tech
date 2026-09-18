'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { useToast } from '../Toast';
import { ActionMenu, EmptyRow, ExportButton, PageHead, Search, Toolbar, useConfirm } from './shared';
import { setJobStatus, toggleJobFeatured } from '@/lib/actions/admin';
import { fmtDate } from '@/lib/format';
import type { Category, Job, JobStatus } from '@/lib/types';

type Row = Job & { applications: { count: number }[] };

export function JobsTable({ jobs, categories, initialQuery }: { jobs: Row[]; categories: Category[]; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery); const [status, setStatus] = useState(''); const [cat, setCat] = useState('');
  const router = useRouter(); const toast = useToast(); const { confirm, el } = useConfirm(); const [, start] = useTransition();
  const rows = useMemo(() => jobs.filter(j => (!q || [j.title, j.company_name, j.location, j.id].join(' ').toLowerCase().includes(q.toLowerCase())) && (!status || j.status === status) && (!cat || j.category_id === cat)), [jobs, q, status, cat]);
  const act = (fn: () => Promise<void>, msg: string) => start(async () => { await fn(); toast(msg); router.refresh(); });

  return (
    <>
      {el}
      <PageHead title="All Jobs" text="Create, publish, pause, close and feature jobs. Only published jobs appear on the site." actions={<><ExportButton entity="jobs" /><Link className="btn btn-primary btn-sm" href="/admin/jobs/new"><Icon name="plus" className="icon-sm" />Create Job</Link></>} />
      <Toolbar>
        <Search value={q} onChange={setQ} placeholder="Search title, company, location or ID" />
        <select className="select" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{['DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED', 'ARCHIVED'].map(s => <option key={s}>{s}</option>)}</select>
        <select className="select" value={cat} onChange={e => setCat(e.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </Toolbar>
      <div className="a-table-wrap">
        <table className="a-table"><thead><tr><th>Job</th><th>Category</th><th>Location</th><th className="num">Apps</th><th>Featured</th><th>Status</th><th>Posted</th><th></th></tr></thead><tbody>
          {rows.length ? rows.map(j => (
            <tr key={j.id}>
              <td><Link className="primary" href={`/admin/jobs/${j.id}/edit`}>{j.title}</Link><span className="sub">{j.company_name}</span></td>
              <td>{j.category?.name || '—'}<span className="sub">{j.subcategory?.name}</span></td>
              <td>{j.location}<span className="sub">{j.work_mode}</span></td>
              <td className="num">{j.applications?.[0]?.count ?? 0}</td>
              <td>{j.is_featured ? <span className="badge badge-featured">Featured</span> : '—'}</td>
              <td><StatusBadge s={j.status} /></td>
              <td><span className="sub nowrap">{fmtDate(j.published_at || j.created_at)}</span></td>
              <td><div className="actions">
                <a className="icon-btn" href={`/jobs/${j.slug}`} target="_blank" aria-label="View"><Icon name="eye" /></a>
                <Link className="icon-btn" href={`/admin/jobs/${j.id}/edit`} aria-label="Edit"><Icon name="edit" /></Link>
                <ActionMenu items={[
                  ...(j.status !== 'PUBLISHED' ? [{ label: 'Publish', icon: 'check', onClick: () => act(() => setJobStatus(j.id, 'PUBLISHED'), 'Job published.') }] : [{ label: 'Unpublish', icon: 'eye', onClick: () => act(() => setJobStatus(j.id, 'DRAFT'), 'Job unpublished (saved as draft).') }]),
                  ...(j.status === 'PUBLISHED' ? [{ label: 'Pause', icon: 'clock', onClick: () => act(() => setJobStatus(j.id, 'PAUSED'), 'Job paused.') }] : []),
                  ...(j.status === 'PAUSED' ? [{ label: 'Resume', icon: 'zap', onClick: () => act(() => setJobStatus(j.id, 'PUBLISHED'), 'Job resumed.') }] : []),
                  ...(j.status !== 'CLOSED' ? [{ label: 'Close job', icon: 'x', onClick: async () => { if (await confirm({ title: 'Close this job?', text: 'Candidates will no longer be able to apply. You can reopen it later.', ok: 'Close job' })) act(() => setJobStatus(j.id, 'CLOSED' as JobStatus), 'Job closed.'); } }] : []),
                  { label: j.is_featured ? 'Remove from featured' : 'Feature job', icon: 'star', onClick: () => act(() => toggleJobFeatured(j.id, !j.is_featured), j.is_featured ? 'Removed from featured.' : 'Job featured on homepage.') },
                  { label: 'Delete', icon: 'trash', danger: true, onClick: async () => { if (await confirm({ title: 'Delete this job?', text: `“${j.title}” will be archived and removed from the site. Applications are kept.`, ok: 'Delete', danger: true })) act(() => setJobStatus(j.id, 'ARCHIVED'), 'Job archived.'); } },
                ]} />
              </div></td>
            </tr>
          )) : <EmptyRow cols={8} title="No jobs match" text="Try a different search or clear the filters." />}
        </tbody></table>
        <div className="a-table-foot"><span>{rows.length} of {jobs.length} jobs</span></div>
      </div>
    </>
  );
}
