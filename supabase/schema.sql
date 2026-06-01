create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  schema_version int not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "Users can read their own app state" on public.app_state;
create policy "Users can read their own app state"
on public.app_state
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own app state" on public.app_state;
create policy "Users can insert their own app state"
on public.app_state
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own app state" on public.app_state;
create policy "Users can update their own app state"
on public.app_state
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Realtime: stream row changes to other signed-in devices so edits made on one
-- device appear instantly on another. RLS above still applies to realtime, so a
-- user only ever receives changes to their own row.
alter table public.app_state replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'app_state'
  ) then
    alter publication supabase_realtime add table public.app_state;
  end if;
end $$;
