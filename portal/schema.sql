-- Apply in a dedicated Supabase project's SQL editor before enabling sign-in.
-- Client roles receive read access only. Membership and reporting writes belong
-- to the owner through the Supabase dashboard or a trusted server integration.
begin;

create table if not exists public.portal_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 120),
  website text not null check (website ~ '^https://'),
  created_at timestamptz not null default now()
);
create table if not exists public.portal_memberships (
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  primary key (user_id, client_id)
);
create table if not exists public.portal_snapshots (
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  period_days integer not null check (period_days in (7, 28, 90)),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (client_id, period_days)
);

alter table public.portal_clients enable row level security;
alter table public.portal_memberships enable row level security;
alter table public.portal_snapshots enable row level security;
revoke all on public.portal_clients, public.portal_memberships, public.portal_snapshots from public, anon, authenticated;
grant select on public.portal_clients, public.portal_memberships, public.portal_snapshots to authenticated;

drop policy if exists "Read own memberships" on public.portal_memberships;
create policy "Read own memberships" on public.portal_memberships for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "Read assigned clients" on public.portal_clients;
create policy "Read assigned clients" on public.portal_clients for select to authenticated
  using (exists (select 1 from public.portal_memberships as membership
    where membership.client_id = portal_clients.id and membership.user_id = (select auth.uid())));
drop policy if exists "Read assigned reporting" on public.portal_snapshots;
create policy "Read assigned reporting" on public.portal_snapshots for select to authenticated
  using (exists (select 1 from public.portal_memberships as membership
    where membership.client_id = portal_snapshots.client_id and membership.user_id = (select auth.uid())));

commit;
