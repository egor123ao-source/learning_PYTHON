create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{"completed":[],"quiz":{}}'::jsonb,
  streak jsonb not null default '{"days":0,"lastStudyDate":""}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint learning_progress_payload_size check (
    pg_column_size(progress) + pg_column_size(streak) <= 262144
  )
);

alter table public.learning_progress enable row level security;

revoke all on public.learning_progress from anon, authenticated;
grant select, insert, update on public.learning_progress to authenticated;

drop policy if exists "Users can read their own learning progress" on public.learning_progress;
create policy "Users can read their own learning progress"
  on public.learning_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own learning progress" on public.learning_progress;
create policy "Users can create their own learning progress"
  on public.learning_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own learning progress" on public.learning_progress;
create policy "Users can update their own learning progress"
  on public.learning_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
