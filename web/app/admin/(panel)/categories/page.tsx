import { CategoryManager } from '@/components/admin/CategoryManager';
import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/lib/types';

export default async function CategoriesPage() {
  const sb = await createClient();
  const [{ data: cats }, { data: jobs }] = await Promise.all([sb.from('categories').select('*, subcategories(*)').order('sort_order'), sb.from('jobs').select('category_id, subcategory_id')]);
  const counts: Record<string, number> = {};
  (jobs || []).forEach(j => { if (j.category_id) counts[j.category_id] = (counts[j.category_id] || 0) + 1; if (j.subcategory_id) counts[j.subcategory_id] = (counts[j.subcategory_id] || 0) + 1; });
  const categories = ((cats || []) as Category[]).map(c => ({ ...c, subcategories: [...(c.subcategories || [])].sort((a, b) => a.sort_order - b.sort_order) }));
  return <CategoryManager categories={categories} counts={counts} />;
}
