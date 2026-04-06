import "dotenv/config";

import { hashSync } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient, OrderStatus, UserRole } from "../generated/prisma";
import { categories, products } from "../lib/sample-data";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run prisma seed.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const adminPassword = hashSync("Admin123!", 10);
  const userPassword = hashSync("User12345!", 10);

  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["admin@hawari.test", "user@hawari.test"],
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin Hawari",
      email: "admin@hawari.test",
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: "081234567890",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "User Demo",
      email: "user@hawari.test",
      password: userPassword,
      role: UserRole.USER,
      phone: "081298765432",
    },
  });

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
        },
      }),
    ),
  );

  const categoryMap = new Map(createdCategories.map((category) => [category.slug, category.id]));

  const createdProducts = [];
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice?.toString(),
        flashSalePrice: product.flashSalePrice?.toString(),
        sku: `SKU-${product.id.toUpperCase()}`,
        stock: product.stock,
        soldCount: product.soldCount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        featured: product.featured ?? false,
        flashSale: product.flashSale ?? false,
        tags: product.tags,
        images: product.images,
        categoryId: categoryMap.get(product.categorySlug)!,
      },
    });

    createdProducts.push(createdProduct);
  }

  const productMap = new Map(createdProducts.map((product) => [product.slug, product]));

  for (const product of products) {
    for (const [index, review] of product.reviews.entries()) {
      await prisma.review.create({
        data: {
          rating: review.rating,
          comment: review.comment,
          userId: index % 2 === 0 ? demoUser.id : adminUser.id,
          productId: productMap.get(product.slug)!.id,
          createdAt: new Date(review.createdAt),
        },
      });
    }
  }

  await prisma.order.create({
    data: {
      userId: demoUser.id,
      status: OrderStatus.SHIPPED,
      subtotal: "1538000",
      shippingCost: "18000",
      total: "1556000",
      addressLine1: "Jl. Sudirman No. 88",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12190",
      country: "Indonesia",
      notes: "Titip satpam lobby",
      items: {
        create: [
          {
            productId: productMap.get("aurora-pro-wireless-headset")!.id,
            quantity: 1,
            price: "1149000",
            productName: "Aurora Pro Wireless Headset",
            productSlug: "aurora-pro-wireless-headset",
          },
          {
            productId: productMap.get("pixelfold-smart-lamp")!.id,
            quantity: 1,
            price: "419000",
            productName: "PixelFold Smart Lamp",
            productSlug: "pixelfold-smart-lamp",
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: demoUser.id,
      status: OrderStatus.DELIVERED,
      subtotal: "289000",
      shippingCost: "18000",
      total: "307000",
      addressLine1: "Jl. Sudirman No. 88",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12190",
      country: "Indonesia",
      items: {
        create: [
          {
            productId: productMap.get("silk-repair-night-serum")!.id,
            quantity: 1,
            price: "289000",
            productName: "Silk Repair Night Serum",
            productSlug: "silk-repair-night-serum",
          },
        ],
      },
    },
  });

  console.log("Seed completed.");
  console.log("Admin:", adminUser.email, "password: Admin123!");
  console.log("User:", demoUser.email, "password: User12345!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
