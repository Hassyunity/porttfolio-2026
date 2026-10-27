-- Altea : sites clients de l'agence (à exécuter dans Supabase > SQL Editor, après blog_posts.sql).
-- Idempotent : peut être relancé sans risque.
--
-- Le contenu des sites est dans le code (src/altea/sites/<slug>/). Cette table ne garde que ce qui
-- doit changer sans redéploiement : le statut (publication / suspension) et le suivi de l'abonnement.

create table if not exists public.altea_sites (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  status text not null default 'draft' check (status in ('draft', 'published', 'suspended')),
  published_at timestamptz,
  suspended_at timestamptz,
  -- Abonnement
  price numeric(10, 2) check (price is null or price >= 0),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'yearly')),
  subscription_start date,
  next_payment date,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'late', 'cancelled')),
  notes text not null default '' check (char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.altea_sites_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists altea_sites_touch_updated_at on public.altea_sites;
create trigger altea_sites_touch_updated_at
  before update on public.altea_sites
  for each row execute function public.altea_sites_touch_updated_at();

-- --- Sécurité (RLS) : abonnements et notes réservés aux administrateurs -------
alter table public.altea_sites enable row level security;

drop policy if exists "Gestion des sites Altea par les admins" on public.altea_sites;
create policy "Gestion des sites Altea par les admins"
  on public.altea_sites for all
  to authenticated
  using (public.is_blog_admin())
  with check (public.is_blog_admin());

revoke all on public.altea_sites from anon;
grant select, insert, update, delete on public.altea_sites to authenticated;

-- --- Lecture publique du statut seul -------------------------------------------
-- Les visiteurs d'un site client ne voient que « en ligne ou non », jamais l'abonnement.
create or replace function public.altea_site_status(p_slug text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select status from public.altea_sites where slug = p_slug;
$$;

revoke all on function public.altea_site_status(text) from public;
grant execute on function public.altea_site_status(text) to anon, authenticated;
