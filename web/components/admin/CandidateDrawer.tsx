'use client';
import { useEffect, useState } from 'react';
import { Drawer } from './shared';
import { Icon } from '../Icon';
import { fileLink } from '@/lib/actions/admin';
import { initials } from '@/lib/format';
import type { Candidate } from '@/lib/types';

/** Read-only view of everything a candidate filled in on their profile settings page. */
export function CandidateDrawer({ c, onClose }: { c: Candidate | null; onClose: () => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => { setPhoto(null); if (c?.photo_path) fileLink('photos', c.photo_path).then(setPhoto).catch(() => setPhoto(null)); }, [c]);
  const edu = c?.education || [], work = c?.work_history || [], skills = c?.skills || [];
  return (
    <Drawer open={!!c} onClose={onClose} title={c?.name || ''} subtitle={c ? [c.current_title, c.location, c.experience].filter(Boolean).join(' · ') : ''}>
      {c && (
        <div className="stack" style={{ gap: 20 }}>
          <div className="row" style={{ gap: 14 }}>
            <div className="avatar">{photo ? <img src={photo} alt="" /> : initials(c.name)}</div>
            <div className="small"><div>{c.email}</div><div>{c.phone}</div>{c.linkedin_url && <a href={c.linkedin_url} target="_blank" rel="noopener">LinkedIn profile <Icon name="external" className="icon-sm" /></a>}</div>
          </div>
          <dl className="dl">
            <div><dt>Profile</dt><dd>{c.profile_type}{c.category?.name ? ` · ${c.category.name}` : ''}{c.subcategory?.name ? ` · ${c.subcategory.name}` : ''}</dd></div>
            <div><dt>Notice period</dt><dd>{c.notice_period || '—'}</dd></div>
            {c.summary && <div><dt>Summary</dt><dd style={{ fontWeight: 400, whiteSpace: 'pre-line' }}>{c.summary}</dd></div>}
            <div><dt>Skills</dt><dd className="skill-chips">{skills.length ? skills.map(s => <span key={s} className="tag">{s}</span>) : '—'}</dd></div>
            <div><dt>Education</dt><dd style={{ fontWeight: 400 }}>{edu.length ? <ul className="plain-list">{edu.map((e, i) => <li key={i}><b>{e.degree}</b> — {e.institution}{e.year ? `, ${e.year}` : ''}</li>)}</ul> : '—'}</dd></div>
            <div><dt>Work history</dt><dd style={{ fontWeight: 400 }}>{work.length ? <ul className="plain-list">{work.map((w, i) => <li key={i}><b>{w.title}</b> at {w.company}{w.from || w.to ? ` (${[w.from, w.to].filter(Boolean).join(' – ')})` : ''}{w.description && <div className="small muted" style={{ whiteSpace: 'pre-line' }}>{w.description}</div>}</li>)}</ul> : '—'}</dd></div>
          </dl>
        </div>
      )}
    </Drawer>
  );
}
