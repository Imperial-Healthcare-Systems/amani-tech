import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion';
import { FaqList } from '@/components/cards';
import { getFaqs } from '@/lib/queries';

export const metadata: Metadata = { title: 'FAQs — Job Seekers, Employers and Partners', description: 'Answers to common questions about applying, hiring and partnering with Amani Tech.', alternates: { canonical: '/faqs' } };

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = [...new Set(faqs.map(f => f.group))];
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-hero"><div className="container"><span className="eyebrow">FAQs</span><h1>Questions people ask us</h1><p className="lead">Can&apos;t find your answer? <Link href="/contact">Contact us</Link> and we will reply within one business day.</p></div></section>
      <section className="section" style={{ paddingTop: 32 }}><div className="container" style={{ maxWidth: 840 }}>
        {groups.map(g => <Reveal key={g}><section className="faq-group"><h2>{g}</h2><FaqList items={faqs.filter(f => f.group === g)} /></section></Reveal>)}
      </div></section>
    </>
  );
}
