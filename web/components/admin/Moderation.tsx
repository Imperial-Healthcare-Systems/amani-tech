'use client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Icon, Stars } from '../Icon';
import { StatusBadge } from '../cards';
import { useToast } from '../Toast';
import { PageHead, useConfirm } from './shared';
import { deleteTestimonial, moderateTestimonial } from '@/lib/actions/admin';
import { initials } from '@/lib/format';
import type { ReviewStatus, Testimonial } from '@/lib/types';

export function Moderation({ items }: { items: Testimonial[] }) {
  const [filter, setFilter] = useState<ReviewStatus | 'ALL'>('PENDING');
  const router = useRouter(); const toast = useToast(); const { confirm, el } = useConfirm(); const [, start] = useTransition();
  const rows = items.filter(t => filter === 'ALL' || t.status === filter);
  const act = (fn: () => Promise<void>, msg: string) => start(async () => { await fn(); toast(msg); router.refresh(); });
  return (
    <>
      {el}
      <PageHead title="Testimonial moderation" text="Only approved reviews appear on the site. Featured reviews also appear on the homepage." />
      <div className="blog-filters" role="group" aria-label="Filter">{(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(f => <button key={f} type="button" className={`chip ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>{f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}</button>)}</div>
      <div className="stack" style={{ gap: 12, maxWidth: 900 }}>
        {rows.length ? rows.map(t => (
          <div key={t.id} className="a-card">
            <div className="row between" style={{ marginBottom: 10 }}>
              <div className="row" style={{ gap: 10 }}><div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--navy-100)', color: 'var(--navy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{initials(t.name)}</div><div><strong style={{ fontSize: 14 }}>{t.name}</strong><div className="small muted">{t.designation} · {t.company}</div></div></div>
              <div className="row" style={{ gap: 8 }}><Stars n={t.rating} className="rating-sm" /><StatusBadge s={t.status} />{t.is_featured && <span className="badge badge-featured">Featured</span>}</div>
            </div>
            <p style={{ fontSize: 14, margin: '0 0 14px' }}>{t.review}</p>
            <div className="row" style={{ gap: 6 }}>
              {t.status !== 'APPROVED' && <button className="btn btn-primary btn-sm" onClick={() => act(() => moderateTestimonial(t.id, { status: 'APPROVED' }), 'Approved — now live on the site.')}><Icon name="check" className="icon-sm" />Approve</button>}
              {t.status !== 'REJECTED' && <button className="btn btn-outline btn-sm" onClick={() => act(() => moderateTestimonial(t.id, { status: 'REJECTED' }), 'Rejected.')}>Reject</button>}
              {t.status === 'APPROVED' && <button className="btn btn-ghost btn-sm" onClick={() => act(() => moderateTestimonial(t.id, { is_featured: !t.is_featured }), t.is_featured ? 'Removed from homepage.' : 'Now featured on the homepage.')}><Icon name="star" className="icon-sm" />{t.is_featured ? 'Unfeature' : 'Feature on homepage'}</button>}
              <button className="btn btn-ghost btn-sm" onClick={() => { const n = prompt('Edit review text', t.review); if (n && n.trim()) act(() => moderateTestimonial(t.id, { review: n.trim() }), 'Testimonial updated.'); }}>Edit</button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-600)' }} onClick={async () => { if (await confirm({ title: 'Delete this testimonial?', text: 'This cannot be undone.', ok: 'Delete', danger: true })) act(() => deleteTestimonial(t.id), 'Testimonial deleted.'); }}>Delete</button>
            </div>
          </div>
        )) : <div className="a-card"><div className="a-empty"><div className="ico"><Icon name="star" /></div><strong>Nothing here</strong>{filter === 'PENDING' ? 'No testimonials waiting for review.' : 'No testimonials with this status.'}</div></div>}
      </div>
    </>
  );
}
