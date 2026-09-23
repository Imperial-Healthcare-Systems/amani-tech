-- Amani Tech — one person, one candidate record
-- Run after 0003 in the Supabase SQL editor. Safe to re-run.
--
-- Email was already unique but case-sensitive ("A@x.com" and "a@x.com" could both exist), and phone had no
-- constraint at all, so the same person could register twice with a differently formatted number.
-- Both are now unique on a normalised value: email lower-cased, phone reduced to its last 10 digits
-- (so "+91 98765 43210", "098765 43210" and "9876543210" are the same person).

-- Normalise what is already there before the indexes are created.
update candidates set email = lower(trim(email)) where email <> lower(trim(email));

alter table candidates
  add column if not exists phone_norm text
  generated always as (nullif(right(regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g'), 10), '')) stored;

create unique index if not exists candidates_email_lower_key on candidates (lower(email));
create unique index if not exists candidates_phone_norm_key on candidates (phone_norm) where phone_norm is not null;

-- If either index fails to build, two records share an email or a phone. Find them with:
--   select lower(email), count(*) from candidates group by 1 having count(*) > 1;
--   select phone_norm, count(*) from candidates where phone_norm is not null group by 1 having count(*) > 1;
-- Merge them by hand (keep the row with the applications, move any others' applications across, then delete).
