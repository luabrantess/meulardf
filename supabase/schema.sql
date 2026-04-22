create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.visit_status as enum ('novo', 'contato_pendente', 'contatado', 'concluido');
create type public.property_purpose as enum ('venda', 'aluguel', 'lancamento');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  price numeric(12, 2) not null,
  bedrooms integer not null,
  bathrooms integer not null,
  area_total numeric(10, 2) not null,
  parking_spots integer not null default 1,
  description text not null,
  location text not null,
  amenities text[] not null default '{}',
  broker_name text not null,
  broker_phone text not null,
  cover_image text not null,
  gallery text[] not null default '{}',
  purpose public.property_purpose not null default 'venda',
  featured boolean not null default false,
  likes_count integer not null default 0,
  published boolean not null default true,
  map_embed_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.property_likes (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique (property_id, user_id)
);

create table if not exists public.scheduled_visits (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  visitor_name text not null,
  visitor_phone text not null,
  preferred_date date not null,
  message text,
  status public.visit_status not null default 'novo',
  created_at timestamptz not null default now()
);

alter table public.properties enable row level security;
alter table public.property_likes enable row level security;
alter table public.scheduled_visits enable row level security;

create or replace function public.toggle_property_like(_property_id uuid, _user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_like_id uuid;
begin
  select id into existing_like_id
  from public.property_likes
  where property_id = _property_id and user_id = _user_id;

  if existing_like_id is null then
    insert into public.property_likes (property_id, user_id)
    values (_property_id, _user_id);

    update public.properties
    set likes_count = likes_count + 1
    where id = _property_id;
  else
    delete from public.property_likes
    where id = existing_like_id;

    update public.properties
    set likes_count = greatest(0, likes_count - 1)
    where id = _property_id;
  end if;
end;
$$;

create policy "Published properties are public"
on public.properties
for select
using (published = true or public.has_role(auth.uid(), 'admin'));

create policy "Anyone can create property listings"
on public.properties
for insert
with check (true);

create policy "Admins can update properties"
on public.properties
for update
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete properties"
on public.properties
for delete
using (public.has_role(auth.uid(), 'admin'));

create policy "Users can read own likes"
on public.property_likes
for select
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Authenticated users can like"
on public.property_likes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can remove own likes"
on public.property_likes
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all visits"
on public.scheduled_visits
for select
using (public.has_role(auth.uid(), 'admin'));

create policy "Anyone can create visit requests"
on public.scheduled_visits
for insert
with check (true);

create policy "Admins can update visits"
on public.scheduled_visits
for update
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
