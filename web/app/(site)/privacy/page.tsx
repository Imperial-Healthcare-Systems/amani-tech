import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Amani Tech collects, uses and protects your personal information.', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return (
    <div className="container legal">
      <span className="eyebrow">Legal</span>
      <h1 style={{ fontSize: 'var(--fs-4xl)' }}>Privacy Policy</h1>
      <p className="muted small">Last updated: 1 September 2026 · Draft text — to be reviewed by Amani Tech&apos;s legal advisor before publication.</p>
      <h2>1. What we collect</h2><p>When you register, apply for a job, submit a staffing requirement, apply as a partner, or write a review, we collect the information you provide: name, contact details, location, professional details, resume or documents you upload, and the content of your messages.</p>
      <h2>2. How we use it</h2><ul><li>To match candidates with job opportunities and contact them about relevant roles.</li><li>To respond to employer and partner enquiries.</li><li>To send transactional emails such as application confirmations.</li><li>To moderate and publish reviews you submit.</li><li>To improve the website and our services.</li></ul>
      <h2>3. Who we share it with</h2><p>Candidate resumes are shared only with employers for roles you apply to, or roles our recruiters discuss with you and you agree to be considered for. We do not sell personal information. We use service providers for hosting, email delivery and file storage under contractual confidentiality.</p>
      <h2>4. Retention</h2><p>Candidate profiles are retained while your account is active and for up to 24 months after your last activity, unless you ask us to delete them sooner. Employer and partner enquiries are retained for business record purposes.</p>
      <h2>5. Your rights</h2><p>You may request access to, correction of, or deletion of your personal information by emailing <a href="mailto:privacy@amanitech.in">privacy@amanitech.in</a>. We respond within 30 days.</p>
      <h2>6. Security</h2><p>We use encrypted connections, access controls and private file storage. Uploaded documents are never publicly accessible.</p>
      <h2>7. Contact</h2><p>Amani Tech, Hyderabad, India · <a href="mailto:privacy@amanitech.in">privacy@amanitech.in</a></p>
    </div>
  );
}
