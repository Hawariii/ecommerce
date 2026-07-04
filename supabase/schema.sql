create extension if not exists pgcrypto;

do $$ begin
  create type "UserRole" as enum ('USER', 'ADMIN');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type "OrderStatus" as enum ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
exception
  when duplicate_object then null;
end $$;

create table if not exists "User" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text,
  "email" text not null unique,
  "emailVerified" timestamptz,
  "image" text,
  "password" text,
  "role" "UserRole" not null default 'USER',
  "phone" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Category" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "slug" text not null unique,
  "description" text,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Product" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "slug" text not null unique,
  "description" text not null,
  "price" numeric(10, 2) not null,
  "compareAtPrice" numeric(10, 2),
  "sku" text not null unique,
  "stock" integer not null default 0,
  "soldCount" integer not null default 0,
  "rating" double precision not null default 0,
  "reviewCount" integer not null default 0,
  "featured" boolean not null default false,
  "flashSale" boolean not null default false,
  "flashSalePrice" numeric(10, 2),
  "tags" text[] not null default '{}',
  "images" text[] not null default '{}',
  "categoryId" text not null references "Category"("id") on delete cascade on update cascade,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Review" (
  "id" text primary key default gen_random_uuid()::text,
  "rating" integer not null,
  "comment" text not null,
  "userId" text not null references "User"("id") on delete cascade on update cascade,
  "productId" text not null references "Product"("id") on delete cascade on update cascade,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("userId", "productId")
);

create table if not exists "Order" (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text not null references "User"("id") on delete cascade on update cascade,
  "status" "OrderStatus" not null default 'PENDING',
  "subtotal" numeric(10, 2) not null,
  "shippingCost" numeric(10, 2) not null,
  "total" numeric(10, 2) not null,
  "stripeIntentId" text unique,
  "addressLine1" text not null,
  "addressLine2" text,
  "city" text not null,
  "province" text not null,
  "postalCode" text not null,
  "country" text not null default 'Indonesia',
  "notes" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "OrderItem" (
  "id" text primary key default gen_random_uuid()::text,
  "orderId" text not null references "Order"("id") on delete cascade on update cascade,
  "productId" text not null references "Product"("id") on delete restrict on update cascade,
  "quantity" integer not null,
  "price" numeric(10, 2) not null,
  "productName" text not null,
  "productSlug" text not null
);

create table if not exists "Cart" (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text references "User"("id") on delete cascade on update cascade,
  "productId" text not null references "Product"("id") on delete cascade on update cascade,
  "quantity" integer not null default 1,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("userId", "productId")
);

create table if not exists "_WishlistUsers" (
  "A" text not null references "Product"("id") on delete cascade on update cascade,
  "B" text not null references "User"("id") on delete cascade on update cascade,
  primary key ("A", "B")
);

create index if not exists "Product_categoryId_idx" on "Product"("categoryId");
create index if not exists "Product_featured_flashSale_idx" on "Product"("featured", "flashSale");
create index if not exists "Review_productId_idx" on "Review"("productId");
create index if not exists "Order_userId_status_idx" on "Order"("userId", "status");
create index if not exists "OrderItem_orderId_idx" on "OrderItem"("orderId");
create index if not exists "OrderItem_productId_idx" on "OrderItem"("productId");
create index if not exists "Cart_productId_idx" on "Cart"("productId");
create index if not exists "_WishlistUsers_B_index" on "_WishlistUsers"("B");

alter table "User" enable row level security;
alter table "Category" enable row level security;
alter table "Product" enable row level security;
alter table "Review" enable row level security;
alter table "Order" enable row level security;
alter table "OrderItem" enable row level security;
alter table "Cart" enable row level security;
alter table "_WishlistUsers" enable row level security;
