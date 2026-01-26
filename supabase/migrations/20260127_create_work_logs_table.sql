create table if not exists public.work_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  work_date date not null default current_date,
  hours_worked numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint unique_user_work_date unique (user_id, work_date)
);

-- Enable RLS
alter table public.work_logs enable row level security;

-- Policies

-- Users can view their own logs
create policy "Users can view own work logs"
  on public.work_logs for select
  using (auth.uid() = user_id);

-- Admins can view all logs
create policy "Admins can view all work logs"
  on public.work_logs for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

-- Users can insert/update their own logs (for time tracking)
create policy "Users can insert own work logs"
  on public.work_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own work logs"
  on public.work_logs for update
  using (auth.uid() = user_id);
