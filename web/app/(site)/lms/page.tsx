import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Enter, Item, Reveal, Stagger } from '@/components/motion';
import { ContactForm } from '@/components/forms/ContactForm';
import { getContent } from '@/lib/queries';
import type { FooterContent } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Training & LMS Portal — Coming Soon',
  description: 'Amani Tech corporate training and upskilling tracks. The learning portal is on its way — register your interest and we will invite you first.',
  alternates: { canonical: '/lms' },
};

const TRACKS = [
  ['zap', 'AI & Automation', 'Practical AI for working professionals: tooling, prompting, automation and safe adoption inside a business.'],
  ['layers', 'Cloud & DevOps', 'Cloud fundamentals, CI/CD, containers and the deployment practices employers hire for.'],
  ['shield', 'Cybersecurity Essentials', 'Security hygiene, threat awareness and compliance basics for technology and non-technology teams.'],
  ['chart', 'Data & Analytics', 'From spreadsheets to pipelines and dashboards, taught on realistic business data.'],
  ['code', 'Software Engineering', 'Structured tracks for freshers and career switchers, aligned to live hiring demand.'],
  ['usercheck', 'Workplace Readiness', 'Communication, interviews and client-facing skills that decide who gets the offer.'],
];

const FOR = [
  ['building', 'For employers', 'Cohort-based upskilling for your existing teams, tailored to the stack and standards you actually use.'],
  ['user', 'For professionals', 'Evening and weekend tracks designed around a full-time job.'],
  ['graduation', 'For freshers', 'Role-ready training that leads into our hiring pipeline, not a certificate that sits unused.'],
];

const FALLBACK: FooterContent = { description: '', address: 'Hyderabad, India', phone: '+91 40 0000 0000', email: 'hello@amanitech.in', hours: 'Mon–Sat, 9:30 AM – 6:30 PM IST', social: { linkedin: '', instagram: '', x: '', facebook: '' } };

export default async function LmsPage() {
  const { payload: c } = await getContent<FooterContent>('footer', FALLBACK);
  return (
    <>
      <section className="page-hero dark"><div className="container">
        <Enter><span className="eyebrow">Training & LMS</span></Enter>
        <Enter delay={0.08}><div className="row" style={{ gap: 12, marginBottom: 12 }}><span className="badge badge-soon"><Icon name="clock" className="icon-sm" />Coming soon</span></div></Enter>
        <Enter delay={0.12}><h1>Our learning portal is being built</h1></Enter>
        <Enter delay={0.2}><p className="lead">Amani Tech is launching a corporate training and upskilling platform — specialised tracks, live cohorts and assessments, built around what employers are hiring for right now. Register your interest and you will hear from us before it opens.</p></Enter>
        <Enter delay={0.28}><div className="row"><Link className="btn btn-primary btn-lg" href="#register-interest">Register your interest</Link><a className="btn btn-outline-light btn-lg" href={`mailto:${c.email}`}>Email the training team</a></div></Enter>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Planned tracks</span><h2>What we are preparing</h2><p className="lead">Tracks are being finalised with the employers we hire for, so the content matches live job descriptions rather than a generic syllabus.</p></div></Reveal>
        <Stagger className="grid grid-3">{TRACKS.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>

      <section className="section section-alt"><div className="container">
        <Reveal><div className="section-head"><span className="eyebrow">Who it is for</span><h2>Three audiences, one portal</h2></div></Reveal>
        <Stagger className="grid grid-3">{FOR.map(([i, t, d]) => <Item key={t}><div className="value-card"><div className="ico"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p></div></Item>)}</Stagger>
      </div></section>

      <section className="section" id="register-interest"><div className="container form-layout">
        <Reveal><div className="aside-info">
          <h2>Talk to the training team</h2>
          <p className="muted">Tell us what you or your team need to learn. We will add you to the early-access list and get in touch when the first cohorts are scheduled.</p>
          <div className="info-item"><div className="ico"><Icon name="mail" /></div><div><strong>Email</strong><p><a href={`mailto:${c.email}`}>{c.email}</a></p></div></div>
          <div className="info-item"><div className="ico"><Icon name="phone" /></div><div><strong>Phone</strong><p><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></p></div></div>
          <div className="info-item"><div className="ico"><Icon name="pin" /></div><div><strong>Office</strong><p>{c.address}</p></div></div>
          <div className="info-item"><div className="ico"><Icon name="clock" /></div><div><strong>Hours</strong><p>{c.hours}</p></div></div>
        </div></Reveal>
        <Reveal delay={0.1}><ContactForm topic="Training / LMS" title="Register your interest" submitLabel="Register interest" audiences={['Employer — team training', 'Working professional', 'Fresher / student', 'Other']} messageLabel="What would you like to learn?" /></Reveal>
      </div></section>
    </>
  );
}
