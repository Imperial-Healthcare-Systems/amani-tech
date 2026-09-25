/** The one source of truth for the site's navigation: the desktop pill, the mobile drawer and
 *  the footer all read these four practices and the same labels. */
export type Entry = readonly [href: string, label: string, note?: string];
export type Column = { title: string; href?: string; items: readonly Entry[] };
export type NavItem =
  | { kind: 'link'; href: string; label: string }
  | { kind: 'menu'; key: string; label: string; href: string; match: readonly string[]; mega?: boolean; cols: readonly Column[] };

/** The four practices are the spine of the site: every menu, page and card uses these names. */
export const SERVICE_COLS: readonly Column[] = [
  { title: 'Technology Services', href: '/services/it-consulting', items: [
    ['/services/it-consulting#niches', 'Cloud Platforms', 'AWS, Azure and GCP'],
    ['/services/it-consulting#niches', 'Custom Web & App Development', 'Product engineering'],
    ['/services/it-consulting#niches', 'QA Automation', 'Playwright frameworks'],
    ['/services/it-consulting#niches', 'DevOps & CI/CD', 'Pipelines and release'],
    ['/services/it-consulting#niches', 'Cybersecurity & Data Protection', 'Audits and compliance'],
    ['/services/it-consulting#niches', 'Applied AI & Data Analytics', 'Insight and dashboards'],
  ] },
  { title: 'Talent Solutions', href: '/services/talent', items: [
    ['/services/talent#models', 'Permanent Recruitment', 'Full-time hiring'],
    ['/services/talent#models', 'Contract Staffing', 'Project-based teams'],
    ['/services/talent#models', 'Executive Search', 'Leadership roles'],
    ['/services/talent', 'IT & Non-IT Coverage', 'Every business function'],
  ] },
  { title: 'GCC Practice', href: '/gcc', items: [
    ['/gcc#scope', 'GCC Setup & Advisory', 'Incorporation to office'],
    ['/gcc#talent', 'GCC Talent & Staffing', 'Build the team'],
  ] },
  { title: 'Digital Transformation', href: '/services/transformation', items: [
    ['/services/transformation#ecosystem', 'Growth & Operations', 'CRM and pipeline automation'],
    ['/services/transformation#ecosystem', 'AI Process Automation', 'Replace manual work'],
    ['/lms', 'Training & LMS', 'Coming soon'],
  ] },
];

export const NAV: readonly NavItem[] = [
  { kind: 'menu', key: 'services', label: 'Services', href: '/services', match: ['/services', '/lms'], mega: true, cols: SERVICE_COLS },
  { kind: 'link', href: '/gcc', label: 'GCC Practice' },
  { kind: 'link', href: '/employers', label: 'Employers' },
  { kind: 'menu', key: 'candidates', label: 'Candidates', href: '/candidates', match: ['/candidates', '/jobs', '/register', '/login', '/candidate'], cols: [
    { title: 'For candidates', items: [
      ['/candidates', 'Candidate hub', 'Everything in one place'],
      ['/jobs', 'Browse opportunities', 'All live openings'],
      ['/register', 'Upload your resume', 'Create a free profile'],
      ['/candidate/dashboard', 'My dashboard', 'Track your placement'],
      ['/login', 'Sign in'],
    ] },
  ] },
  { kind: 'menu', key: 'about', label: 'About', href: '/about', match: ['/about', '/blog', '/faqs', '/careers', '/contact'], cols: [
    { title: 'Company', items: [
      ['/about', 'About Amani Tech', 'Hyderabad and Toronto'],
      ['/careers', 'Careers at Amani Tech', 'Join our own team'],
      ['/blog', 'Insights', 'Articles and career advice'],
      ['/faqs', 'FAQs'],
      ['/contact', 'Contact us'],
    ] },
  ] },
];
