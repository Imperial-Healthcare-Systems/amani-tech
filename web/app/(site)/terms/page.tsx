import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Use', description: 'Terms governing use of the Amani Tech website and services.', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return (
    <div className="container legal">
      <span className="eyebrow">Legal</span>
      <h1 style={{ fontSize: 'var(--fs-4xl)' }}>Terms of Use</h1>
      <p className="muted small">Last updated: 1 September 2026 · Draft text — to be reviewed by Amani Tech&apos;s legal advisor before publication.</p>
      <h2>1. Using this website</h2><p>By using amanitech.in you agree to these terms. The website provides information about Amani Tech&apos;s staffing services, a job board, and forms for candidates, employers and partners.</p>
      <h2>2. Job seekers</h2><ul><li>Amani Tech does not charge job seekers any fee for registration, applications or placements.</li><li>You must provide accurate information and upload only your own resume and documents.</li><li>Applying for a job does not guarantee an interview or offer. Decisions rest with the employer.</li></ul>
      <h2>3. Employers and partners</h2><p>Submitting a requirement or partner application is an enquiry, not a contract. Commercial terms are agreed separately in writing.</p>
      <h2>4. Reviews</h2><p>Reviews must be genuine and based on your own experience. Amani Tech moderates reviews and may decline to publish content that is abusive, defamatory or unrelated to our services.</p>
      <h2>5. Content and intellectual property</h2><p>Website content is owned by Amani Tech or its licensors and may not be copied for commercial use without permission.</p>
      <h2>6. Liability</h2><p>The website is provided as is. Amani Tech is not liable for indirect losses arising from use of the website, to the extent permitted by law.</p>
      <h2>7. Governing law</h2><p>These terms are governed by the laws of India. Courts in Hyderabad have exclusive jurisdiction.</p>
      <h2>8. Contact</h2><p><a href="mailto:hello@amanitech.in">hello@amanitech.in</a></p>
    </div>
  );
}
