-- Ejecutar en Supabase SQL Editor.

create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  cover_url text,
  category text,
  status text not null default 'to_read'
              check (status in ('to_read','reading','read')),
  rating smallint check (rating between 1 and 5),
  review text,
  finished_at date,
  current_page integer default 0,
  total_pages integer,
  sort_order integer,
  source_api text,
  source_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  text text not null,
  page integer,
  created_at timestamptz default now()
);

create table reading_goals (
  year integer primary key,
  target integer not null
);

create index idx_books_status on books(status);
create index idx_books_category on books(category);
create index idx_books_author on books(author);
create index idx_quotes_book_id on quotes(book_id);

-- RLS con policy abierta: no hay noción de usuario (app single-user),
-- la seguridad real depende de no exponer la anon key fuera de este front.
alter table books enable row level security;
alter table quotes enable row level security;
alter table reading_goals enable row level security;

create policy "allow all on books" on books for all using (true) with check (true);
create policy "allow all on quotes" on quotes for all using (true) with check (true);
create policy "allow all on reading_goals" on reading_goals for all using (true) with check (true);
