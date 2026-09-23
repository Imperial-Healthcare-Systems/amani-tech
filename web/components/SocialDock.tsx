'use client';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import type { Social } from '@/lib/socials';
import s from './SocialDock.module.css';

/** Social links that follow the page: they appear once the reader is past the header and slide away
 *  again when the footer arrives, so they never cover either one. */
export function SocialDock({ links }: { links: Social[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('.site-footer');
    let footerShowing = false;

    const io = footer
      ? new IntersectionObserver(([e]) => { footerShowing = e.isIntersecting; update(); }, { threshold: 0 })
      : null;
    io?.observe(footer!);

    // Past the header band, before the footer.
    function update() {
      const header = document.querySelector('.site-header');
      const past = window.scrollY > (header?.getBoundingClientRect().height ?? 72) * 2.5;
      setVisible(past && !footerShowing);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { io?.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return (
    <div className={`${s.dock} ${visible ? s.isVisible : ''}`} aria-label="Amani Tech on social media" aria-hidden={!visible}>
      {links.map(n => n.href ? (
        <a key={n.name} className={s.item} href={n.href} target="_blank" rel="noopener noreferrer"
          aria-label={`Amani Tech on ${n.name}`} tabIndex={visible ? 0 : -1}>
          <Icon name={n.icon} />
        </a>
      ) : (
        <span key={n.name} className={`${s.item} ${s.soon}`} role="img" aria-label={`${n.name} — coming soon`} title={`${n.name} — coming soon`}>
          <Icon name={n.icon} />
        </span>
      ))}
    </div>
  );
}
