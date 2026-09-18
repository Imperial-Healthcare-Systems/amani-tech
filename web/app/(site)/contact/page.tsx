import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Reveal } from '@/components/motion';
import { ContactForm } from '@/components/forms/ContactForm';
import { getContent } from '@/lib/queries';
import type { FooterContent } from '@/lib/types';

export const metadata: Metadata = { title: 'Contact Amani Tech', description: 'Get in touch with Amani Tech — whether you are looking for a job, looking to hire, or have a question.', alternates: { canonical: '/contact' } };

export default async function ContactPage() {
  const { payload: c } = await getContent<FooterContent>('footer', { description: '', address: 'Hyderabad, India', phone: '+91 40 0000 0000', email: 'hello@amanitech.in', hours: 'Mon–Sat, 9:30 AM – 6:30 PM IST', social: { linkedin: '', instagram: '', x: '', youtube: '' } });
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">Contact</span></Enter><Enter delay={0.08}><h1>Get in touch</h1></Enter>
        <Enter delay={0.16}><p className="lead">Whether you are looking for a job, looking to hire, or just have a question, we are here.</p></Enter>
      </div></section>
      <section className="section"><div className="container form-layout">
        <Reveal><div className="aside-info">
          <div className="info-item"><div className="ico"><Icon name="pin" /></div><div><strong>Office</strong><p>{c.address}</p></div></div>
          <div className="info-item"><div className="ico"><Icon name="phone" /></div><div><strong>Phone</strong><p><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></p></div></div>
          <div className="info-item"><div className="ico"><Icon name="mail" /></div><div><strong>Email</strong><p><a href={`mailto:${c.email}`}>{c.email}</a><br /><a href="mailto:employers@amanitech.in">employers@amanitech.in</a><br /><a href="mailto:careers@amanitech.in">careers@amanitech.in</a></p></div></div>
          <div className="info-item"><div className="ico"><Icon name="clock" /></div><div><strong>Hours</strong><p>{c.hours}</p></div></div>
          <div className="card" style={{ padding: 16 }}><strong style={{ color: 'var(--navy-900)' }}>Quick paths</strong><div className="stack mt-8" style={{ gap: 8 }}>
            <Link className="link" href="/register">Job seekers → Register <Icon name="arrow" /></Link><Link className="link" href="/employers#request-talent">Employers → Request Talent <Icon name="arrow" /></Link><Link className="link" href="/vendor-registration">Partners → Become a partner <Icon name="arrow" /></Link>
          </div></div>
        </div></Reveal>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </div></section>
    </>
  );
}
