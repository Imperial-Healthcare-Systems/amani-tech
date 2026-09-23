import type { FooterContent } from './types';

/** The company's social profiles, in the order they appear in the footer and the floating dock.
 *  Each URL comes from the admin panel (Content → Footer); the LinkedIn page ships as the default.
 *  A network with no URL still shows its icon — it just does not link anywhere yet. */
export type SocialKey = 'linkedin' | 'instagram' | 'x' | 'facebook';
export type Social = { key: SocialKey; name: string; icon: string; href: string | null };

const NETWORKS: { key: SocialKey; name: string; icon: string; fallback: string }[] = [
  { key: 'linkedin', name: 'LinkedIn', icon: 'linkedin', fallback: 'https://www.linkedin.com/company/amani-tech-solutions/' },
  { key: 'instagram', name: 'Instagram', icon: 'instagram', fallback: '' },
  { key: 'x', name: 'X', icon: 'twitter', fallback: '' },
  { key: 'facebook', name: 'Facebook', icon: 'facebook', fallback: '' },
];

export function socials(from?: Partial<FooterContent['social']>): Social[] {
  return NETWORKS.map(n => {
    const url = (from?.[n.key] ?? '').trim() || n.fallback;
    return { key: n.key, name: n.name, icon: n.icon, href: url || null };
  });
}
