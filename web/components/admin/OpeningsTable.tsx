'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { useToast } from '../Toast';
import { ActionMenu, EmptyRow, PageHead, useConfirm } from './shared';
import { deleteOpening, setOpeningStatus } from '@/lib/actions/admin';
import { fmtDate } from '@/lib/format';
import type { CareerOpening } from '@/lib/types';

export function OpeningsTable({ openings }: { openings: CareerOpening[] }) {
  const router = useRouter(); const toast = useToast(); const { confirm, el } = useConfirm(); const [, start] = useTransition();
  const act = (fn: () => Promise<void>, msg: string) => start(async () => { await fn(); toast(msg); router.refresh(); });
  return (
    <>
      {el}
      <PageHead title="Career openings" text="Roles on the Amani Tech team, shown on the public Careers page. Separate from client jobs." actions={<Link className="btn btn-primary btn-sm" href="/admin/careers/new"><Icon name="plus" className="icon-sm" />New Opening</Link>} />
      <div className="a-table-wrap"><table className="a-table"><thead><tr><th>Position</th><th>Location</th><th>Experience</th><th>Posted</th><th>Status</th><th></th></tr></thead><tbody>
        {openings.length ? openings.map(c => (
          <tr key={c.id}>
            <td><Link className="primary" href={`/admin/careers/${c.id}/edit`}>{c.position}</Link><span className="sub">{c.department}</span></td><td>{c.location}<span className="sub">{c.work_mode}</span></td><td>{c.experience}</td><td><span className="sub nowrap">{fmtDate(c.published_at || c.created_at)}</span></td><td><StatusBadge s={c.status} /></td>
            <td><div className="actions"><a className="icon-btn" href={`/careers/${c.slug}`} target="_blank" aria-label="Preview"><Icon name="eye" /></a><Link className="icon-btn" href={`/admin/careers/${c.id}/edit`} aria-label="Edit"><Icon name="edit" /></Link>
              <ActionMenu items={[
                c.status === 'PUBLISHED' ? { label: 'Close opening', icon: 'x', onClick: () => act(() => setOpeningStatus(c.id, 'CLOSED'), 'Opening closed.') } : { label: 'Publish', icon: 'check', onClick: () => act(() => setOpeningStatus(c.id, 'PUBLISHED'), 'Opening published.') },
                { label: 'Delete', icon: 'trash', danger: true, onClick: async () => { if (await confirm({ title: 'Delete this opening?', text: `“${c.position}” will be permanently removed.`, ok: 'Delete', danger: true })) act(() => deleteOpening(c.id), 'Opening deleted.'); } },
              ]} /></div></td>
          </tr>
        )) : <EmptyRow cols={6} title="No openings yet" text="Create the first role on your team." />}
      </tbody></table></div>
    </>
  );
}
