'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../Icon';
import { useToast } from '../Toast';
import { PageHead } from './shared';
import { deleteService, saveContent, saveFaqs, saveServices, uploadMedia } from '@/lib/actions/admin';
import { slugify } from '@/lib/format';
import type { EmployerCtaContent, Faq, FooterContent, HeroContent, Service, StatisticsContent, TrustBandContent } from '@/lib/types';

type Sec<T> = { payload: T; is_visible: boolean };
const SECTIONS = [['hero', 'Hero'], ['trust', 'Trust Band'], ['services', 'Services'], ['stats', 'Statistics'], ['faq', 'FAQ'], ['cta', 'Employer CTA'], ['footer', 'Footer']] as const;

function ImagePicker({ value, onChange, prefix, label }: { value: string; onChange: (url: string) => void; prefix: string; label: string }) {
  const toast = useToast(); const [busy, setBusy] = useState(false);
  const pick = async (f: File | undefined) => { if (!f) return; setBusy(true); const fd = new FormData(); fd.set('file', f); fd.set('prefix', prefix); const r = await uploadMedia(null, fd); setBusy(false); if (r.ok && r.data) { onChange(r.data.url); toast('Image uploaded.'); } else if (!r.ok) toast(r.error, 'error'); };
  return (
    <div className="field"><span className="label">{label}</span>
      {value && <img src={value} alt="" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
      <div className="row" style={{ gap: 8 }}><label className={`btn btn-outline btn-sm ${busy ? 'is-loading' : ''}`}><span className="spinner" /><Icon name="upload" className="icon-sm" />{value ? 'Replace image' : 'Upload image'}<input type="file" accept=".jpg,.jpeg,.png,.webp,.svg" hidden onChange={e => pick(e.target.files?.[0])} /></label>{value && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>Remove</button>}</div>
      <input className="input mt-8" placeholder="…or paste an image URL" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export function CmsEditor(p: { hero: Sec<HeroContent>; trust: Sec<TrustBandContent>; stats: Sec<StatisticsContent>; cta: Sec<EmployerCtaContent>; footer: Sec<FooterContent>; services: Service[]; faqs: Faq[] }) {
  const [sec, setSec] = useState<string>('hero');
  useEffect(() => { const h = () => { const s = location.hash.slice(1); if (SECTIONS.some(x => x[0] === s)) setSec(s); }; h(); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h); }, []);
  const [hero, setHero] = useState(p.hero); const [trust, setTrust] = useState(p.trust); const [stats, setStats] = useState(p.stats); const [cta, setCta] = useState(p.cta); const [footer, setFooter] = useState(p.footer);
  const [services, setServices] = useState(p.services); const [faqs, setFaqs] = useState(p.faqs); const [deletedFaqs, setDeletedFaqs] = useState<string[]>([]);
  const [editing, setEditing] = useState<number | null>(null); const [dirty, setDirty] = useState(false);
  const router = useRouter(); const toast = useToast(); const [pending, start] = useTransition();
  const save = (fn: () => Promise<{ ok: boolean; error?: string }>, label: string) => start(async () => { const r = await fn(); if (!r.ok) return toast(r.error || 'Could not save.', 'error'); toast(`${label} saved and live.`); setDirty(false); router.refresh(); });
  const touch = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setDirty(true); };
  const H = touch(setHero), T = touch(setTrust), S = touch(setStats), C = touch(setCta), F = touch(setFooter), SV = touch(setServices), FQ = touch(setFaqs);
  const Save = ({ onClick, label }: { onClick: () => void; label: string }) => <button type="button" className={`btn btn-primary ${pending ? 'is-loading' : ''}`} disabled={pending} onClick={onClick}><span className="spinner" />Save {label}</button>;
  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => <div className="field"><label className="switch"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} /><span className="track" />{label}</label></div>;

  return (
    <>
      <PageHead title="Homepage & site content" text="Edit what visitors see. Featured jobs and testimonials are populated automatically from Jobs and Testimonials." actions={<>{dirty && <span className="unsaved is-visible"><Icon name="alert" className="icon-sm" />Unsaved changes</span>}<a className="btn btn-ghost btn-sm" href="/" target="_blank"><Icon name="external" className="icon-sm" />View homepage</a></>} />
      <div className="blog-filters" role="tablist" aria-label="Sections">{SECTIONS.map(([k, l]) => <button key={k} type="button" className={`chip ${sec === k ? 'is-active' : ''}`} role="tab" aria-selected={sec === k} onClick={() => { setSec(k); history.replaceState(null, '', `#${k}`); }}>{l}</button>)}</div>

      {sec === 'hero' && <div className="a-form-layout">
        <div className="a-card"><h3>Hero section</h3>
          <div className="field"><label htmlFor="h-eyebrow">Eyebrow</label><input className="input" id="h-eyebrow" value={hero.payload.eyebrow} onChange={e => H({ ...hero, payload: { ...hero.payload, eyebrow: e.target.value } })} /></div>
          <div className="field"><label htmlFor="h-heading">Heading</label><input className="input" id="h-heading" value={hero.payload.heading} onChange={e => H({ ...hero, payload: { ...hero.payload, heading: e.target.value } })} /><span className="hint">The part below is highlighted in green.</span></div>
          <div className="field"><label htmlFor="h-accent">Highlighted words (must be the end of the heading)</label><input className="input" id="h-accent" value={hero.payload.accent} onChange={e => H({ ...hero, payload: { ...hero.payload, accent: e.target.value } })} /></div>
          <div className="field"><label htmlFor="h-sub">Subheading</label><textarea className="textarea" id="h-sub" style={{ minHeight: 90 }} value={hero.payload.subheading} onChange={e => H({ ...hero, payload: { ...hero.payload, subheading: e.target.value } })} /></div>
          <div className="form-grid">
            <div className="field"><label htmlFor="h-cta">Primary CTA text</label><input className="input" id="h-cta" value={hero.payload.primary_cta} onChange={e => H({ ...hero, payload: { ...hero.payload, primary_cta: e.target.value } })} /></div>
            <div className="field"><label htmlFor="h-cta2">Secondary CTA text</label><input className="input" id="h-cta2" value={hero.payload.secondary_cta} onChange={e => H({ ...hero, payload: { ...hero.payload, secondary_cta: e.target.value } })} /></div>
            <div className="field span-2"><label htmlFor="h-cta2u">Secondary CTA URL</label><input className="input" id="h-cta2u" value={hero.payload.secondary_url} onChange={e => H({ ...hero, payload: { ...hero.payload, secondary_url: e.target.value } })} /></div>
          </div>
          <div className="field"><label htmlFor="h-pop">Popular searches (comma separated)</label><input className="input" id="h-pop" value={hero.payload.popular.join(', ')} onChange={e => H({ ...hero, payload: { ...hero.payload, popular: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })} /></div>
          <ImagePicker label="Hero image (behind the floating cards)" prefix="hero" value={hero.payload.image || ''} onChange={url => H({ ...hero, payload: { ...hero.payload, image: url } })} />
          <Save label="hero" onClick={() => save(() => saveContent('hero', hero.payload as unknown as Record<string, unknown>, true), 'Hero')} />
        </div>
        <div className="a-card a-sticky"><h3>Live preview</h3><div className="preview-box" style={{ background: '#fff' }}><span className="eyebrow" style={{ fontSize: 11 }}>{hero.payload.eyebrow}</span><div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--navy-900)', lineHeight: 1.2, margin: '6px 0' }}>{hero.payload.heading}</div><p style={{ fontSize: 12, margin: '0 0 10px' }}>{hero.payload.subheading}</p><span className="btn btn-primary btn-sm">{hero.payload.primary_cta}</span></div></div>
      </div>}

      {sec === 'trust' && <div className="a-form-layout">
        <div className="a-card"><h3>Trust band</h3>
          <div className="field"><label htmlFor="t-heading">Heading</label><input className="input" id="t-heading" value={trust.payload.heading} onChange={e => T({ ...trust, payload: { ...trust.payload, heading: e.target.value } })} /></div>
          <Toggle checked={trust.is_visible} onChange={v => T({ ...trust, is_visible: v })} label="Show trust band on homepage" />
          <div className="field"><label htmlFor="t-ind">Industries (shown until logos are added — comma separated)</label><input className="input" id="t-ind" value={trust.payload.industries.join(', ')} onChange={e => T({ ...trust, payload: { ...trust.payload, industries: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })} /></div>
          <div className="field"><span className="label">Client logos</span><span className="hint" style={{ marginBottom: 8 }}>Only upload logos with written client approval.</span>
            <ul className="sortable">{trust.payload.logos.map((l, i) => <li key={i}><img src={l.url} alt={l.alt} style={{ height: 24, width: 'auto' }} /><input className="input" style={{ flex: 1, minHeight: 36 }} value={l.alt} placeholder="Company name" onChange={e => T({ ...trust, payload: { ...trust.payload, logos: trust.payload.logos.map((x, k) => k === i ? { ...x, alt: e.target.value } : x) } })} /><button className="icon-btn danger" type="button" aria-label="Remove" onClick={() => T({ ...trust, payload: { ...trust.payload, logos: trust.payload.logos.filter((_, k) => k !== i) } })}><Icon name="x" /></button></li>)}</ul>
          </div>
          <ImagePicker label="Add logo" prefix="logos" value="" onChange={url => url && T({ ...trust, payload: { ...trust.payload, logos: [...trust.payload.logos, { url, alt: 'Client' }] } })} />
          <Save label="trust band" onClick={() => save(() => saveContent('trust_band', trust.payload as unknown as Record<string, unknown>, trust.is_visible), 'Trust band')} />
        </div>
        <div className="preview-box a-sticky">The trust band sits directly under the hero. Logos are displayed in greyscale and scroll slowly; hovering pauses them.</div>
      </div>}

      {sec === 'services' && <div className="a-form-layout">
        <div className="stack" style={{ gap: 16 }}>
          <div className="a-card"><h3>Services <span className="small muted" style={{ fontWeight: 400 }}>Order and visibility</span></h3>
            <ul className="sortable">{services.map((s, i) => <li key={s.id || s.slug} className={s.is_active ? '' : 'is-inactive'}><span className="handle"><Icon name="menu" /></span><span className="name">{s.title}</span>
              <button className="icon-btn" type="button" disabled={i === 0} aria-label="Move up" onClick={() => { const a = [...services]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; SV(a.map((x, k) => ({ ...x, sort_order: k + 1 }))); }}><Icon name="chevron" /></button>
              <button className="icon-btn" type="button" disabled={i === services.length - 1} aria-label="Move down" style={{ transform: 'rotate(180deg)' }} onClick={() => { const a = [...services]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; SV(a.map((x, k) => ({ ...x, sort_order: k + 1 }))); }}><Icon name="chevron" /></button>
              <label className="switch"><input type="checkbox" checked={s.is_active} onChange={e => SV(services.map((x, k) => k === i ? { ...x, is_active: e.target.checked } : x))} /><span className="track" /></label>
              <button className="icon-btn" type="button" aria-label="Edit" onClick={() => setEditing(i)}><Icon name="edit" /></button>
              {s.id && <button className="icon-btn danger" type="button" aria-label="Hide" onClick={() => start(async () => { await deleteService(s.id); toast('Service hidden.'); router.refresh(); })}><Icon name="trash" /></button>}
            </li>)}</ul>
            <div className="row mt-16" style={{ gap: 8 }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => { SV([...services, { id: '', slug: `new-service-${services.length + 1}`, title: 'New service', short_description: '', long_description: '', icon: 'briefcase', image: null, roles: [], cta_text: 'Learn more', sort_order: services.length + 1, is_active: true }]); setEditing(services.length); }}><Icon name="plus" className="icon-sm" />Add service</button><Save label="services" onClick={() => save(() => saveServices(services.map(s => ({ id: s.id || undefined, slug: s.slug, title: s.title, short_description: s.short_description, long_description: s.long_description, icon: s.icon, image: s.image, roles: s.roles, sort_order: s.sort_order, is_active: s.is_active }))), 'Services')} /></div>
          </div>
          {editing != null && services[editing] && (() => { const s = services[editing]; const set = (patch: Partial<Service>) => SV(services.map((x, k) => k === editing ? { ...x, ...patch } : x)); return (
            <div className="a-card"><h3>Edit service</h3>
              <div className="form-grid">
                <div className="field"><label>Title</label><input className="input" value={s.title} onChange={e => set({ title: e.target.value, slug: s.id ? s.slug : slugify(e.target.value) })} /></div>
                <div className="field"><label>URL slug</label><input className="input" value={s.slug} onChange={e => set({ slug: slugify(e.target.value) })} /></div>
              </div>
              <div className="field"><label>Short description (card)</label><textarea className="textarea" style={{ minHeight: 70 }} value={s.short_description} onChange={e => set({ short_description: e.target.value })} /></div>
              <div className="field"><label>Full description (detail page)</label><textarea className="textarea" value={s.long_description} onChange={e => set({ long_description: e.target.value })} /></div>
              <div className="form-grid">
                <div className="field"><label>Icon</label><select className="select" value={s.icon} onChange={e => set({ icon: e.target.value })}>{['code', 'briefcase', 'clock', 'usercheck', 'users', 'graduation', 'layers', 'shield', 'trend', 'globe', 'settings'].map(i => <option key={i}>{i}</option>)}</select></div>
                <div className="field"><label>Roles we fill (comma separated)</label><input className="input" value={s.roles.join(', ')} onChange={e => set({ roles: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} /></div>
              </div>
              <ImagePicker label="Card image" prefix="services" value={s.image || ''} onChange={url => set({ image: url || null })} />
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>Done</button>
            </div>); })()}
        </div>
        <div className="preview-box a-sticky">Services appear on the homepage, the Services page and the Employers page. Toggling one off hides it everywhere. Remember to press <strong>Save services</strong>.</div>
      </div>}

      {sec === 'stats' && <div className="a-form-layout">
        <div className="a-card"><h3>Statistics</h3>
          <div className="form-status is-visible" style={{ background: 'var(--amber-50)', color: '#92400E', border: '1px solid #FCD98D' }}><Icon name="alert" /><span>Only publish figures Amani Tech can verify. If a number cannot be confirmed, turn the section off — it is better to show nothing than an unverifiable claim.</span></div>
          <Toggle checked={stats.is_visible} onChange={v => S({ ...stats, is_visible: v })} label="Show statistics on homepage" />
          <ul className="sortable">{stats.payload.items.map((it, i) => <li key={i}><input className="input" style={{ width: 100, minHeight: 36 }} type="number" value={it.number} aria-label="Number" onChange={e => S({ ...stats, payload: { items: stats.payload.items.map((x, k) => k === i ? { ...x, number: +e.target.value } : x) } })} /><input className="input" style={{ width: 60, minHeight: 36 }} value={it.suffix} aria-label="Suffix" placeholder="+" onChange={e => S({ ...stats, payload: { items: stats.payload.items.map((x, k) => k === i ? { ...x, suffix: e.target.value } : x) } })} /><input className="input" style={{ flex: 1, minHeight: 36 }} value={it.label} aria-label="Label" onChange={e => S({ ...stats, payload: { items: stats.payload.items.map((x, k) => k === i ? { ...x, label: e.target.value } : x) } })} /><button className="icon-btn danger" type="button" aria-label="Remove" onClick={() => S({ ...stats, payload: { items: stats.payload.items.filter((_, k) => k !== i) } })}><Icon name="x" /></button></li>)}</ul>
          <div className="row mt-16" style={{ gap: 8 }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => S({ ...stats, payload: { items: [...stats.payload.items, { number: 0, suffix: '+', label: 'New statistic' }] } })}><Icon name="plus" className="icon-sm" />Add statistic</button><Save label="statistics" onClick={() => save(() => saveContent('statistics', stats.payload as unknown as Record<string, unknown>, stats.is_visible), 'Statistics')} /></div>
        </div>
        <div className="preview-box a-sticky">Numbers animate when scrolled into view. Use a suffix such as “+” to indicate “more than”.</div>
      </div>}

      {sec === 'faq' && <div className="a-form-layout">
        <div className="a-card"><h3>FAQ <span className="small muted" style={{ fontWeight: 400 }}>First 6 appear on the homepage; all appear on /faqs</span></h3>
          <ul className="sortable">{faqs.map((f, i) => <li key={f.id || i} style={{ alignItems: 'flex-start' }}><span className="handle" style={{ marginTop: 8 }}><Icon name="menu" /></span><div style={{ flex: 1, display: 'grid', gap: 6 }}>
            <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}><input className="input" style={{ minHeight: 36 }} value={f.question} aria-label="Question" onChange={e => FQ(faqs.map((x, k) => k === i ? { ...x, question: e.target.value } : x))} /><select className="select" style={{ minHeight: 36, width: 'auto', padding: '6px 32px 6px 10px' }} value={f.group} onChange={e => FQ(faqs.map((x, k) => k === i ? { ...x, group: e.target.value } : x))}>{['Job seekers', 'Employers', 'Partners', 'General'].map(g => <option key={g}>{g}</option>)}</select></div>
            <textarea className="textarea" style={{ minHeight: 60 }} value={f.answer} aria-label="Answer" onChange={e => FQ(faqs.map((x, k) => k === i ? { ...x, answer: e.target.value } : x))} /></div>
            <button className="icon-btn" type="button" disabled={i === 0} aria-label="Move up" onClick={() => { const a = [...faqs]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; FQ(a); }}><Icon name="chevron" /></button>
            <button className="icon-btn danger" type="button" aria-label="Remove" onClick={() => { if (f.id) setDeletedFaqs(d => [...d, f.id]); FQ(faqs.filter((_, k) => k !== i)); }}><Icon name="x" /></button></li>)}</ul>
          <div className="row mt-16" style={{ gap: 8 }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => FQ([...faqs, { id: '', question: '', answer: '', group: 'General', sort_order: faqs.length + 1, is_active: true }])}><Icon name="plus" className="icon-sm" />Add question</button><Save label="FAQ" onClick={() => save(() => saveFaqs(faqs.filter(f => f.question.trim()).map((f, i) => ({ id: f.id || undefined, question: f.question, answer: f.answer, group: f.group, sort_order: i + 1, is_active: true })), deletedFaqs), 'FAQ')} /></div>
        </div>
        <div className="preview-box a-sticky">Group questions by audience. Keep answers under 60 words.</div>
      </div>}

      {sec === 'cta' && <div className="a-form-layout">
        <div className="a-card"><h3>Employer CTA band</h3>
          <div className="field"><label htmlFor="c-heading">Heading</label><input className="input" id="c-heading" value={cta.payload.heading} onChange={e => C({ ...cta, payload: { ...cta.payload, heading: e.target.value } })} /></div>
          <div className="field"><label htmlFor="c-text">Text</label><textarea className="textarea" id="c-text" style={{ minHeight: 70 }} value={cta.payload.text} onChange={e => C({ ...cta, payload: { ...cta.payload, text: e.target.value } })} /></div>
          <div className="form-grid"><div className="field"><label htmlFor="c-p">Primary CTA</label><input className="input" id="c-p" value={cta.payload.primary_cta} onChange={e => C({ ...cta, payload: { ...cta.payload, primary_cta: e.target.value } })} /></div><div className="field"><label htmlFor="c-s">Secondary CTA</label><input className="input" id="c-s" value={cta.payload.secondary_cta} onChange={e => C({ ...cta, payload: { ...cta.payload, secondary_cta: e.target.value } })} /></div></div>
          <Save label="CTA" onClick={() => save(() => saveContent('employer_cta', cta.payload as unknown as Record<string, unknown>, true), 'Employer CTA')} />
        </div>
        <div className="preview-box a-sticky">Appears on the homepage, About and Services pages.</div>
      </div>}

      {sec === 'footer' && <div className="a-form-layout">
        <div className="a-card"><h3>Footer &amp; contact details</h3>
          <div className="form-grid">
            <div className="field span-2"><label htmlFor="f-addr">Address</label><textarea className="textarea" id="f-addr" style={{ minHeight: 70 }} value={footer.payload.address} onChange={e => F({ ...footer, payload: { ...footer.payload, address: e.target.value } })} /></div>
            <div className="field"><label htmlFor="f-phone">Phone</label><input className="input" id="f-phone" value={footer.payload.phone} onChange={e => F({ ...footer, payload: { ...footer.payload, phone: e.target.value } })} /></div>
            <div className="field"><label htmlFor="f-email">Email</label><input className="input" id="f-email" value={footer.payload.email} onChange={e => F({ ...footer, payload: { ...footer.payload, email: e.target.value } })} /></div>
            <div className="field span-2"><label htmlFor="f-hours">Office hours</label><input className="input" id="f-hours" value={footer.payload.hours} onChange={e => F({ ...footer, payload: { ...footer.payload, hours: e.target.value } })} /></div>
            {(['linkedin', 'instagram', 'x', 'youtube'] as const).map(k => <div key={k} className="field"><label htmlFor={`f-${k}`}>{k === 'x' ? 'X' : k.charAt(0).toUpperCase() + k.slice(1)} URL</label><input className="input" id={`f-${k}`} value={footer.payload.social?.[k] || ''} onChange={e => F({ ...footer, payload: { ...footer.payload, social: { ...footer.payload.social, [k]: e.target.value } } })} /></div>)}
            <div className="field span-2"><label htmlFor="f-desc">Footer description</label><textarea className="textarea" id="f-desc" style={{ minHeight: 70 }} value={footer.payload.description} onChange={e => F({ ...footer, payload: { ...footer.payload, description: e.target.value } })} /></div>
          </div>
          <Save label="footer" onClick={() => save(() => saveContent('footer', footer.payload as unknown as Record<string, unknown>, true), 'Footer')} />
        </div>
        <div className="preview-box a-sticky">Contact details here also feed the Contact page. Empty social fields hide that icon.</div>
      </div>}
    </>
  );
}
