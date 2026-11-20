create extension if not exists pgcrypto;

create table if not exists blog_admins (
  id            bigserial primary key,
  email         text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);
