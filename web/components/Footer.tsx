import Link from 'next/link';
import { Icon, Logo } from './Icon';
import { socials } from '@/lib/socials';
import type { FooterContent } from '@/lib/types';

export function Footer({ content }: { content: FooterContent }) {
  const links = socials(content.social);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo light />
            <p className="small mt-16" style={{ maxWidth: 320 }}>{content.description}</p>
            <div className="footer-contact">
              <div><Icon name="pin" /><span>{content.address}</span></div>
              <div><Icon name="phone" /><a href={`tel:${content.phone.replace(/\s/g, '')}`}>{content.phone}</a></div>
              <div><Icon name="mail" /><a href={`mailto:${content.email}`}>{content.email}</a></div>
              <div><Icon name="clock" /><span>{content.hours}</span></div>
            </div>
            <div className="social">{links.map(n => n.href
              ? <a key={n.name} href={n.href} target="_blank" rel="noopener noreferrer" aria-label={`Amani Tech on ${n.name}`}><Icon name={n.icon} /></a>
              : <span key={n.name} className="is-soon" role="img" aria-label={`${n.name} — coming soon`} title={`${n.name} — coming soon`}><Icon name={n.icon} /></span>)}</div>
          </div>
          <div><h4>Services</h4><ul><li><Link href="/services/it-consulting">Technology Services</Link></li><li><Link href="/services/talent">Talent Solutions</Link></li><li><Link href="/gcc">GCC Practice</Link></li><li><Link href="/services/transformation">Digital Transformation</Link></li><li><Link href="/lms">Training &amp; LMS</Link></li></ul></div>
          <div><h4>For employers</h4><ul><li><Link href="/employers#request-talent">Request Talent</Link></li><li><Link href="/employers">Engagement models</Link></li><li><Link href="/vendor-registration">Become a Partner</Link></li><li><Link href="/contact">Contact Us</Link></li></ul></div>
          <div><h4>For candidates</h4><ul><li><Link href="/candidates">Candidate hub</Link></li><li><Link href="/jobs">Browse opportunities</Link></li><li><Link href="/register">Upload your resume</Link></li><li><Link href="/login">Sign in</Link></li><li><Link href="/blog?category=career-advice">Career Advice</Link></li></ul></div>
          <div><h4>Company</h4><ul><li><Link href="/about">About Amani Tech</Link></li><li><Link href="/careers">Careers at Amani Tech</Link></li><li><Link href="/blog">Insights</Link></li><li><Link href="/faqs">FAQs</Link></li><li><Link href="/write-a-review">Write a Review</Link></li></ul></div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Amani Tech. All rights reserved.</span>
          <div className="row footer-legal"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link></div>
          <span className="built-by">Built by <a href="https://www.imperialtechinnovations.com/" target="_blank" rel="noopener">Imperial</a></span>
        </div>
      </div>
    </footer>
  );
}
