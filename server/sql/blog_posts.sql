create table if not exists blog_posts (
  id          bigserial primary key,
  title       text not null default '',
  slug        text unique,
  excerpt     text,
  content     text not null default '',
  cover_url   text,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
