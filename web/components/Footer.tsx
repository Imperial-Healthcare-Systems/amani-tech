import Link from 'next/link';
import { Icon, Logo } from './Icon';
import type { FooterContent } from '@/lib/types';

export function Footer({ content }: { content: FooterContent }) {
  const s = content.social || { linkedin: '', instagram: '', x: '', youtube: '' };
  const social = [['linkedin', s.linkedin, 'LinkedIn'], ['instagram', s.instagram, 'Instagram'], ['twitter', s.x, 'X'], ['youtube', s.youtube, 'YouTube']];
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
            <div className="social">{social.map(([icon, url, label]) => url ? <a key={icon} href={url} target="_blank" rel="noopener" aria-label={label}><Icon name={icon} /></a> : null)}</div>
          </div>
          <div><h4>For job seekers</h4><ul><li><Link href="/jobs">Find Jobs</Link></li><li><Link href="/#categories">Browse Categories</Link></li><li><Link href="/register">Register</Link></li><li><Link href="/login">Candidate Login</Link></li><li><Link href="/blog?category=career-advice">Career Advice</Link></li><li><Link href="/faqs">FAQs</Link></li></ul></div>
          <div><h4>For employers</h4><ul><li><Link href="/employers#request-talent">Request Talent</Link></li><li><Link href="/services">Staffing Services</Link></li><li><Link href="/vendor-registration">Become a Partner</Link></li><li><Link href="/contact">Contact Us</Link></li></ul></div>
          <div><h4>Company</h4><ul><li><Link href="/about">About Amani Tech</Link></li><li><Link href="/careers">Careers</Link></li><li><Link href="/blog">Blog</Link></li><li><Link href="/write-a-review">Write a Review</Link></li><li><Link href="/contact">Contact</Link></li></ul></div>
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
