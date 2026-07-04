# Hawari Commerce

E-commerce portfolio project bergaya marketplace modern, dibangun dengan Next.js App Router, Supabase, NextAuth, Stripe, Tailwind CSS, dan Zustand.

## Preview

### Storefront
![Storefront Preview](public/screenshots/storefront-preview.svg)

### Admin Dashboard
![Admin Preview](public/screenshots/admin-preview.svg)

## Tech Stack

- Next.js 16 App Router
- TypeScript strict
- Tailwind CSS v4
- Supabase Postgres
- NextAuth Credentials
- Stripe checkout intent
- Zustand for cart state

## Fitur

- Home page dengan hero, kategori, rekomendasi, dan flash sale
- Product catalog dengan search, suggestion, filter, sorting, dan pagination
- Product detail dengan gallery, review, related products, wishlist, dan cart CTA
- Cart dan checkout flow
- Auth demo berbasis database
- Admin dashboard untuk stats, products, orders, dan users
- Supabase seed untuk kategori, produk, order, dan akun demo

## Demo Account

- Admin: `admin@hawari.test` / `Admin123!`
- User: `user@hawari.test` / `User12345!`

## Environment

Buat file `.env`:

```env
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXTAUTH_SECRET="your-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
```

Gunakan Project URL dan service role key dari Supabase Project Settings > API. Key ini server-only, jadi jangan expose sebagai `NEXT_PUBLIC_`.

Template aman juga tersedia di `.env.example`.

## Local Setup

```bash
npm install
npm run db:seed
npm run dev
```

Untuk database Supabase yang masih kosong:

1. Buka Supabase SQL Editor.
2. Jalankan isi `supabase/schema.sql`.
3. Isi `.env`.
4. Jalankan `npm run db:seed`.
5. Jalankan `npm run dev`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:seed
```

## Supabase Notes

- Schema SQL berada di `supabase/schema.sql`
- Seed berada di `supabase/seed.ts`
- Runtime database client berada di `lib/supabase.ts`

## Status

Project ini sudah:

- lint clean
- production build sukses
- connect langsung ke Supabase Postgres
- menggunakan data real dari database untuk storefront inti dan admin utama

## Next Improvements

- Full register flow ke database
- Edit/delete product admin
- Real screenshot capture dari UI final
- Webhook Stripe untuk update status order otomatis
