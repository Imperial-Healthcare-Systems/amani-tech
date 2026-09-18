'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Icon } from '../Icon';
import { StatusBadge } from '../cards';
import { useToast } from '../Toast';
import { ActionMenu, EmptyRow, PageHead, useConfirm } from './shared';
import { deletePost, setPostStatus, togglePostFeatured } from '@/lib/actions/admin';
import { fmtDate } from '@/lib/format';
import type { BlogPost } from '@/lib/types';

export function PostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter(); const toast = useToast(); const { confirm, el } = useConfirm(); const [, start] = useTransition();
  const act = (fn: () => Promise<void>, msg: string) => start(async () => { await fn(); toast(msg); router.refresh(); });
  return (
    <>
      {el}
      <PageHead title="Blog posts" text="Insights, career advice and company news. Drafts are never visible on the site." actions={<Link className="btn btn-primary btn-sm" href="/admin/blog/new"><Icon name="plus" className="icon-sm" />New Post</Link>} />
      <div className="a-table-wrap"><table className="a-table"><thead><tr><th>Post</th><th>Category</th><th>Author</th><th>Publish date</th><th>Featured</th><th>Status</th><th></th></tr></thead><tbody>
        {posts.length ? posts.map(b => (
          <tr key={b.id}>
            <td><Link className="primary" href={`/admin/blog/${b.id}/edit`}>{b.title}</Link><span className="sub">/blog/{b.slug}</span></td><td>{b.category}</td><td>{b.author}</td><td><span className="sub nowrap">{fmtDate(b.published_at)}</span></td>
            <td>{b.is_featured ? <span className="badge badge-featured">Featured</span> : '—'}</td><td><StatusBadge s={b.status} /></td>
            <td><div className="actions"><a className="icon-btn" href={`/blog/${b.slug}`} target="_blank" aria-label="Preview"><Icon name="eye" /></a><Link className="icon-btn" href={`/admin/blog/${b.id}/edit`} aria-label="Edit"><Icon name="edit" /></Link>
              <ActionMenu items={[
                b.status === 'PUBLISHED' ? { label: 'Unpublish', icon: 'eye', onClick: () => act(() => setPostStatus(b.id, 'UNPUBLISHED'), 'Post unpublished.') } : { label: 'Publish', icon: 'check', onClick: () => act(() => setPostStatus(b.id, 'PUBLISHED'), 'Post published.') },
                { label: b.is_featured ? 'Unfeature' : 'Feature', icon: 'star', onClick: () => act(() => togglePostFeatured(b.id, !b.is_featured), b.is_featured ? 'Post unfeatured.' : 'Post featured.') },
                { label: 'Delete', icon: 'trash', danger: true, onClick: async () => { if (await confirm({ title: 'Delete this post?', text: `“${b.title}” will be permanently removed.`, ok: 'Delete', danger: true })) act(() => deletePost(b.id), 'Post deleted.'); } },
              ]} /></div></td>
          </tr>
        )) : <EmptyRow cols={7} title="No posts yet" text="Create your first article." />}
      </tbody></table></div>
    </>
  );
}
