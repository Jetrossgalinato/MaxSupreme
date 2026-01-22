create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = assigned_to);
