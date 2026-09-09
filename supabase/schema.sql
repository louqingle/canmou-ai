-- 餐谋AI 3.0 数据库
create table if not exists public.usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  used_count integer not null default 0,
  plan text not null default 'free' check (plan in ('free','basic','pro','store')),
  period_start date not null default current_date,
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('basic','pro','store')),
  amount numeric(10,2) not null,
  method text not null check (method in ('wechat','alipay')),
  status text not null default 'pending' check (status in ('pending','paid','rejected')),
  payer_name text,
  transaction_no text,
  note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists payment_orders_user_id_idx on public.payment_orders(user_id);
create index if not exists payment_orders_status_idx on public.payment_orders(status);

alter table public.usage enable row level security;
alter table public.payment_orders enable row level security;

drop policy if exists "usage_select_own" on public.usage;
create policy "usage_select_own" on public.usage for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "usage_insert_own" on public.usage;
create policy "usage_insert_own" on public.usage for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "usage_update_own" on public.usage;
create policy "usage_update_own" on public.usage for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "orders_select_own" on public.payment_orders;
create policy "orders_select_own" on public.payment_orders for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "orders_insert_own" on public.payment_orders;
create policy "orders_insert_own" on public.payment_orders for insert to authenticated with check ((select auth.uid()) = user_id);

-- 新用户自动创建免费额度
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.usage(user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
