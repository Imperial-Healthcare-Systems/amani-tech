-- Amani Tech — company logo on job posts
-- Run after 0002 in the Supabase SQL editor. Safe to re-run.

alter table jobs add column if not exists company_logo text;   -- public URL (uploaded to bucket "media" under jobs/) or pasted URL
