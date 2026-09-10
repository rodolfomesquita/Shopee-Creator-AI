-- Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  source text not null default 'shopee',
  name text not null,
  product_url text,
  affiliate_url text,
  image_url text,
  price numeric(12,2),
  original_price numeric(12,2),
  commission numeric(12,2),
  commission_rate numeric(8,4),
  rating numeric(3,2),
  reviews integer,
  units_sold integer,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_source_idx on products(source);
create index if not exists products_commission_idx on products(commission desc);
create index if not exists products_units_sold_idx on products(units_sold desc);

create table if not exists video_jobs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_url text,
  prompt text,
  provider text not null default 'gemini-veo',
  operation_name text,
  status text not null default 'processing',
  video_url text,
  duration_seconds integer,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists video_jobs_status_idx on video_jobs(status);
create index if not exists video_jobs_created_idx on video_jobs(created_at desc);

create table if not exists creatives (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  video_job_id uuid references video_jobs(id) on delete set null,
  title text,
  hook text,
  script text,
  cta text,
  captions jsonb,
  hashtags jsonb,
  style text,
  tone text,
  created_at timestamptz not null default now()
);

create table if not exists scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  creative_id uuid references creatives(id) on delete set null,
  platform text not null,
  scheduled_for timestamptz,
  status text not null default 'draft',
  external_post_id text,
  error text,
  created_at timestamptz not null default now()
);

-- Storage:
-- Create a public bucket named "generated-videos" in Supabase Storage.
