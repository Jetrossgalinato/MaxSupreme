create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = assigned_to);
