create extension if not exists "pgcrypto";

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  key text not null unique check (key in ('super_admin', 'admin', 'executive', 'member', 'alumni', 'guest')),
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  profile_image text,
  full_name text not null,
  gender text,
  date_of_birth date,
  phone_number text,
  email text not null unique,
  whatsapp text,
  telegram text,
  village_in_myanmar text,
  current_city_in_india text,
  state_in_india text,
  university text,
  major text,
  batch text,
  year_joined integer,
  current_position text,
  bio text,
  status text not null default 'active' check (status in ('active', 'inactive', 'alumni')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete restrict,
  member_id uuid unique references public.members(id) on delete set null,
  email text not null unique,
  display_name text,
  is_approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.leadership_records (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  leadership_position text not null,
  term_start date not null,
  term_end date,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.graduates (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  degree text not null,
  graduation_date date,
  graduation_year integer not null,
  university text not null,
  current_job text,
  current_country text,
  current_city text,
  company text,
  linkedin_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('constitution', 'reports', 'minutes', 'events', 'other')),
  file_path text not null,
  file_name text not null,
  file_size bigint,
  mime_type text,
  uploaded_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
before update on public.members
for each row execute function public.set_updated_at();

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists set_graduates_updated_at on public.graduates;
create trigger set_graduates_updated_at
before update on public.graduates
for each row execute function public.set_updated_at();

insert into public.roles (name, key, description)
values
  ('Super Admin', 'super_admin', 'Full access to the platform'),
  ('Admin', 'admin', 'Administrative access'),
  ('Executive', 'executive', 'Leadership and operating access'),
  ('Member', 'member', 'Standard member access'),
  ('Alumni', 'alumni', 'Alumni access'),
  ('Guest', 'guest', 'Read-only guest access')
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(r.key, 'guest')
  from public.users u
  left join public.roles r on r.id = u.role_id
  where u.id = auth.uid()
  limit 1;
$$;

create or replace function public.is_approved_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(is_approved, false)
  from public.users
  where id = auth.uid()
  limit 1;
$$;

create or replace function public.has_role(minimum_role text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  current text;
  current_rank int;
  minimum_rank int;
begin
  current := public.current_role();

  current_rank := case current
    when 'super_admin' then 5
    when 'admin' then 4
    when 'executive' then 3
    when 'member' then 2
    when 'alumni' then 1
    else 0
  end;

  minimum_rank := case minimum_role
    when 'super_admin' then 5
    when 'admin' then 4
    when 'executive' then 3
    when 'member' then 2
    when 'alumni' then 1
    else 0
  end;

  return current_rank >= minimum_rank and public.is_approved_user();
end;
$$;

create or replace function public.bootstrap_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_role uuid;
begin
  select id into default_role from public.roles where key = 'guest' limit 1;

  insert into public.users (id, role_id, email, display_name, is_approved)
  values (
    new.id,
    default_role,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.bootstrap_user_profile();

create index if not exists idx_members_status on public.members(status);
create index if not exists idx_members_university on public.members(university);
create index if not exists idx_members_major on public.members(major);
create index if not exists idx_members_state on public.members(state_in_india);
create index if not exists idx_members_batch on public.members(batch);
create index if not exists idx_members_position on public.members(current_position);
create index if not exists idx_members_search on public.members using gin (to_tsvector('simple', coalesce(full_name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(university, '') || ' ' || coalesce(major, '')));
create index if not exists idx_leadership_member on public.leadership_records(member_id);
create index if not exists idx_leadership_term on public.leadership_records(term_start desc);
create index if not exists idx_graduates_member on public.graduates(member_id);
create index if not exists idx_graduates_year on public.graduates(graduation_year desc);
create index if not exists idx_documents_category on public.documents(category);
create index if not exists idx_activities_actor on public.activities(actor_user_id);
create index if not exists idx_notifications_user on public.notifications(user_id, read_at);

alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.members enable row level security;
alter table public.leadership_records enable row level security;
alter table public.graduates enable row level security;
alter table public.documents enable row level security;
alter table public.activities enable row level security;
alter table public.notifications enable row level security;

create policy "roles readable by approved users"
on public.roles
for select
using (public.is_approved_user());

create policy "users readable by admins"
on public.users
for select
using (public.has_role('admin'));

create policy "users updatable by admins"
on public.users
for update
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "members readable by approved users"
on public.members
for select
using (public.is_approved_user());

create policy "members writable by executives"
on public.members
for insert
with check (public.has_role('executive'));

create policy "members updatable by executives"
on public.members
for update
using (public.has_role('executive'))
with check (public.has_role('executive'));

create policy "members deletable by admins"
on public.members
for delete
using (public.has_role('admin'));

create policy "leadership readable by approved users"
on public.leadership_records
for select
using (public.is_approved_user());

create policy "leadership writable by executives"
on public.leadership_records
for all
using (public.has_role('executive'))
with check (public.has_role('executive'));

create policy "graduates readable by approved users"
on public.graduates
for select
using (public.is_approved_user());

create policy "graduates writable by executives"
on public.graduates
for all
using (public.has_role('executive'))
with check (public.has_role('executive'));

create policy "documents readable by approved users"
on public.documents
for select
using (public.is_approved_user());

create policy "documents writable by admins"
on public.documents
for all
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "activities readable by admins"
on public.activities
for select
using (public.has_role('admin'));

create policy "activities insert by approved users"
on public.activities
for insert
with check (public.is_approved_user());

create policy "notifications readable by owner"
on public.notifications
for select
using (auth.uid() = user_id);

create policy "notifications insert by admins"
on public.notifications
for insert
with check (public.has_role('admin'));

create policy "notifications update by owner"
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values
  ('member-assets', 'member-assets', true),
  ('organization-documents', 'organization-documents', false)
on conflict (id) do nothing;

create policy "member assets readable by approved users"
on storage.objects
for select
using (bucket_id = 'member-assets' and public.is_approved_user());

create policy "member assets writable by executives"
on storage.objects
for insert
with check (bucket_id = 'member-assets' and public.has_role('executive'));

create policy "member assets updatable by executives"
on storage.objects
for update
using (bucket_id = 'member-assets' and public.has_role('executive'))
with check (bucket_id = 'member-assets' and public.has_role('executive'));

create policy "organization documents readable by approved users"
on storage.objects
for select
using (bucket_id = 'organization-documents' and public.is_approved_user());

create policy "organization documents writable by admins"
on storage.objects
for insert
with check (bucket_id = 'organization-documents' and public.has_role('admin'));

create policy "organization documents updatable by admins"
on storage.objects
for update
using (bucket_id = 'organization-documents' and public.has_role('admin'))
with check (bucket_id = 'organization-documents' and public.has_role('admin'));
