import { CmsEditor } from '@/components/admin/CmsEditor';
import { createClient } from '@/lib/supabase/server';
import type { EmployerCtaContent, Faq, FooterContent, HeroContent, Service, StatisticsContent, TrustBandContent } from '@/lib/types';

export default async function CmsPage() {
  const sb = await createClient();
  const [{ data: content }, { data: services }, { data: faqs }] = await Promise.all([sb.from('site_content').select('*'), sb.from('services').select('*').order('sort_order'), sb.from('faqs').select('*').order('sort_order')]);
  const get = <T,>(key: string, fallback: T) => { const row = (content || []).find(c => c.key === key); return { payload: (row?.payload as T) || fallback, is_visible: row ? row.is_visible : true }; };
  return (
    <CmsEditor
      hero={get<HeroContent>('hero', { eyebrow: '', heading: '', accent: '', subheading: '', primary_cta: 'Search Jobs', secondary_cta: '', secondary_url: '/employers', popular: [] })}
      trust={get<TrustBandContent>('trust_band', { heading: 'Trusted by employers across industries', industries: [], logos: [] })}
      stats={get<StatisticsContent>('statistics', { items: [] })}
      cta={get<EmployerCtaContent>('employer_cta', { heading: '', text: '', primary_cta: 'Request Talent', secondary_cta: 'Become a staffing partner' })}
      footer={get<FooterContent>('footer', { description: '', address: '', phone: '', email: '', hours: '', social: { linkedin: '', instagram: '', x: '', youtube: '' } })}
      services={(services || []) as Service[]} faqs={(faqs || []) as Faq[]}
    />
  );
}
