-- ============================================================
-- MusicTrack — Setup completo desde cero
--
-- Este archivo wipea el schema public actual y aplica TODAS las
-- migraciones (001 → 002 → 003 → 004) + seed en una sola corrida.
--
-- Pegar TODO en Supabase Dashboard → SQL Editor → New query → Run.
-- ============================================================


-- ============================================================
-- STEP 0 · Limpiar schema public existente
-- (esto borra la app de electrónica que estaba en este proyecto)
-- ============================================================

drop schema if exists public cascade;
create schema public;

grant usage on schema public to anon, authenticated, service_role;
grant all   on schema public to postgres, service_role;


-- ============================================================
-- STEP 1 · 001_init.sql — tablas base
-- ============================================================

-- profiles
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    phone text,
    address text,
    created_at timestamptz not null default now()
);

-- products
create table public.products (
    id bigserial primary key,
    name text not null,
    price integer not null check (price >= 0),
    description text,
    category text not null,
    image text,
    stock integer not null default 0 check (stock >= 0),
    created_at timestamptz not null default now()
);

create index idx_products_category on public.products(category);

-- orders
create table public.orders (
    id bigserial primary key,
    order_code text not null unique,
    user_id uuid references public.profiles(id) on delete set null,
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    customer_address text,
    comments text,
    total integer not null check (total >= 0),
    status text not null default 'pending' check (status in ('pending', 'approved', 'failed')),
    created_at timestamptz not null default now()
);

create index idx_orders_created_at on public.orders(created_at desc);
create index idx_orders_user_id    on public.orders(user_id);
create index idx_orders_status     on public.orders(status);

-- order_items
create table public.order_items (
    id bigserial primary key,
    order_id bigint not null references public.orders(id) on delete cascade,
    product_id bigint references public.products(id) on delete set null,
    product_name text not null,
    unit_price integer not null check (unit_price >= 0),
    quantity integer not null check (quantity > 0),
    subtotal integer not null check (subtotal >= 0)
);

create index idx_order_items_order_id on public.order_items(order_id);

alter table public.profiles    enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;


-- ============================================================
-- STEP 2 · seed.sql — 12 instrumentos
-- ============================================================

insert into public.products (name, price, description, category, image, stock) values
('Stratocaster Vintage Sunburst', 850000, 'Guitarra electrica estilo Stratocaster. Cuerpo de aliso, mastil de arce con diapason de palo de rosa, 3 pastillas single coil, puente con tremolo. Sonido limpio y cristalino, ideal para blues, rock y funk. Acabado sunburst clasico.', 'Electricas', '/products/stratocaster.jpg', 8),
('Les Paul Standard Cherry', 1250000, 'Guitarra electrica de cuerpo solido con tapa de arce flameado y caoba en el cuerpo. Mastil de caoba con diapason de palo de rosa. Dos pastillas humbucker, puente Tune-O-Matic. Sustain prolongado, sonido grueso y calido. Hecha para rock y hard rock.', 'Electricas', '/products/lespaul.jpg', 5),
('Telecaster Butterscotch', 780000, 'Guitarra electrica de cuerpo de fresno acabado butterscotch blonde. Mastil de arce de una sola pieza, dos pastillas single coil con bridge plate de acero. Brillante, mordiente y articulada. Iconica del country, rock e indie.', 'Electricas', '/products/telecaster.png', 7),
('SG Special Cherry', 620000, 'Guitarra electrica de caoba solida con doble cutaway profundo. Mastil delgado de caoba, dos humbuckers de salida media. Liviana, comoda y agresiva. Pensada para rock duro y hard rock estilo Angus Young.', 'Electricas', '/products/sg.jpg', 6),
('Acustica Folk Dreadnought', 320000, 'Guitarra acustica con caja Dreadnought, tapa de pino abeto macizo y aros y fondo de caoba. Mastil de nato, diapason de palo de rosa. Cuerdas de acero. Proyeccion potente y graves marcados. Ideal para acompanar canto.', 'Acusticas', '/products/folk.jpg', 12),
('Clasica de Concierto Nylon', 280000, 'Guitarra clasica con cuerdas de nylon. Tapa de cedro, fondo y aros de palo de rosa, mastil de cedro. Diapason de ebano. Sonido calido y dulce, ideal para folklore, bossa nova y musica clasica.', 'Acusticas', '/products/clasica.png', 10),
('Electroacustica Jumbo', 480000, 'Guitarra electroacustica con caja Jumbo y cutaway. Tapa de pino abeto macizo, preamplificador con afinador integrado y EQ de 3 bandas. Conexion jack 1/4 para amplificar. Versatil para vivo y grabacion.', 'Acusticas', '/products/electroacustica.jpg', 8),
('Jazz Bass 4 Cuerdas', 720000, 'Bajo electrico estilo Jazz Bass de 4 cuerdas. Cuerpo de aliso, mastil de arce con diapason de palo de rosa. Dos pastillas single coil con controles de volumen independientes y tono maestro. Mastil delgado, sonido moderno y articulado.', 'Bajos', '/products/jazzbass.jpg', 4),
('Precision Bass Active', 890000, 'Bajo electrico estilo Precision con electronica activa. Cuerpo de aliso, mastil de arce. Pastilla split coil + jazz en el puente. Preamplificador activo con EQ de 2 bandas. Punch profundo, ideal para rock y funk.', 'Bajos', '/products/precisionbass.jpg', 3),
('Amplificador 30W Combo', 245000, 'Amplificador combo de 30W con parlante de 10 pulgadas. Dos canales (limpio y crunch), reverb digital, entrada auxiliar para celular y salida de auriculares. Ideal para practica y ensayos chicos.', 'Accesorios', '/products/amplificador.jpg', 15),
('Pedal de Distorsion Vintage', 89000, 'Pedal de distorsion analogico con tres controles: volumen, tono y ganancia. Bypass real, alimentacion 9V (no incluye fuente). Sonido grueso y armonico estilo amplificador valvular. Construccion metalica robusta.', 'Accesorios', '/products/pedal.jpg', 25),
('Set de Cuerdas Acero 0.10', 18500, 'Juego completo de cuerdas para guitarra electrica calibre 0.10-0.46. Nucleo de acero hexagonal con entorchado de niquel. Empacadas individualmente con sellado anti-corrosion. Sonido brillante y duradero.', 'Accesorios', '/products/cuerdas.jpg', 100);


-- ============================================================
-- STEP 3 · 002_mercadopago.sql — columnas de pago
-- ============================================================

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
    check (status in (
        'pending', 'approved', 'failed', 'rejected',
        'in_process', 'refunded', 'cancelled', 'charged_back'
    ));

alter table public.orders add column if not exists payment_provider      text;
alter table public.orders add column if not exists payment_id            text;
alter table public.orders add column if not exists payment_status        text;
alter table public.orders add column if not exists payment_raw_response  jsonb;
alter table public.orders add column if not exists payment_preference_id text;

create unique index if not exists idx_orders_payment_id_unique
    on public.orders(payment_id) where payment_id is not null;
create index if not exists idx_orders_preference_id
    on public.orders(payment_preference_id);


-- ============================================================
-- STEP 4 · 003_security_hardening.sql — RLS + admin
-- ============================================================

-- Asegurar columnas que usan las policies y el frontend
alter table public.profiles add column if not exists role  text not null default 'user';
alter table public.profiles add column if not exists name  text;
alter table public.profiles add column if not exists email text;

-- Helper is_admin()
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------- profiles ----------
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------- products ----------
create policy "products_select_public"
  on public.products for select
  using (true);

create policy "products_admin_insert"
  on public.products for insert
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products for delete
  using (public.is_admin());

-- ---------- orders ----------
create policy "orders_insert_guest_or_self"
  on public.orders for insert
  with check (user_id is null or user_id = auth.uid());

create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders_select_admin"
  on public.orders for select
  using (public.is_admin());

create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "orders_delete_admin"
  on public.orders for delete
  using (public.is_admin());

-- ---------- order_items ----------
create policy "order_items_insert_via_order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id is null or o.user_id = auth.uid())
    )
  );

create policy "order_items_select_via_order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "order_items_select_admin"
  on public.order_items for select
  using (public.is_admin());

create policy "order_items_update_admin"
  on public.order_items for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "order_items_delete_admin"
  on public.order_items for delete
  using (public.is_admin());

-- ---------- Trigger handle_new_user ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    case when new.email = 'estani.lomonaco@gmail.com' then 'admin' else 'user' end,
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill: crear el perfil de los usuarios que ya existían en auth.users
-- (porque dropeamos public.profiles al inicio y los auth.users persistieron).
insert into public.profiles (id, name, role, email)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  case when u.email = 'estani.lomonaco@gmail.com' then 'admin' else 'user' end,
  u.email
from auth.users u
on conflict (id) do nothing;


-- ============================================================
-- STEP 5 · 004_checkout_atomic.sql — RPC checkout()
-- ============================================================

drop function if exists public.checkout(jsonb, jsonb);

create function public.checkout(
  p_items    jsonb,
  p_customer jsonb
)
returns table (order_code text, order_id bigint, total integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id    uuid    := auth.uid();
  v_total      integer := 0;
  v_order_id   bigint;
  v_order_code text;
  v_item       jsonb;
  v_product    public.products%rowtype;
  v_qty        integer;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = '28000';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'CART_EMPTY' using errcode = '22023';
  end if;

  if p_customer is null
     or coalesce(p_customer->>'name','')    = ''
     or coalesce(p_customer->>'email','')   = ''
     or coalesce(p_customer->>'address','') = ''
  then
    raise exception 'CUSTOMER_INVALID' using errcode = '22023';
  end if;

  for i in 1..5 loop
    v_order_code := 'MT-' || lpad(floor(random() * 1000000)::text, 6, '0');
    exit when not exists (select 1 from public.orders where order_code = v_order_code);
  end loop;

  insert into public.orders (
    order_code, user_id,
    customer_name, customer_email, customer_phone, customer_address, comments,
    total, status
  ) values (
    v_order_code, v_user_id,
    p_customer->>'name', p_customer->>'email',
    p_customer->>'phone', p_customer->>'address', p_customer->>'comments',
    0, 'pending'
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := nullif(v_item->>'quantity','')::int;
    if v_qty is null or v_qty <= 0 then
      raise exception 'QTY_INVALID' using errcode = '22023';
    end if;

    select * into v_product
    from public.products
    where id = nullif(v_item->>'id','')::bigint
    for update;

    if not found then
      raise exception 'PRODUCT_NOT_FOUND:%', v_item->>'id' using errcode = '22023';
    end if;

    if v_product.stock < v_qty then
      raise exception 'STOCK_INSUFFICIENT:%', v_product.name using errcode = '22023';
    end if;

    update public.products
       set stock = stock - v_qty
     where id = v_product.id;

    insert into public.order_items (
      order_id, product_id, product_name, unit_price, quantity, subtotal
    ) values (
      v_order_id, v_product.id, v_product.name,
      v_product.price, v_qty, v_product.price * v_qty
    );

    v_total := v_total + (v_product.price * v_qty);
  end loop;

  update public.orders set total = v_total where id = v_order_id;

  return query select v_order_code, v_order_id, v_total;
end;
$$;

revoke all on function public.checkout(jsonb, jsonb) from public, anon;
grant execute on function public.checkout(jsonb, jsonb) to authenticated;


-- ============================================================
-- VERIFICACIÓN — descomentar y correr aparte para chequear
-- ============================================================
-- select count(*) from public.products;           -- 12
-- select count(*) from public.orders;             -- 0
-- select email, role from public.profiles
--   join auth.users using (id);                   -- tu cuenta como 'admin'
-- ============================================================
