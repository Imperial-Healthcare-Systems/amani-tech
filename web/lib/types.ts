export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'ARCHIVED';
export type ApplicationStatus = 'SUBMITTED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'CLOSED';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'CONVERTED' | 'CLOSED';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'CLOSED';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';
export type EmploymentType = 'Full-time' | 'Contract' | 'Part-time' | 'Internship';

export interface Subcategory { id: string; category_id: string; name: string; slug: string; sort_order: number; is_active: boolean }
export interface Category { id: string; name: string; slug: string; sort_order: number; is_active: boolean; subcategories: Subcategory[] }

export interface Job {
  id: string; slug: string; title: string; company_name: string; company_logo: string | null; description: string;
  category_id: string | null; subcategory_id: string | null;
  location: string; work_mode: WorkMode; employment_type: EmploymentType;
  exp_min: number; exp_max: number; salary_min: number | null; salary_max: number | null;
  skills: string[]; qualification: string | null; responsibilities: string[]; requirements: string[]; benefits: string[];
  job_source: string | null; application_deadline: string | null; is_featured: boolean; status: JobStatus;
  published_at: string | null; created_at: string; updated_at: string;
  category?: { name: string; slug: string } | null; subcategory?: { name: string; slug: string } | null;
}

export type Education = { degree: string; institution: string; year: string };
export type WorkItem = { title: string; company: string; from: string; to: string; description: string };
export interface Candidate {
  id: string; user_id: string | null; name: string; email: string; phone: string; location: string;
  profile_type: 'IT' | 'Non-IT'; category_id: string | null; subcategory_id: string | null;
  experience: string | null; current_title: string | null; resume_path: string | null; resume_name: string | null;
  photo_path: string | null; summary: string | null; skills: string[]; education: Education[]; work_history: WorkItem[];
  linkedin_url: string | null; notice_period: string | null;
  created_at: string; updated_at: string;
  category?: { name: string } | null; subcategory?: { name: string } | null;
}

export interface Application {
  id: string; job_id: string; candidate_id: string; resume_path: string | null; resume_name: string | null;
  status: ApplicationStatus; internal_note: string | null; applied_at: string;
  job?: Pick<Job, 'id' | 'title' | 'company_name' | 'location' | 'slug'> | null;
  candidate?: Candidate | null;
}

export interface Note { by: string; at: string; text: string }

export interface EmployerEnquiry {
  id: string; reference: string; full_name: string; work_email: string; phone: string; company_name: string; designation: string;
  requirement_type: string; job_title: string; positions: number; location: string; work_mode: string; experience_required: string;
  joining_timeline: string; job_description: string; requirements: string | null; jd_path: string | null;
  status: EnquiryStatus; notes: Note[]; created_at: string;
}

export interface VendorEnquiry {
  id: string; company: string; contact_person: string; email: string; phone: string; location: string; services: string[];
  specialization: string; years_experience: string; website: string | null; additional_info: string | null; document_path: string | null;
  status: ReviewStatus; notes: Note[]; created_at: string;
}

export interface Testimonial {
  id: string; name: string; designation: string; company: string; photo_path: string | null; rating: number; review: string;
  status: ReviewStatus; is_featured: boolean; created_at: string;
}

export interface BlogPost {
  id: string; slug: string; title: string; excerpt: string; content: string; cover_image: string | null; author: string;
  category: 'Insights' | 'Career Advice' | 'Company News'; tags: string[]; seo_title: string | null; seo_description: string | null;
  read_minutes: number; is_featured: boolean; status: ContentStatus; published_at: string | null; created_at: string;
}

export interface CareerOpening {
  id: string; slug: string; position: string; department: string; location: string; work_mode: string; experience: string;
  description: string; responsibilities: string[]; requirements: string[]; benefits: string[]; application_instructions: string;
  status: ContentStatus; published_at: string | null; created_at: string;
}

export interface Service {
  id: string; slug: string; title: string; short_description: string; long_description: string; icon: string; image: string | null;
  roles: string[]; cta_text: string; sort_order: number; is_active: boolean;
}

export interface Faq { id: string; question: string; answer: string; group: string; sort_order: number; is_active: boolean }

export interface SiteContent<T = Record<string, unknown>> { key: string; payload: T; is_visible: boolean }

export interface HeroContent { eyebrow: string; heading: string; accent: string; subheading: string; primary_cta: string; secondary_cta: string; secondary_url: string; popular?: string[]; image?: string }
export interface TrustBandContent { heading: string; industries: string[]; logos: { url: string; alt: string }[] }
export interface StatisticsContent { items: { number: number; suffix: string; label: string }[] }
export interface EmployerCtaContent { heading: string; text: string; primary_cta: string; secondary_cta: string }
export interface FooterContent { description: string; address: string; phone: string; email: string; hours: string; social: { linkedin: string; instagram: string; x: string; youtube: string } }
export interface SettingsContent { site_name: string; seo_suffix: string; seo_description: string; employer_sla: string; notify_emails: string }

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string; fields?: Record<string, string> };
