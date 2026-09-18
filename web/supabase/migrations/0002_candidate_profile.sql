-- Amani Tech — candidate profile completion (photo, summary, skills, education, work history)
-- Run after 0001_init.sql in the Supabase SQL editor.

alter table candidates
  add column if not exists photo_path text,                                  -- storage key in bucket "photos"
  add column if not exists summary text,
  add column if not exists skills text[] not null default '{}',
  add column if not exists education jsonb not null default '[]',            -- [{degree, institution, year}]
  add column if not exists work_history jsonb not null default '[]',         -- [{title, company, from, to, description}]
  add column if not exists linkedin_url text,
  add column if not exists notice_period text;

-- Profile photos: private bucket, 2 MB, images only. Served through short-lived signed URLs like resumes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('photos', 'photos', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "photos: admin read" on storage.objects;
create policy "photos: admin read" on storage.objects for select
  using (bucket_id = 'photos' and public.is_admin());
drop policy if exists "photos: own read" on storage.objects;
create policy "photos: own read" on storage.objects for select
  using (bucket_id = 'photos' and exists (select 1 from candidates c where c.user_id = auth.uid() and c.photo_path = name));
