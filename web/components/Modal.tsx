'use client';
import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icon';

export function Modal({ open, onClose, title, subtitle, children, size = 'md', labelledBy = 'modal-title' }: { open: boolean; onClose: () => void; title?: ReactNode; subtitle?: ReactNode; children: ReactNode; size?: 'sm' | 'md'; labelledBy?: string }) {
  useEffect(() => { document.body.classList.toggle('modal-open', open); return () => document.body.classList.remove('modal-open'); }, [open]);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="modal is-open" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
          <motion.div className="backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="dialog" style={size === 'sm' ? { width: 'min(440px,100%)' } : undefined} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}>
            {title && (
              <div className="dialog-head">
                <div><h2 id={labelledBy}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
                <button type="button" className="close-btn" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Confirm dialog used by admin tables. */
export function Confirm({ open, title, text, ok = 'Confirm', danger, onCancel, onConfirm }: { open: boolean; title: string; text: string; ok?: string; danger?: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal open={open} onClose={onCancel} size="sm" labelledBy="confirm-title">
      <div className="dialog-head"><div><h2 id="confirm-title" style={{ fontSize: '1.05rem' }}>{title}</h2></div></div>
      <div className="dialog-body"><p>{text}</p></div>
      <div className="dialog-foot row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <button type="button" className={`btn btn-sm ${danger ? 'btn-secondary' : 'btn-primary'}`} style={danger ? { background: 'var(--red-600)' } : undefined} onClick={onConfirm} autoFocus>{ok}</button>
      </div>
    </Modal>
  );
}
