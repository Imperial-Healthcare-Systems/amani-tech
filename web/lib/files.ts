import 'server-only';
import { adminClient } from './supabase/admin';

const DOC_TYPES: Record<string, string[]> = {
  pdf: ['application/pdf'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};
const IMG_TYPES: Record<string, string[]> = { jpg: ['image/jpeg'], jpeg: ['image/jpeg'], png: ['image/png'], webp: ['image/webp'] };
const MAX_MB = Number(process.env.MAX_UPLOAD_MB || 5);

/** Validates extension + MIME + size and uploads to a private/public bucket. Returns the storage key. Never trusts the client filename. */
export type Bucket = 'resumes' | 'documents' | 'media' | 'photos';
export async function storeFile(file: File | null, bucket: Bucket, prefix: string, kind: 'doc' | 'image' = 'doc', maxMb = MAX_MB): Promise<{ path: string; name: string } | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowed = kind === 'doc' ? DOC_TYPES : IMG_TYPES;
  if (!allowed[ext] || !allowed[ext].includes(file.type)) throw new Error(`Unsupported file type. Please upload ${Object.keys(allowed).map(x => x.toUpperCase()).join(', ')}.`);
  if (file.size > maxMb * 1024 * 1024) throw new Error(`File is too large. Maximum size is ${maxMb} MB.`);
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await adminClient().storage.from(bucket).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
  if (error) throw new Error('Upload failed. Please try again.');
  return { path, name: file.name.replace(/[^\w.\- ]+/g, '').slice(0, 120) };
}

export async function signedUrl(bucket: Exclude<Bucket, 'media'>, path: string, seconds = 300) {
  const { data, error } = await adminClient().storage.from(bucket).createSignedUrl(path, seconds);
  if (error || !data) throw new Error('Could not create download link.');
  return data.signedUrl;
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '﻿';
  const head = Object.keys(rows[0]);
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [head.join(','), ...rows.map(r => head.map(h => q(r[h])).join(','))].join('\n');
}
