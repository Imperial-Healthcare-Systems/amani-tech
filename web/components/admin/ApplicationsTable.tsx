'use client';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { useToast } from '../Toast';
import { Drawer, EmptyRow, ExportButton, PageHead, Search, Toolbar } from './shared';
import { fileLink, setApplicationNote, setApplicationStatus } from '@/lib/actions/admin';
import { fmtDateTime, salary } from '@/lib/format';
import type { Application, ApplicationStatus, Category, Job } from '@/lib/types';

const STATUSES: ApplicationStatus[] = ['SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'CLOSED'];

export function ApplicationsTable({ applications, jobs, categories, initialQuery }: { applications: Application[]; jobs: Pick<Job, 'id' | 'title'>[]; categories: Category[]; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery); const [status, setStatus] = useState(''); const [job, setJob] = useState(''); const [cat, setCat] = useState('');
  const [openId, setOpenId] = useState<string | null>(null); const [note, setNote] = useState('');
  const router = useRouter(); const toast = useToast(); const [, start] = useTransition();
  const rows = useMemo(() => applications.filter(a => { const c = a.candidate; return (!q || [c?.name, c?.email, c?.phone, c?.current_title, c?.location].join(' ').toLowerCase().includes(q.toLowerCase())) && (!status || a.status === status) && (!job || a.job_id === job) && (!cat || c?.category_id === cat); }), [applications, q, status, job, cat]);
  const open = applications.find(a => a.id === openId) || null;
  const download = async (bucket: 'resumes', path: string | null) => { if (!path) return toast('No file attached.', 'error'); try { const url = await fileLink(bucket, path); window.open(url, '_blank'); } catch { toast('Could not create download link.', 'error'); } };

  return (
    <>
      <PageHead title="Applications" text="Every job application with candidate details and resume. Click a row to review and update status." actions={<ExportButton entity="applications" />} />
      <Toolbar>
        <Search value={q} onChange={setQ} placeholder="Search name, email, phone, title or location" />
        <select className="select" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        <select className="select" value={job} onChange={e => setJob(e.target.value)} aria-label="Filter by job"><option value="">All jobs</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select>
        <select className="select" value={cat} onChange={e => setCat(e.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </Toolbar>
      <div className="a-table-wrap">
        <table className="a-table"><thead><tr><th>Candidate</th><th>Applied job</th><th>Category</th><th>Experience</th><th>Location</th><th>Applied</th><th>Status</th><th></th></tr></thead><tbody>
          {rows.length ? rows.map(a => (
            <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => { setOpenId(a.id); setNote(a.internal_note || ''); }}>
              <td><span className="primary">{a.candidate?.name}</span><span className="sub">{a.candidate?.email} · {a.candidate?.phone}</span></td>
              <td>{a.job?.title}<span className="sub">{a.job?.company_name}</span></td>
              <td>{a.candidate?.category?.name || '—'}<span className="sub">{a.candidate?.subcategory?.name}</span></td>
              <td>{a.candidate?.experience || '—'}<span className="sub">{a.candidate?.current_title}</span></td>
              <td>{a.candidate?.location}</td>
              <td><span className="sub nowrap">{fmtDateTime(a.applied_at)}</span></td>
              <td><StatusBadge s={a.status} /></td>
              <td><div className="actions" onClick={e => e.stopPropagation()}><button className="icon-btn" type="button" aria-label="View" onClick={() => { setOpenId(a.id); setNote(a.internal_note || ''); }}><Icon name="eye" /></button><button className="icon-btn" type="button" aria-label="Download resume" onClick={() => download('resumes', a.resume_path)}><Icon name="download" /></button></div></td>
            </tr>
          )) : <EmptyRow cols={8} title="No applications found" text="Try a different search or clear the filters." />}
        </tbody></table>
        <div className="a-table-foot"><span>{rows.length} of {applications.length} applications</span><span>Resumes open via time-limited signed links</span></div>
      </div>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open?.candidate?.name || ''} subtitle={open ? `Applied ${fmtDateTime(open.applied_at)}` : ''}
        foot={<><button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpenId(null)}>Close</button><button type="button" className="btn btn-primary btn-sm" onClick={() => open && start(async () => { await setApplicationNote(open.id, note); toast('Note saved.'); router.refresh(); })}>Save note</button></>}>
        {open && (<>
          <dl className="kv">
            <div><dt>Email</dt><dd><a href={`mailto:${open.candidate?.email}`}>{open.candidate?.email}</a></dd></div><div><dt>Phone</dt><dd><a href={`tel:${open.candidate?.phone}`}>{open.candidate?.phone}</a></dd></div>
            <div><dt>Location</dt><dd>{open.candidate?.location}</dd></div><div><dt>Profile type</dt><dd>{open.candidate?.profile_type}</dd></div>
            <div><dt>Category</dt><dd>{open.candidate?.category?.name || '—'}</dd></div><div><dt>Subcategory</dt><dd>{open.candidate?.subcategory?.name || '—'}</dd></div>
            <div><dt>Experience</dt><dd>{open.candidate?.experience || '—'}</dd></div><div><dt>Current / last title</dt><dd>{open.candidate?.current_title || '—'}</dd></div>
          </dl>
          <h4>Applied job</h4><div className="note"><strong>{open.job?.title}</strong> · {open.job?.company_name}<small>{open.job?.location}{open.job && ' · '}{open.job ? salary(open.job as unknown as Job) : ''}</small></div>
          <h4>Resume</h4><span className="file-chip"><Icon name="file" />{open.resume_name || open.candidate?.resume_name || 'Resume'}<button type="button" className="icon-btn" aria-label="Download resume" onClick={() => download('resumes', open.resume_path || open.candidate?.resume_path || null)}><Icon name="download" /></button></span>
          <h4>Status</h4><select className="select status-select" value={open.status} onChange={e => start(async () => { await setApplicationStatus(open.id, e.target.value as ApplicationStatus); toast(`Status updated to ${e.target.value.toLowerCase()}.`); router.refresh(); })}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
          <h4>Internal note</h4><textarea className="textarea" style={{ minHeight: 80 }} placeholder="Visible to admins only" value={note} onChange={e => setNote(e.target.value)} />
        </>)}
      </Drawer>
    </>
  );
}
