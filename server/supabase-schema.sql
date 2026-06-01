-- ============================================
-- DesignHub Marketplace — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Categories
create table categories (
  id serial primary key,
  name text not null,
  icon text not null,
  count integer default 0,
  slug text not null unique
);

-- Designers
create table designers (
  id serial primary key,
  name text not null,
  avatar text not null,
  role text not null,
  products integer default 0,
  sales integer default 0,
  rating numeric(2,1) default 0
);

-- Products (FK to categories and designers)
create table products (
  id serial primary key,
  name text not null,
  category_id integer references categories(id) on delete set null,
  designer_id integer references designers(id) on delete set null,
  type text not null check (type in ('free', 'pro')),
  badge text not null,
  downloads integer default 0,
  rating numeric(2,1) default 0,
  price integer default 0,
  price_display text not null,
  description text,
  count integer default 0,
  format text,
  color text,
  is_new boolean default false,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Pricing plans
create table pricing_plans (
  id text primary key,
  name text not null,
  tagline text,
  popular boolean default false,
  monthly_price integer default 0,
  yearly_price integer default 0
);

create table pricing_features (
  id serial primary key,
  plan_id text references pricing_plans(id) on delete cascade,
  text text not null,
  included boolean default true,
  highlight boolean default false
);

-- Testimonials
create table testimonials (
  id serial primary key,
  name text not null,
  avatar text not null,
  role text not null,
  stars integer default 5 check (stars between 1 and 5),
  text text not null
);

-- Site stats (single-row table)
create table site_stats (
  id integer primary key default 1 check (id = 1),
  total_products integer default 0,
  total_designers integer default 0,
  total_downloads integer default 0
);

-- User profiles (extends Supabase Auth users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text default 'user' check (role in ('user', 'designer')),
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security
-- ============================================

alter table profiles enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table designers enable row level security;
alter table pricing_plans enable row level security;
alter table pricing_features enable row level security;
alter table testimonials enable row level security;
alter table site_stats enable row level security;

-- Public read (service_role bypasses RLS, but these allow anon key access)
create policy "Public read products" on products for select to anon, authenticated using (true);
create policy "Public read categories" on categories for select to anon, authenticated using (true);
create policy "Public read designers" on designers for select to anon, authenticated using (true);
create policy "Public read pricing" on pricing_plans for select to anon, authenticated using (true);
create policy "Public read pricing features" on pricing_features for select to anon, authenticated using (true);
create policy "Public read testimonials" on testimonials for select to anon, authenticated using (true);
create policy "Public read stats" on site_stats for select to anon, authenticated using (true);

-- Profile policies
create policy "Users read own profile" on profiles for select to authenticated using (auth.uid() = id);
create policy "Users update own profile" on profiles for update to authenticated using (auth.uid() = id);

-- ============================================
-- Orders
-- ============================================

create table orders (
  id serial primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text,
  note text,
  payment_method text not null default 'cod',
  status text not null default 'pending',
  total integer not null default 0,
  created_at timestamptz default now()
);

create table order_items (
  id serial primary key,
  order_id integer references orders(id) on delete cascade,
  product_id integer references products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  price integer not null default 0
);

alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Users read own orders" on orders for select to authenticated using (auth.uid() = user_id);
create policy "Service role full access orders" on orders for all to service_role using (true) with check (true);
create policy "Service role full access order_items" on order_items for all to service_role using (true) with check (true);
