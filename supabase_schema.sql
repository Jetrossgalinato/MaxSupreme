-- Create a specific bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true);

-- Enable RLS on the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'documents' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'documents' ); 
-- (You might want to restrict this further in production)

-- Create the documents table
create table public.documents (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text null,
  file_name text not null,
  file_path text not null,
  file_url text not null,
  constraint documents_pkey primary key (id)
);

-- RLS for documents table
alter table public.documents enable row level security;

create policy "Enable read access for all users"
  on public.documents for select
  using (true);

create policy "Enable insert access for all users"
  on public.documents for insert
  with check (true);
