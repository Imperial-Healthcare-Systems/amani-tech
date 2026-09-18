'use client';
import { useRef, useState } from 'react';
import { Icon } from './Icon';

const OK: Record<string, string[]> = { doc: ['pdf', 'doc', 'docx'], image: ['jpg', 'jpeg', 'png', 'webp', 'svg'] };

export function Upload({ name, kind = 'doc', maxMb = 5, required, label, hint, error, onClear }: { name: string; kind?: 'doc' | 'image'; maxMb?: number; required?: boolean; label: string; hint?: string; error?: string; onClear?: (n: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState('');
  const [drag, setDrag] = useState(false);
  const accept = OK[kind].map(e => '.' + e).join(',');

  const choose = (f: File | null | undefined) => {
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    if (!OK[kind].includes(ext)) { setLocalError(`Unsupported file type. Please upload ${OK[kind].map(x => x.toUpperCase()).join(', ')}.`); setFile(null); if (input.current) input.current.value = ''; return; }
    if (f.size > maxMb * 1024 * 1024) { setLocalError(`File is too large. Maximum size is ${maxMb} MB.`); setFile(null); if (input.current) input.current.value = ''; return; }
    setLocalError(''); setFile(f); onClear?.(name);
  };
  const remove = () => { setFile(null); if (input.current) input.current.value = ''; };
  const err = localError || error;

  return (
    <div className={`field ${err ? 'is-invalid' : ''}`}>
      <span className={`label ${required ? 'req' : ''}`}>{label}</span>
      <div className={`upload ${drag ? 'is-drag' : ''}`}
        onDragEnter={e => { e.preventDefault(); setDrag(true); }} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={e => { e.preventDefault(); setDrag(false); }}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f && input.current) { try { input.current.files = e.dataTransfer.files; } catch { /* older browsers */ } choose(f); } }}>
        <input ref={input} type="file" name={name} accept={accept} required={required} aria-label={label} onChange={e => choose(e.target.files?.[0])} />
        <Icon name="upload" />
        <strong>Click to upload</strong> or drag and drop
        <span className="hint">{hint || `${OK[kind].map(x => x.toUpperCase()).join(', ')} · up to ${maxMb} MB`}</span>
      </div>
      {file && (
        <div className="upload-file is-visible">
          <Icon name="file" /><span className="name">{file.name} · {(file.size / 1024).toFixed(0)} KB</span>
          <button type="button" className="remove" aria-label="Remove file" onClick={remove}><Icon name="x" className="icon-sm" /></button>
        </div>
      )}
      <span className="error-msg">{err}</span>
    </div>
  );
}
