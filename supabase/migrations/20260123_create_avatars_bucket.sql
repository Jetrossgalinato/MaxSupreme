insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

create policy "Avatar Public Access"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Avatar Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

create policy "Avatar Owner Update"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Avatar Owner Delete"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.uid() = owner );
