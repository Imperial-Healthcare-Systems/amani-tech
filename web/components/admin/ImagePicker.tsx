'use client';
import { useState } from 'react';
import { Icon } from '../Icon';
import { useToast } from '../Toast';
import { uploadMedia } from '@/lib/actions/admin';

/** Upload to the public media bucket (or paste a URL). `shape="square"` previews as a small tile, for logos. */
export function ImagePicker({ value, onChange, prefix, label, hint, shape = 'wide' }: { value: string; onChange: (url: string) => void; prefix: string; label: string; hint?: string; shape?: 'wide' | 'square' }) {
  const toast = useToast(); const [busy, setBusy] = useState(false);
  const pick = async (f: File | undefined) => {
    if (!f) return; setBusy(true);
    const fd = new FormData(); fd.set('file', f); fd.set('prefix', prefix);
    const r = await uploadMedia(null, fd); setBusy(false);
    if (r.ok && r.data) { onChange(r.data.url); toast('Image uploaded.'); } else if (!r.ok) toast(r.error, 'error');
  };
  const preview = shape === 'square'
    ? { width: 72, height: 72, objectFit: 'contain' as const, borderRadius: 12, border: '1px solid var(--border)', background: '#fff', padding: 6, marginBottom: 8, display: 'block' }
    : { width: '100%', maxHeight: 160, objectFit: 'cover' as const, borderRadius: 8, marginBottom: 8 };
  return (
    <div className="field"><span className="label">{label}</span>
      {value && <img src={value} alt="" style={preview} />}
      <div className="row" style={{ gap: 8 }}>
        <label className={`btn btn-outline btn-sm ${busy ? 'is-loading' : ''}`}><span className="spinner" /><Icon name="upload" className="icon-sm" />{value ? 'Replace image' : 'Upload image'}<input type="file" accept=".jpg,.jpeg,.png,.webp,.svg" hidden onChange={e => pick(e.target.files?.[0])} /></label>
        {value && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>Remove</button>}
      </div>
      <input className="input mt-8" placeholder="…or paste an image URL" value={value} onChange={e => onChange(e.target.value)} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}
