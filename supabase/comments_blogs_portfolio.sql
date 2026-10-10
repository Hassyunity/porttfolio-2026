-- Table des commentaires du blog (à exécuter dans Supabase > SQL Editor)
create table if not exists public.comments_blogs_portfolio (
  id bigint generated always as identity primary key,
  post_id integer not null,
  name text not null check (char_length(btrim(name)) between 1 and 100),
  content text not null check (char_length(btrim(content)) between 3 and 500),
  created_at timestamptz not null default now()
);

create index if not exists comments_blogs_portfolio_post_id_idx
  on public.comments_blogs_portfolio (post_id, created_at desc);

-- RLS : lecture et ajout publics (clé anon), aucune modification/suppression
alter table public.comments_blogs_portfolio enable row level security;

drop policy if exists "Lecture publique des commentaires" on public.comments_blogs_portfolio;
create policy "Lecture publique des commentaires"
  on public.comments_blogs_portfolio for select
  to anon, authenticated
  using (true);

drop policy if exists "Ajout public de commentaires" on public.comments_blogs_portfolio;
create policy "Ajout public de commentaires"
  on public.comments_blogs_portfolio for insert
  to anon, authenticated
  with check (true);

grant select, insert on public.comments_blogs_portfolio to anon, authenticated;
