# Hawari Commerce

E-commerce portfolio project bergaya marketplace modern, dibangun dengan Next.js App Router, Prisma, PostgreSQL, NextAuth, Stripe, Tailwind CSS, dan Zustand.

## Preview

### Storefront
![Storefront Preview](public/screenshots/storefront-preview.svg)

### Admin Dashboard
![Admin Preview](public/screenshots/admin-preview.svg)

## Tech Stack

- Next.js 16 App Router
- TypeScript strict
- Tailwind CSS v4
- Prisma ORM + PostgreSQL
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
- Prisma seed untuk kategori, produk, order, dan akun demo

## Demo Account

- Admin: `admin@hawari.test` / `Admin123!`
- User: `user@hawari.test` / `User12345!`

## Environment

Buat file `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public"
NEXTAUTH_SECRET="your-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
```

Template aman juga tersedia di `.env.example`.

## Local Setup

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:seed
```

## Prisma Notes

- Prisma config berada di `prisma.config.ts`
- Migration berada di `prisma/migrations`
- Seed berada di `prisma/seed.ts`

## Status

Project ini sudah:

- lint clean
- production build sukses
- connect ke PostgreSQL via Prisma
- menggunakan data real dari database untuk storefront inti dan admin utama

## Next Improvements

- Full register flow ke database
- Edit/delete product admin
- Real screenshot capture dari UI final
- Webhook Stripe untuk update status order otomatis
