'use client';
import { useState } from 'react';
import { Field } from './form';
import type { Category } from '@/lib/types';

/** Category → subcategory cascade. Options come from the database, never hardcoded. */
export function CategorySelects({ categories, errors, onClear, defaultCategory = '', defaultSubcategory = '', ids = ['category_id', 'subcategory_id'] }: { categories: Category[]; errors: Record<string, string>; onClear?: (n: string) => void; defaultCategory?: string; defaultSubcategory?: string; ids?: [string, string] }) {
  const [cat, setCat] = useState(defaultCategory);
  const [sub, setSub] = useState(defaultSubcategory);
  const current = categories.find(c => c.id === cat);
  return (
    <>
      <Field label="Category" name={ids[0]} required error={errors[ids[0]]} onClear={onClear}>
        <select className="select" id={ids[0]} name={ids[0]} required value={cat} onChange={e => { setCat(e.target.value); setSub(''); }}>
          <option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Subcategory" name={ids[1]} required error={errors[ids[1]]} onClear={onClear}>
        <select className="select" id={ids[1]} name={ids[1]} required value={sub} disabled={!current} onChange={e => setSub(e.target.value)}>
          <option value="">Select subcategory</option>{current?.subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </Field>
    </>
  );
}
