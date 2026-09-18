import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/motion';
import { ReviewForm } from '@/components/forms/ReviewForm';

export const metadata: Metadata = { title: 'Write a Review', description: 'Share your experience with Amani Tech. Reviews are moderated before they appear on the site.', robots: { index: false, follow: true } };

export default function ReviewPage() {
  return (
    <section className="section" style={{ paddingTop: 48 }}><div className="container form-layout">
      <Reveal><div className="aside-info">
        <div><span className="eyebrow">Testimonials</span><h1 style={{ fontSize: 'var(--fs-4xl)' }}>Share your experience with Amani Tech</h1><p className="lead">Reviews are moderated before they appear on the site. We publish honest feedback — positive or otherwise — with your name, designation and company.</p></div>
        <div className="info-item"><div className="ico"><Icon name="eye" /></div><div><strong>Moderated, not edited</strong><p>We check reviews are genuine; we do not change what you say.</p></div></div>
        <div className="info-item"><div className="ico"><Icon name="clock" /></div><div><strong>Live within a few days</strong><p>Once approved, your review appears on the testimonials section.</p></div></div>
      </div></Reveal>
      <Reveal delay={0.1}><ReviewForm /></Reveal>
    </div></section>
  );
}
