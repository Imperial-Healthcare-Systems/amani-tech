'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { Upload } from '../Upload';
import { Field, FormStatus, useFormAction } from '../form';
import { useToast } from '../Toast';
import { PageHead, TagInput } from './shared';
import { savePost } from '@/lib/actions/admin';
import { slugify } from '@/lib/format';
import type { BlogPost, ContentStatus } from '@/lib/types';

export function PostEditor({ post }: { post: BlogPost | null }) {
  const [status, setStatus] = useState<ContentStatus>(post?.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
  const [title, setTitle] = useState(post?.title || ''); const [slug, setSlug] = useState(post?.slug || ''); const [seoTitle, setSeoTitle] = useState(post?.seo_title || ''); const [seoDesc, setSeoDesc] = useState(post?.seo_description || ''); const [dirty, setDirty] = useState(false);
  const ref = useRef<HTMLFormElement>(null); const ta = useRef<HTMLTextAreaElement>(null);
  const router = useRouter(); const toast = useToast();
  const { formAction, onSubmit, pending, errors, error, success, clear } = useFormAction(savePost.bind(null, post?.id ?? null, status));
  useEffect(() => { if (success?.ok) { toast(status === 'PUBLISHED' ? 'Post published.' : 'Draft saved.'); setDirty(false); if (!post) router.replace(`/admin/blog/${success.data?.id}/edit`); else router.refresh(); } }, [success, status, post, router, toast]);
  const submitAs = (s: ContentStatus) => { setStatus(s); setTimeout(() => ref.current?.requestSubmit(), 0); };
  const wrap = (w: string) => { const t = ta.current; if (!t) return; t.setRangeText(w, t.selectionStart, t.selectionEnd, 'end'); t.focus(); setDirty(true); };

  return (
    <>
      <PageHead title={post ? 'Edit post' : 'New post'} text="Write in Markdown. Preview opens the public article template." actions={<>{dirty && <span className="unsaved is-visible"><Icon name="alert" className="icon-sm" />Unsaved changes</span>}<StatusBadge s={post?.status || 'DRAFT'} /></>} />
      <form ref={ref} action={formAction} onSubmit={onSubmit} onInput={() => setDirty(true)} noValidate className="a-form-layout">
        <div className="stack" style={{ gap: 16 }}>
          <FormStatus error={error} />
          <div className="a-card">
            <Field label="Title" name="title" required error={errors.title} onClear={clear}><input className="input" id="title" name="title" required value={title} onChange={e => { setTitle(e.target.value); if (!post) setSlug(slugify(e.target.value)); }} style={{ fontSize: '1.1rem', fontWeight: 600 }} /></Field>
            <Field label="Slug" name="slug" onClear={clear}><div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}><span className="small muted">/blog/</span><input className="input" id="slug" name="slug" value={slug} onChange={e => setSlug(e.target.value)} /></div></Field>
            <Field label="Excerpt" name="excerpt" onClear={clear}><textarea className="textarea" id="excerpt" name="excerpt" style={{ minHeight: 70 }} defaultValue={post?.excerpt} placeholder="Shown on cards and as the default meta description" /></Field>
            <Field label="Content" name="content" required onClear={clear}>
              <div className="editor-toolbar" role="toolbar" aria-label="Formatting"><button type="button" title="Bold" onClick={() => wrap('**bold**')}>B</button><button type="button" title="Italic" onClick={() => wrap('_italic_')}><em>I</em></button><button type="button" title="Heading" onClick={() => wrap('\n## Heading\n')}>H2</button><button type="button" title="List" onClick={() => wrap('\n- item\n')}>•</button><button type="button" title="Link" onClick={() => wrap('[text](https://)')}>🔗</button></div>
              <textarea ref={ta} className="textarea" id="content" name="content" defaultValue={post?.content} placeholder="Write your article…" />
            </Field>
          </div>
          <div className="a-card"><h3>SEO</h3>
            <Field label="SEO title" name="seo_title" hint="Defaults to the post title. Up to 70 characters." onClear={clear}><input className="input" id="seo_title" name="seo_title" maxLength={70} value={seoTitle} onChange={e => setSeoTitle(e.target.value)} /></Field>
            <Field label="SEO description" name="seo_description" hint={`${seoDesc.length}/160`} onClear={clear}><textarea className="textarea" id="seo_description" name="seo_description" maxLength={160} style={{ minHeight: 70 }} value={seoDesc} onChange={e => setSeoDesc(e.target.value)} /></Field>
            <div className="preview-box"><div style={{ color: '#1a0dab', fontSize: 16, fontWeight: 500 }}>{seoTitle || title || 'Post title'} | Amani Tech</div><div style={{ color: '#006621', fontSize: 12 }}>amanitech.in › blog › {slug || '…'}</div><div style={{ fontSize: 13 }}>{seoDesc || post?.excerpt || 'Meta description preview.'}</div></div>
          </div>
        </div>
        <div className="stack a-sticky" style={{ gap: 16 }}>
          <div className="a-card"><h3>Publishing</h3>
            <Field label="Category" name="category" onClear={clear}><select className="select" id="category" name="category" defaultValue={post?.category || 'Career Advice'}><option>Career Advice</option><option>Insights</option><option>Company News</option></select></Field>
            <Field label="Author" name="author" required error={errors.author} onClear={clear}><input className="input" id="author" name="author" defaultValue={post?.author || 'Amani Tech Editorial'} required /></Field>
            <Field label="Publish date" name="published_at" onClear={clear}><input className="input" id="published_at" name="published_at" type="date" defaultValue={(post?.published_at || new Date().toISOString()).slice(0, 10)} /></Field>
            <Field label="Tags" name="tags" onClear={clear}><TagInput name="tags" initial={post?.tags || []} placeholder="Add tag, press Enter" /></Field>
            <input type="hidden" name="cover_url" value={post?.cover_image || ''} />
            <Upload name="cover" kind="image" maxMb={3} label="Featured image" hint="JPG, PNG or WEBP · 1600×900 recommended" error={errors.cover} onClear={clear} />
            <div className="field"><label className="switch"><input type="checkbox" name="is_featured" defaultChecked={post?.is_featured} /><span className="track" />Feature this post</label></div>
            <div className="stack" style={{ gap: 8, marginTop: 8 }}>
              <button type="button" className={`btn btn-primary btn-block ${pending && status === 'PUBLISHED' ? 'is-loading' : ''}`} disabled={pending} onClick={() => submitAs('PUBLISHED')}><span className="spinner" />Publish</button>
              <button type="button" className={`btn btn-outline btn-block ${pending && status === 'DRAFT' ? 'is-loading' : ''}`} disabled={pending} onClick={() => submitAs('DRAFT')}><span className="spinner" />Save draft</button>
              {post && <a className="btn btn-ghost btn-block" href={`/blog/${post.slug}`} target="_blank"><Icon name="eye" className="icon-sm" />Preview</a>}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
