create policy "Admins can insert any task"
  on public.tasks for insert
  with check (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

create policy "Admins can update any task"
  on public.tasks for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

create policy "Admins can delete any task"
  on public.tasks for delete
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );
