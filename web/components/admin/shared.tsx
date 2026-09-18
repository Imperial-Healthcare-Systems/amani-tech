'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../Icon';
import { Confirm } from '../Modal';
import { fmtDateTime } from '@/lib/format';
import type { Note } from '@/lib/types';

/** Right-side drawer. */
export function Drawer({ open, onClose, title, subtitle, children, foot }: { open: boolean; onClose: () => void; title: ReactNode; subtitle?: ReactNode; children: ReactNode; foot?: ReactNode }) {
  useEffect(() => { document.body.classList.toggle('modal-open', open); return () => document.body.classList.remove('modal-open'); }, [open]);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, [open, onClose]);
  return (
    <AnimatePresence>{open && (
      <div className="drawer is-open">
        <motion.div className="backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.div className="panel" role="dialog" aria-label={typeof title === 'string' ? title : 'Details'} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }} style={{ animation: 'none' }}>
          <div className="panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button type="button" className="close-btn" aria-label="Close" onClick={onClose}><Icon name="x" /></button></div>
          <div className="panel-body">{children}</div>
          <div className="panel-foot">{foot ?? <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>}</div>
        </motion.div>
      </div>
    )}</AnimatePresence>
  );
}

/** Promise-style confirm: const ok = await confirm({...}) */
export function useConfirm() {
  const [state, setState] = useState<{ title: string; text: string; ok?: string; danger?: boolean; resolve: (v: boolean) => void } | null>(null);
  const confirm = (opts: { title: string; text: string; ok?: string; danger?: boolean }) => new Promise<boolean>(resolve => setState({ ...opts, resolve }));
  const el = <Confirm open={!!state} title={state?.title || ''} text={state?.text || ''} ok={state?.ok} danger={state?.danger} onCancel={() => { state?.resolve(false); setState(null); }} onConfirm={() => { state?.resolve(true); setState(null); }} />;
  return { confirm, el };
}

/** Row action menu (⋯). */
export function ActionMenu({ items }: { items: { label: string; icon?: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const h = () => setOpen(false); document.addEventListener('click', h); return () => document.removeEventListener('click', h); }, [open]);
  return (
    <div className={`menu ${open ? 'is-open' : ''}`}>
      <button className="icon-btn" type="button" aria-label="More actions" onClick={e => { e.stopPropagation(); setOpen(o => !o); }}><Icon name="sliders" /></button>
      <div className="menu-list">{items.map((i, k) => <button key={k} type="button" className={i.danger ? 'danger' : ''} onClick={() => { setOpen(false); i.onClick(); }}>{i.icon && <Icon name={i.icon} />}{i.label}</button>)}</div>
    </div>
  );
}

export function NotesPanel({ notes, onAdd }: { notes: Note[]; onAdd: (text: string) => Promise<void> }) {
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false);
  const add = async () => { if (!text.trim()) return; setBusy(true); await onAdd(text.trim()); setText(''); setBusy(false); };
  return (
    <>
      <h4>Internal notes</h4>
      {notes.length ? notes.map((n, i) => <div key={i} className="note">{n.text}<small>{n.by} · {fmtDateTime(n.at)}</small></div>) : <p className="small muted">No notes yet.</p>}
      <div className="row" style={{ gap: 8, flexWrap: 'nowrap', marginTop: 8 }}><input className="input" placeholder="Add a note…" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} /><button type="button" className={`btn btn-secondary btn-sm ${busy ? 'is-loading' : ''}`} onClick={add}><span className="spinner" />Add</button></div>
    </>
  );
}

export function TagInput({ name, initial = [], placeholder = 'Type and press Enter' }: { name: string; initial?: string[]; placeholder?: string }) {
  const [tags, setTags] = useState<string[]>(initial); const [v, setV] = useState('');
  const add = () => { const t = v.trim().replace(/,$/, ''); if (t && !tags.includes(t)) setTags([...tags, t]); setV(''); };
  return (
    <div className="tag-input">
      {tags.map(t => <span key={t} className="tag">{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter(x => x !== t))}><Icon name="x" className="icon-sm" /></button></span>)}
      <input value={v} placeholder={placeholder} aria-label={name} onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } if (e.key === 'Backspace' && !v) setTags(tags.slice(0, -1)); }} onBlur={add} />
      <input type="hidden" name={name} value={tags.join('|')} />
    </div>
  );
}

export function EmptyRow({ cols, title, text }: { cols: number; title: string; text: string }) {
  return <tr><td colSpan={cols}><div className="a-empty"><div className="ico"><Icon name="search" /></div><strong>{title}</strong>{text}</div></td></tr>;
}

export function Toolbar({ children }: { children: ReactNode }) { return <div className="a-toolbar">{children}</div>; }
export function Search({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return <div className="search"><Icon name="search" className="icon-sm" /><input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></div>;
}
export function ExportButton({ entity }: { entity: string }) { return <a className="btn btn-outline btn-sm" href={`/api/admin/export/${entity}`}><Icon name="download" className="icon-sm" />Export CSV</a>; }
export function PageHead({ title, text, actions }: { title: string; text?: string; actions?: ReactNode }) { return <div className="a-page-head"><div><h2>{title}</h2>{text && <p>{text}</p>}</div>{actions && <div className="actions">{actions}</div>}</div>; }
