-- VOX V5 — esquema básico opcional do Supabase
-- Execute no SQL Editor do seu próprio projeto Supabase.
-- Não coloque service_role/secret key no site.

create table if not exists public.vox_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'Pesquisador',
  character_id text not null default 'Edward',
  corrupted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.vox_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  credits integer not null default 0,
  anomalies integer not null default 0,
  missions integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.vox_profiles enable row level security;
alter table public.vox_progress enable row level security;

drop policy if exists "vox_profiles_select_own" on public.vox_profiles;
create policy "vox_profiles_select_own" on public.vox_profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "vox_profiles_insert_own" on public.vox_profiles;
create policy "vox_profiles_insert_own" on public.vox_profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "vox_profiles_update_own" on public.vox_profiles;
create policy "vox_profiles_update_own" on public.vox_profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "vox_progress_select_own" on public.vox_progress;
create policy "vox_progress_select_own" on public.vox_progress for select to authenticated using (auth.uid() = user_id);
drop policy if exists "vox_progress_insert_own" on public.vox_progress;
create policy "vox_progress_insert_own" on public.vox_progress for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "vox_progress_update_own" on public.vox_progress;
create policy "vox_progress_update_own" on public.vox_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
