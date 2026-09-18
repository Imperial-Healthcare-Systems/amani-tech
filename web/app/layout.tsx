import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { ToastProvider } from '@/components/Toast';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });

const APP = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP),
  title: { default: 'Amani Tech — Staffing & Recruitment for IT and Non-IT Roles', template: '%s | Amani Tech' },
  description: 'Find genuine job opportunities or hire screened talent. Amani Tech connects candidates and employers across IT and non-IT roles in India.',
  openGraph: { type: 'website', siteName: 'Amani Tech', images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
};

// All pages read from Supabase per request; nothing is pre-rendered at build time.
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
