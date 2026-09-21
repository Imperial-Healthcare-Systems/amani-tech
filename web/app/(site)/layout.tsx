import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getContent } from '@/lib/queries';
import { getProfile } from '@/lib/auth';
import type { FooterContent } from '@/lib/types';

const FOOTER_FALLBACK: FooterContent = { description: 'Amani Tech helps job seekers find genuine opportunities and helps employers hire the right people — across IT and non-IT roles.', address: 'Hyderabad, India', phone: '+91 40 0000 0000', email: 'hello@amanitech.in', hours: 'Mon–Sat, 9:30 AM – 6:30 PM IST', social: { linkedin: '', instagram: '', x: '', youtube: '' } };

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, footer] = await Promise.all([getProfile(), getContent<FooterContent>('footer', FOOTER_FALLBACK)]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header user={profile?.role === 'CANDIDATE' ? { name: profile.name || profile.email } : null} />
      <main id="main" style={{ flex: 1 }}>{children}</main>
      <Footer content={footer.payload} />
    </div>
  );
}
