'use client';
import { useMotionValue } from 'framer-motion';
import { useEffect, type RefObject } from 'react';

/** Progress of a pinned track through its scroll, 0 at pin to 1 at release, read from the live
 *  DOM rect on every scroll frame. framer's useScroll caches the target's position at mount, and
 *  the pinned sections above grow by screens once the desktop layout lands — the cached offsets
 *  then fire every animation early. A rect read cannot go stale. */
export function useTrackProgress(track: RefObject<HTMLElement | null>, on: boolean) {
  const progress = useMotionValue(0);
  useEffect(() => {
    if (!on) { progress.set(0); return; }
    const read = () => {
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      progress.set(denom > 0 ? Math.min(1, Math.max(0, -r.top / denom)) : 0);
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => { window.removeEventListener('scroll', read); window.removeEventListener('resize', read); };
  }, [on, track, progress]);
  return progress;
}
