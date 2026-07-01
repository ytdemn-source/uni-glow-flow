
-- 1) Role enum + user_roles table
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Note: inserts/deletes go through the admin-users edge function (service role)

-- 2) Seed first admin on email confirmation
create or replace function public.grant_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) = 'vpn99vip99@gmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_grant_first_admin on auth.users;
create trigger on_auth_user_created_grant_first_admin
after insert on auth.users
for each row execute function public.grant_first_admin();

drop trigger if exists on_auth_user_confirmed_grant_first_admin on auth.users;
create trigger on_auth_user_confirmed_grant_first_admin
after update of email_confirmed_at on auth.users
for each row
when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.grant_first_admin();

-- 3) Allow admins to manage notes and comments directly
grant insert, update, delete on public.notes to authenticated;
grant insert, update, delete on public.note_comments to authenticated;

create policy "Admins can insert notes"
  on public.notes for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update notes"
  on public.notes for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete notes"
  on public.notes for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete comments"
  on public.note_comments for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 4) Storage policies for note-files: admins can write, delete
create policy "Admins can upload note files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'note-files' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update note files"
  on storage.objects for update to authenticated
  using (bucket_id = 'note-files' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete note files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'note-files' and public.has_role(auth.uid(), 'admin'));
