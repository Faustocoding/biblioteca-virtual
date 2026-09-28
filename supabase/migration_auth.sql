-- Migración a multi-usuario con Supabase Auth (magic link).
-- Ejecutar ESTE script recién DESPUÉS de haberte logueado al menos una vez
-- en la app con tu email (así ya existe tu usuario en auth.users).
-- Corré todo el script de una sola vez en el SQL Editor de Supabase.

-- 1) Agregar columnas user_id (nullable por ahora)
alter table books add column user_id uuid references auth.users(id) on delete cascade;
alter table quotes add column user_id uuid references auth.users(id) on delete cascade;
alter table reading_goals add column user_id uuid references auth.users(id) on delete cascade;

-- 2) Asignar todos los datos ya existentes a tu propio usuario
--    (asume que a esta altura sos el único usuario registrado)
update books set user_id = (select id from auth.users limit 1) where user_id is null;
update quotes set user_id = (select id from auth.users limit 1) where user_id is null;
update reading_goals set user_id = (select id from auth.users limit 1) where user_id is null;

-- 3) Hacer la columna obligatoria y que se autocomplete con el usuario logueado
alter table books alter column user_id set not null;
alter table books alter column user_id set default auth.uid();

alter table quotes alter column user_id set not null;
alter table quotes alter column user_id set default auth.uid();

alter table reading_goals alter column user_id set not null;
alter table reading_goals alter column user_id set default auth.uid();

-- 4) La meta anual ahora es por usuario, no global: cambiar la clave primaria
alter table reading_goals drop constraint reading_goals_pkey;
alter table reading_goals add primary key (user_id, year);

-- 5) Reemplazar las políticas "permitir todo" por políticas por usuario
drop policy "allow all on books" on books;
drop policy "allow all on quotes" on quotes;
drop policy "allow all on reading_goals" on reading_goals;

create policy "users manage their own books" on books
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own quotes" on quotes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own reading_goals" on reading_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6) Índices para las consultas por usuario
create index idx_books_user_id on books(user_id);
create index idx_quotes_user_id on quotes(user_id);
