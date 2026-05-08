-- ============================================================
-- SSFI Data Center – Initial Schema
-- Run this once against a fresh Supabase project.
-- Tables used by the app (notifications removed – unused):
--   roles, members, users, leadership_records,
--   graduates, documents, activities
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ── Tables ────────────────────────────────────────────────────────────────────

create table public.roles (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null unique,
  key         text        not null unique
                check (key in ('super_admin','admin','executive','member','alumni','guest')),
  description text,
  created_at  timestamptz not null default timezone('utc', now())
);

create table public.members (
  id                    uuid        primary key default gen_random_uuid(),
  user_id               uuid        unique references auth.users(id) on delete set null,
  profile_image         text,
  full_name             text        not null,
  gender                text,
  date_of_birth         date,
  phone_number          text,
  email                 text        not null unique,
  whatsapp              text,
  telegram              text,
  village_in_myanmar    text,
  current_city_in_india text,
  state_in_india        text,
  university            text,
  major                 text,
  batch                 text,
  year_joined           integer,
  current_position      text,
  bio                   text,
  status                text        not null default 'active'
                check (status in ('active','inactive','alumni')),
  created_at            timestamptz not null default timezone('utc', now()),
  updated_at            timestamptz not null default timezone('utc', now())
);

create table public.users (
  id           uuid        primary key references auth.users(id) on delete cascade,
  role_id      uuid        references public.roles(id) on delete restrict,
  member_id    uuid        unique references public.members(id) on delete set null,
  email        text        not null unique,
  display_name text,
  is_approved  boolean     not null default false,
  created_at   timestamptz not null default timezone('utc', now()),
  updated_at   timestamptz not null default timezone('utc', now())
);

create table public.leadership_records (
  id                  uuid        primary key default gen_random_uuid(),
  member_id           uuid        not null references public.members(id) on delete cascade,
  leadership_position text        not null,
  term_start          date        not null,
  term_end            date,
  description         text,
  created_at          timestamptz not null default timezone('utc', now())
);

create table public.graduates (
  id              uuid        primary key default gen_random_uuid(),
  member_id       uuid        not null references public.members(id) on delete cascade,
  degree          text        not null,
  graduation_date date,
  graduation_year integer     not null,
  university      text        not null,
  current_job     text,
  current_country text,
  current_city    text,
  company         text,
  linkedin_url    text,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create table public.documents (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text,
  category    text        not null
                check (category in ('constitution','reports','minutes','events','other')),
  file_path   text        not null,
  file_name   text        not null,
  file_size   bigint,
  mime_type   text,
  uploaded_by uuid        references public.users(id) on delete set null,
  created_at  timestamptz not null default timezone('utc', now())
);

-- Audit log – used by activity.service.ts and user.service.ts
create table public.activities (
  id            uuid        primary key default gen_random_uuid(),
  actor_user_id uuid        references public.users(id) on delete set null,
  action        text        not null,
  entity_type   text        not null,
  entity_id     uuid,
  metadata      jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default timezone('utc', now())
);

-- ── updated_at trigger ────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger trg_members_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger trg_graduates_updated_at
  before update on public.graduates
  for each row execute function public.set_updated_at();

-- ── Seed roles ────────────────────────────────────────────────────────────────

insert into public.roles (name, key, description) values
  ('Super Admin', 'super_admin', 'Full access to the platform'),
  ('Admin',       'admin',       'Administrative access'),
  ('Executive',   'executive',   'Leadership and operating access'),
  ('Member',      'member',      'Standard member access'),
  ('Alumni',      'alumni',      'Alumni access'),
  ('Guest',       'guest',       'Read-only guest access')
on conflict (key) do update
  set name = excluded.name, description = excluded.description;

-- ── Helper functions ──────────────────────────────────────────────────────────

-- Returns the role key of the current authenticated user (or 'guest')
create or replace function public.current_role()
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(r.key, 'guest')
  from   public.users u
  left   join public.roles r on r.id = u.role_id
  where  u.id = auth.uid()
  limit  1;
$$;

-- Returns true if the current user is approved
create or replace function public.is_approved_user()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(is_approved, false)
  from   public.users
  where  id = auth.uid()
  limit  1;
$$;

-- Returns true if current user meets the minimum role AND is approved
create or replace function public.has_role(minimum_role text)
returns boolean
language plpgsql stable security definer set search_path = public
as $$
declare
  cur  text;
  cr   int;
  mr   int;
begin
  cur := public.current_role();
  cr  := case cur
           when 'super_admin' then 5
           when 'admin'       then 4
           when 'executive'   then 3
           when 'member'      then 2
           when 'alumni'      then 1
           else 0
         end;
  mr  := case minimum_role
           when 'super_admin' then 5
           when 'admin'       then 4
           when 'executive'   then 3
           when 'member'      then 2
           when 'alumni'      then 1
           else 0
         end;
  return cr >= mr and public.is_approved_user();
end;
$$;

-- Auto-creates a public.users row when a new auth user signs up
create or replace function public.bootstrap_user_profile()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  guest_id uuid;
begin
  select id into guest_id from public.roles where key = 'guest' limit 1;

  insert into public.users (id, role_id, email, display_name, is_approved)
  values (
    new.id,
    guest_id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.bootstrap_user_profile();

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index idx_members_status   on public.members(status);
create index idx_members_univ     on public.members(university);
create index idx_members_major    on public.members(major);
create index idx_members_state    on public.members(state_in_india);
create index idx_members_batch    on public.members(batch);
create index idx_members_pos      on public.members(current_position);
create index idx_members_fts      on public.members using gin (
  to_tsvector('simple',
    coalesce(full_name,'')    || ' ' ||
    coalesce(email,'')        || ' ' ||
    coalesce(university,'')   || ' ' ||
    coalesce(major,''))
);
create index idx_leadership_mbr   on public.leadership_records(member_id);
create index idx_leadership_term  on public.leadership_records(term_start desc);
create index idx_graduates_mbr    on public.graduates(member_id);
create index idx_graduates_yr     on public.graduates(graduation_year desc);
create index idx_documents_cat    on public.documents(category);
create index idx_activities_actor on public.activities(actor_user_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.roles              enable row level security;
alter table public.users              enable row level security;
alter table public.members            enable row level security;
alter table public.leadership_records enable row level security;
alter table public.graduates          enable row level security;
alter table public.documents          enable row level security;
alter table public.activities         enable row level security;

-- roles
create policy "roles: approved read"
  on public.roles for select
  using (public.is_approved_user());

-- users
create policy "users: admin read"
  on public.users for select
  using (public.has_role('admin'));

create policy "users: own read"
  on public.users for select
  using (auth.uid() = id);

create policy "users: admin update"
  on public.users for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

-- members
create policy "members: approved read"
  on public.members for select
  using (public.is_approved_user());

create policy "members: exec insert"
  on public.members for insert
  with check (public.has_role('executive'));

create policy "members: exec update"
  on public.members for update
  using (public.has_role('executive'))
  with check (public.has_role('executive'));

create policy "members: admin delete"
  on public.members for delete
  using (public.has_role('admin'));

-- leadership_records
create policy "leadership: approved read"
  on public.leadership_records for select
  using (public.is_approved_user());

create policy "leadership: exec all"
  on public.leadership_records for all
  using (public.has_role('executive'))
  with check (public.has_role('executive'));

-- graduates
create policy "graduates: approved read"
  on public.graduates for select
  using (public.is_approved_user());

create policy "graduates: exec all"
  on public.graduates for all
  using (public.has_role('executive'))
  with check (public.has_role('executive'));

-- documents
create policy "documents: approved read"
  on public.documents for select
  using (public.is_approved_user());

create policy "documents: admin all"
  on public.documents for all
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

-- activities
create policy "activities: admin read"
  on public.activities for select
  using (public.has_role('admin'));

create policy "activities: approved insert"
  on public.activities for insert
  with check (public.is_approved_user());

-- ── Storage ───────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values
  ('member-assets',          'member-assets',          true),
  ('organization-documents', 'organization-documents', false)
on conflict (id) do nothing;

create policy "member-assets: approved read"
  on storage.objects for select
  using (bucket_id = 'member-assets' and public.is_approved_user());

create policy "member-assets: exec insert"
  on storage.objects for insert
  with check (bucket_id = 'member-assets' and public.has_role('executive'));

create policy "member-assets: exec update"
  on storage.objects for update
  using (bucket_id = 'member-assets' and public.has_role('executive'))
  with check (bucket_id = 'member-assets' and public.has_role('executive'));

create policy "org-docs: approved read"
  on storage.objects for select
  using (bucket_id = 'organization-documents' and public.is_approved_user());

create policy "org-docs: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'organization-documents' and public.has_role('admin'));

create policy "org-docs: admin update"
  on storage.objects for update
  using (bucket_id = 'organization-documents' and public.has_role('admin'))
  with check (bucket_id = 'organization-documents' and public.has_role('admin'));
