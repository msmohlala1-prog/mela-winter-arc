create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.challenge_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  successful_days integer not null default 0 check (successful_days >= 0 and successful_days <= 45),
  streak integer not null default 0 check (streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  reset_count integer not null default 0 check (reset_count >= 0),
  last_completed_date date,
  latest_message text,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null,
  mode text not null check (mode in ('great', 'soft')),
  day_number integer not null check (day_number >= 1 and day_number <= 45),
  completed_habits text[] not null default '{}',
  weekly_class_completed boolean not null default false,
  status text not null check (status in ('pending', 'complete', 'failed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, checkin_date)
);

create table if not exists public.arc_signups (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
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

drop trigger if exists set_challenge_states_updated_at on public.challenge_states;
create trigger set_challenge_states_updated_at
before update on public.challenge_states
for each row
execute function public.set_updated_at();

drop trigger if exists set_daily_checkins_updated_at on public.daily_checkins;
create trigger set_daily_checkins_updated_at
before update on public.daily_checkins
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.challenge_states enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.arc_signups enable row level security;

create policy "users manage own profile"
on public.profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage own challenge state"
on public.challenge_states
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage own daily checkins"
on public.daily_checkins
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "anyone can submit arc signup"
on public.arc_signups
for insert
to anon, authenticated
with check (true);
