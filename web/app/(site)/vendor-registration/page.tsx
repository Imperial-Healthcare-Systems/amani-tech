import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Enter, Reveal } from '@/components/motion';
import { VendorForm } from '@/components/forms/VendorForm';

export const metadata: Metadata = { title: 'Become a Staffing Partner', description: 'Amani Tech works with specialist staffing firms and independent recruiters. Apply to become a staffing partner.', alternates: { canonical: '/vendor-registration' } };

const WHO = [['code', 'Niche IT staffing firms', 'Deep benches in specific technologies.'], ['pin', 'Regional non-IT agencies', 'Strong local presence for plant, field and office roles.'], ['graduation', 'Campus recruitment partners', 'Access to graduating engineers and management talent.'], ['user', 'Independent recruiters', 'With a clear domain focus and track record.']];

export default function VendorPage() {
  return (
    <>
      <section className="page-hero"><div className="container">
        <Enter><span className="eyebrow">Staffing partners</span></Enter>
        <Enter delay={0.08}><h1>Become a Staffing Partner</h1></Enter>
        <Enter delay={0.16}><p className="lead">Amani Tech works with specialist staffing firms and independent recruiters to serve clients across regions and skills. If you have a strong candidate network, we would like to hear from you.</p></Enter>
      </div></section>
      <section className="section"><div className="container form-layout">
        <Reveal><div className="aside-info">
          <div><span className="eyebrow">Who we partner with</span><h2>Specialists with a real network</h2></div>
          {WHO.map(([i, t, d]) => <div key={t} className="info-item"><div className="ico"><Icon name={i} /></div><div><strong>{t}</strong><p>{d}</p></div></div>)}
          <div className="card" style={{ padding: 16 }}><strong style={{ color: 'var(--navy-900)' }}>What happens next</strong><ol className="small muted" style={{ margin: '8px 0 0', paddingLeft: 18 }}><li>We review your application within five business days.</li><li>A partnerships lead calls to discuss fit and terms.</li><li>We sign a partner agreement and share live requirements.</li></ol></div>
        </div></Reveal>
        <Reveal delay={0.1}><VendorForm /></Reveal>
      </div></section>
    </>
  );
}
