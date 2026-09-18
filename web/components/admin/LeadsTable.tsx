'use client';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { useToast } from '../Toast';
import { Drawer, EmptyRow, ExportButton, NotesPanel, PageHead, Search, Toolbar } from './shared';
import { addLeadNote, fileLink, setLeadStatus } from '@/lib/actions/admin';
import { fmtDateTime, label } from '@/lib/format';
import type { EmployerEnquiry, EnquiryStatus, ReviewStatus, VendorEnquiry } from '@/lib/types';

type Props = { kind: 'employer'; rows: EmployerEnquiry[] } | { kind: 'vendor'; rows: VendorEnquiry[] };
const EMP_STATUSES: EnquiryStatus[] = ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'CONVERTED', 'CLOSED'];
const VEN_STATUSES: ReviewStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

export function LeadsTable(props: Props) {
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter(); const toast = useToast(); const [, start] = useTransition();
  const table = props.kind === 'employer' ? 'employer_enquiries' : 'vendor_enquiries';
  const statuses = props.kind === 'employer' ? EMP_STATUSES : VEN_STATUSES;
  const hay = (r: EmployerEnquiry | VendorEnquiry) => 'company_name' in r ? [r.company_name, r.full_name, r.work_email, r.job_title, r.location, r.reference] : [r.company, r.contact_person, r.email, r.specialization, r.location];
  const rows = useMemo(() => (props.rows as (EmployerEnquiry | VendorEnquiry)[]).filter(r => (!q || hay(r).join(' ').toLowerCase().includes(q.toLowerCase())) && (!status || r.status === status)), [props.rows, q, status]);
  const open = (props.rows as (EmployerEnquiry | VendorEnquiry)[]).find(r => r.id === openId) || null;
  const change = (id: string, s: string) => start(async () => { await setLeadStatus(table, id, s as EnquiryStatus); toast(`Status updated to ${label(s).toLowerCase()}.`); router.refresh(); });
  const download = async (path: string | null, name: string) => { if (!path) return toast('No file attached.', 'error'); try { window.open(await fileLink('documents', path), '_blank'); } catch { toast(`Could not open ${name}.`, 'error'); } };

  return (
    <>
      <PageHead title={props.kind === 'employer' ? 'Employer enquiries' : 'Staffing partner applications'} text={props.kind === 'employer' ? 'Staffing requirements submitted through the website. Track each lead from New to Converted.' : 'Vendors and recruiters who applied to partner with Amani Tech. Approve, reject and keep notes.'} actions={<ExportButton entity={props.kind === 'employer' ? 'employers' : 'vendors'} />} />
      <Toolbar><Search value={q} onChange={setQ} placeholder={props.kind === 'employer' ? 'Search company, contact, email, position or location' : 'Search company, contact, specialisation or location'} /><select className="select" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{statuses.map(s => <option key={s} value={s}>{label(s)}</option>)}</select></Toolbar>
      <div className="a-table-wrap">
        <table className="a-table"><thead>{props.kind === 'employer' ? <tr><th>Company</th><th>Requirement</th><th>Location</th><th>Timeline</th><th>Received</th><th>Status</th><th></th></tr> : <tr><th>Company</th><th>Services</th><th>Specialisation</th><th>Location</th><th>Exp.</th><th>Received</th><th>Status</th><th></th></tr>}</thead><tbody>
          {rows.length ? rows.map(r => 'company_name' in r ? (
            <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setOpenId(r.id)}>
              <td><span className="primary">{r.company_name}</span><span className="sub">{r.full_name} · {r.designation}</span></td>
              <td>{r.job_title}<span className="sub">{r.positions} position{r.positions > 1 ? 's' : ''} · {r.requirement_type}</span></td>
              <td>{r.location}<span className="sub">{r.work_mode}</span></td><td>{r.joining_timeline}</td><td><span className="sub nowrap">{fmtDateTime(r.created_at)}</span></td><td><StatusBadge s={r.status} /></td>
              <td><div className="actions" onClick={e => e.stopPropagation()}><button className="icon-btn" type="button" aria-label="View" onClick={() => setOpenId(r.id)}><Icon name="eye" /></button><a className="icon-btn" href={`mailto:${r.work_email}`} aria-label="Email"><Icon name="mail" /></a></div></td>
            </tr>
          ) : (
            <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setOpenId(r.id)}>
              <td><span className="primary">{r.company}</span><span className="sub">{r.contact_person} · {r.email}</span></td>
              <td>{r.services.map(s => <span key={s} className="tag" style={{ marginRight: 4 }}>{s}</span>)}</td><td>{r.specialization}</td><td>{r.location}</td><td>{r.years_experience}</td><td><span className="sub nowrap">{fmtDateTime(r.created_at)}</span></td><td><StatusBadge s={r.status} /></td>
              <td><div className="actions" onClick={e => e.stopPropagation()}><button className="icon-btn" type="button" aria-label="View" onClick={() => setOpenId(r.id)}><Icon name="eye" /></button></div></td>
            </tr>
          )) : <EmptyRow cols={8} title="No records found" text="Try a different search or clear the filters." />}
        </tbody></table>
        <div className="a-table-foot"><span>{rows.length} of {props.rows.length}</span></div>
      </div>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open ? ('company_name' in open ? open.company_name : open.company) : ''} subtitle={open ? `${'reference' in open ? open.reference + ' · ' : ''}Received ${fmtDateTime(open.created_at)}` : ''}>
        {open && 'company_name' in open && (<>
          <dl className="kv">
            <div><dt>Contact</dt><dd>{open.full_name} · {open.designation}</dd></div><div><dt>Email</dt><dd><a href={`mailto:${open.work_email}`}>{open.work_email}</a></dd></div><div><dt>Phone</dt><dd>{open.phone}</dd></div><div><dt>Requirement type</dt><dd>{open.requirement_type}</dd></div>
            <div><dt>Position</dt><dd>{open.job_title} × {open.positions}</dd></div><div><dt>Location</dt><dd>{open.location} · {open.work_mode}</dd></div><div><dt>Experience</dt><dd>{open.experience_required}</dd></div><div><dt>Timeline</dt><dd>{open.joining_timeline}</dd></div>
          </dl>
          <h4>Job description</h4><p className="small" style={{ whiteSpace: 'pre-wrap' }}>{open.job_description}</p>
          {open.requirements && <><h4>Requirements</h4><p className="small" style={{ whiteSpace: 'pre-wrap' }}>{open.requirements}</p></>}
          {open.jd_path && <span className="file-chip"><Icon name="file" />Uploaded JD<button type="button" className="icon-btn" aria-label="Download" onClick={() => download(open.jd_path, 'JD')}><Icon name="download" /></button></span>}
        </>)}
        {open && !('company_name' in open) && (<>
          <dl className="kv">
            <div><dt>Contact person</dt><dd>{open.contact_person}</dd></div><div><dt>Email</dt><dd><a href={`mailto:${open.email}`}>{open.email}</a></dd></div><div><dt>Phone</dt><dd>{open.phone}</dd></div><div><dt>Location</dt><dd>{open.location}</dd></div>
            <div><dt>Services</dt><dd>{open.services.join(', ')}</dd></div><div><dt>Specialisation</dt><dd>{open.specialization}</dd></div><div><dt>Years of experience</dt><dd>{open.years_experience}</dd></div><div><dt>Website</dt><dd>{open.website ? <a href={open.website.startsWith('http') ? open.website : `https://${open.website}`} target="_blank" rel="noopener">{open.website}</a> : '—'}</dd></div>
          </dl>
          {open.additional_info && <><h4>Additional information</h4><p className="small" style={{ whiteSpace: 'pre-wrap' }}>{open.additional_info}</p></>}
          {open.document_path && <span className="file-chip"><Icon name="file" />Uploaded document<button type="button" className="icon-btn" aria-label="Download" onClick={() => download(open.document_path, 'document')}><Icon name="download" /></button></span>}
          {open.status === 'PENDING' && <div className="row mt-16" style={{ gap: 8 }}><button type="button" className="btn btn-primary btn-sm" onClick={() => change(open.id, 'APPROVED')}><Icon name="check" className="icon-sm" />Approve partner</button><button type="button" className="btn btn-outline btn-sm" onClick={() => change(open.id, 'REJECTED')}>Reject</button></div>}
        </>)}
        {open && (<>
          <h4>Status</h4><select className="select status-select" value={open.status} onChange={e => change(open.id, e.target.value)}>{statuses.map(s => <option key={s} value={s}>{label(s)}</option>)}</select>
          <NotesPanel notes={open.notes || []} onAdd={async t => { await addLeadNote(table, open.id, t); toast('Note added.'); router.refresh(); }} />
        </>)}
      </Drawer>
    </>
  );
}
