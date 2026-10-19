-- =====================================================================
-- nimi portfolio — database setup
-- WHERE TO PASTE: Supabase dashboard -> SQL Editor -> New query -> paste all -> Run
-- Safe to run more than once.
-- =====================================================================

-- 1) TABLES ------------------------------------------------------------

-- A section of the page (About, Focus, Videos, your custom ones...)
create table if not exists public.sections (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  label        text,                       -- small spaced label, e.g. "areas of focus"
  title        text not null default '',   -- big heading, e.g. "what i do."
  subtitle     text,
  layout_type  text not null,
  variant      text,                       -- showcases: 'circle' or 'stack'
  sort_order   integer not null default 0,
  is_hidden    boolean not null default false,
  is_builtin   boolean not null default false,
  show_in_nav  boolean not null default true,
  created_at   timestamptz not null default now()
);
-- (for databases created by an older version of this file)
alter table public.sections add column if not exists label text;
alter table public.sections add column if not exists variant text;

-- Allowed layouts
alter table public.sections drop constraint if exists sections_layout_type_check;
alter table public.sections add constraint sections_layout_type_check check (layout_type in (
  'hero','about','contact','numbered','stats','cards','links',
  'timeline','logos','circle-image','circle-video','text','bullets'));

-- One entry inside a section (a card, a link, a video...)
create table if not exists public.items (
  id            uuid primary key default gen_random_uuid(),
  section_id    uuid not null references public.sections(id) on delete cascade,
  title         text not null default '',
  description   text,
  link_url      text,
  media_path    text,
  media_type    text check (media_type in ('image','video')),
  thumb_path    text,
  number_value  numeric,
  number_suffix text,
  extra         jsonb not null default '{}'::jsonb,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists items_section_idx on public.items(section_id, sort_order);

-- Site settings: name, bio, accent color, contact links, SEO...
create table if not exists public.settings (
  key   text primary key,
  value jsonb
);

-- 2) WHO IS THE ADMIN? ---------------------------------------------------
-- Only this email can change anything. (Keep it the same as ADMIN_EMAIL in Vercel.)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'victoradoji4@gmail.com', false);
$$;

-- 3) ROW LEVEL SECURITY: everyone can read, only the admin can write --------
alter table public.sections enable row level security;
alter table public.items    enable row level security;
alter table public.settings enable row level security;

do $$
declare t text;
begin
  foreach t in array array['sections','items','settings'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

grant usage on schema public to anon, authenticated;
grant select on public.sections, public.items, public.settings to anon, authenticated;
grant insert, update, delete on public.sections, public.items, public.settings to authenticated;

-- 4) STORAGE BUCKET for uploads (images + videos) ----------------------------
-- Public read. 50 MB per file (Supabase free plan maximum). Only these file types.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800,
        array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;

create policy "media public read"  on storage.objects for select
  using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
