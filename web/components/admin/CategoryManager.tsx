'use client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Icon } from '../Icon';
import { useToast } from '../Toast';
import { PageHead, useConfirm } from './shared';
import { createCategory, createSubcategory, deleteCategory, deleteSubcategory, renameCategory, renameSubcategory, reorderCategories, toggleCategory } from '@/lib/actions/admin';
import type { Category } from '@/lib/types';

export function CategoryManager({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const [name, setName] = useState(''); const router = useRouter(); const toast = useToast(); const { confirm, el } = useConfirm(); const [pending, start] = useTransition();
  const run = (fn: () => Promise<unknown>, msg: string) => start(async () => { const r = (await fn()) as { ok?: boolean; error?: string } | undefined; if (r && r.ok === false) return toast(r.error || 'Something went wrong.', 'error'); toast(msg); router.refresh(); });
  const move = (i: number, dir: -1 | 1) => { const ids = categories.map(c => c.id); const j = i + dir; if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]]; run(() => reorderCategories(ids), 'Order updated.'); };

  return (
    <>
      {el}
      <PageHead title="Job categories" text="Categories and subcategories drive the job filters, category pages and application forms. Order here is the order shown on the site." />
      <div className="a-grid-2" style={{ gridTemplateColumns: '1fr', maxWidth: 900 }}>
        <form className="a-card" onSubmit={e => { e.preventDefault(); if (!name.trim()) return; run(() => createCategory(name), 'Category created.'); setName(''); }}>
          <h3>Add a category</h3><div className="row" style={{ gap: 8, flexWrap: 'nowrap' }}><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Category name, e.g. Healthcare" aria-label="New category name" /><button type="submit" className={`btn btn-primary ${pending ? 'is-loading' : ''}`}><span className="spinner" /><Icon name="plus" className="icon-sm" />Add</button></div>
        </form>
        <div className="a-card"><h3>Categories <span className="small muted" style={{ fontWeight: 400 }}>Use the arrows to reorder · toggle to activate/deactivate</span></h3>
          <ul className="sortable">{categories.map((c, i) => (
            <li key={c.id} className={c.is_active ? '' : 'is-inactive'}>
              <span className="handle"><Icon name="menu" /></span>
              <div style={{ flex: 1 }}>
                <div className="row between" style={{ gap: 8 }}><span className="name">{c.name}</span><span className="small muted">{counts[c.id] || 0} jobs · {c.subcategories.length} subcategories</span></div>
                <ul className="sub-list">
                  {c.subcategories.map(s => <li key={s.id}><span className="name">{s.name}</span><span className="small muted">{counts[s.id] || 0} jobs</span>
                    <button className="icon-btn" type="button" aria-label="Rename" onClick={() => { const n = prompt('Rename subcategory', s.name); if (n) run(() => renameSubcategory(s.id, n), 'Subcategory renamed.'); }}><Icon name="edit" /></button>
                    <button className="icon-btn danger" type="button" aria-label="Delete" onClick={async () => { if (await confirm({ title: 'Delete subcategory?', text: `“${s.name}” will be removed.`, ok: 'Delete', danger: true })) run(() => deleteSubcategory(s.id), 'Subcategory deleted.'); }}><Icon name="trash" /></button></li>)}
                  <li><button type="button" className="btn btn-ghost btn-sm" onClick={() => { const n = prompt('New subcategory name'); if (n) run(() => createSubcategory(c.id, n), 'Subcategory added.'); }}><Icon name="plus" className="icon-sm" />Add subcategory</button></li>
                </ul>
              </div>
              <div className="actions">
                <button className="icon-btn" type="button" disabled={i === 0} aria-label="Move up" onClick={() => move(i, -1)}><Icon name="chevron" /></button>
                <button className="icon-btn" type="button" disabled={i === categories.length - 1} aria-label="Move down" style={{ transform: 'rotate(180deg)' }} onClick={() => move(i, 1)}><Icon name="chevron" /></button>
                <label className="switch" title="Active"><input type="checkbox" checked={c.is_active} onChange={e => run(() => toggleCategory(c.id, e.target.checked), e.target.checked ? `${c.name} activated.` : `${c.name} deactivated — hidden from the site.`)} /><span className="track" /></label>
                <button className="icon-btn" type="button" aria-label="Rename" onClick={() => { const n = prompt('Rename category', c.name); if (n) run(() => renameCategory(c.id, n), 'Category renamed.'); }}><Icon name="edit" /></button>
                <button className="icon-btn danger" type="button" aria-label="Delete" onClick={async () => { if (await confirm({ title: 'Delete category?', text: `“${c.name}” and its subcategories will be removed.`, ok: 'Delete', danger: true })) run(() => deleteCategory(c.id), 'Category deleted.'); }}><Icon name="trash" /></button>
              </div>
            </li>
          ))}</ul>
        </div>
      </div>
    </>
  );
}
