create table public.tasks (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  priority text not null check (priority in ('Low', 'Medium', 'High')),
  status text not null check (status in ('Not Started', 'In Progress', 'Completed', 'Blocked')),
  start_date date,
  end_date date,
  milestone text,
  notes text,
  assigned_to uuid references auth.users(id),
  constraint tasks_pkey primary key (id)
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Policies
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = assigned_to);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = assigned_to);

create policy "Admins can view all tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );
