-- SproutFund Supabase schema.
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- (No Supabase CLI is set up in this project yet, so this is applied manually
-- rather than through `supabase migration`.)

-- ---------------------------------------------------------------------------
-- profiles: one row per auth.users row, holding app-specific profile data.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ( (select auth.uid()) = id );

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Auto-create a profile row whenever a new user signs up.
-- Reads the display name out of the signup metadata:
--   supabase.auth.signUp({ email, password, options: { data: { name } } })
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

-- Defense in depth: this function is only meant to run as a trigger
-- (NEW is undefined outside that context), but revoke direct RPC access
-- anyway since SECURITY DEFINER functions are PUBLIC-executable by default.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- investment_recommendations: saved investment plans.
-- ---------------------------------------------------------------------------
create table if not exists public.investment_recommendations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  budget numeric not null,
  timeline text not null,
  risk_tolerance text not null,
  strategies jsonb not null,
  disclaimer text,
  title text,
  created_at timestamptz not null default now()
);

alter table public.investment_recommendations enable row level security;

create policy "recommendations_select_own"
  on public.investment_recommendations for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "recommendations_insert_own"
  on public.investment_recommendations for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "recommendations_update_own"
  on public.investment_recommendations for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create policy "recommendations_delete_own"
  on public.investment_recommendations for delete
  to authenticated
  using ( (select auth.uid()) = user_id );

create index if not exists investment_recommendations_user_id_created_at_idx
  on public.investment_recommendations (user_id, created_at desc);

-- Note: the Spring Boot backend writes to investment_recommendations over a
-- direct Postgres/JDBC connection (not the PostgREST Data API), using the
-- user id from the verified Supabase JWT. It doesn't need these tables
-- exposed via the Data API, so no anon/authenticated GRANTs are added here.
