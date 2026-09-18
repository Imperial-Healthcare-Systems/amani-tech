import type { Job } from './types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
export const fmtDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${fmtDate(iso)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
export const daysAgo = (iso: string | null | undefined) => iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : 0;
export const timeAgo = (iso: string | null | undefined) => {
  const n = daysAgo(iso);
  return n <= 0 ? 'Today' : n === 1 ? 'Yesterday' : n < 7 ? `${n} days ago` : n < 30 ? `${Math.floor(n / 7)} wk ago` : fmtDate(iso);
};
export const salary = (j: Pick<Job, 'salary_min' | 'salary_max'>) => j.salary_min ? `₹${Number(j.salary_min)}–${Number(j.salary_max)} LPA` : 'Not disclosed';
export const expText = (j: Pick<Job, 'exp_min' | 'exp_max'>) => j.exp_max <= 1 ? 'Fresher – 1 yr' : `${j.exp_min}–${j.exp_max} yrs`;
export const initials = (n: string) => n.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
export const label = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ');
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const lines = (s: string | null | undefined) => (s || '').split('\n').map(x => x.trim()).filter(Boolean);
