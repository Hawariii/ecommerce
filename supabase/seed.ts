import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import { hashSync } from "bcryptjs";
import { randomUUID } from "crypto";

import { categories, products } from "../lib/sample-data";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to run the seed.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function resetTable(table: string) {
  const { error } = await supabase.from(table).delete().neq("id", "__never__");
  if (error) throw error;
}

async function main() {
  await supabase.from("_WishlistUsers").delete().neq("A", "__never__");
  await resetTable("Review");
  await resetTable("OrderItem");
  await resetTable("Order");
  await resetTable("Cart");
  await resetTable("Product");
  await resetTable("Category");

  const { data: existingDemoUsers, error: existingUsersError } = await supabase
    .from("User")
    .select("id")
    .in("email", ["admin@hawari.test", "user@hawari.test"]);

  if (existingUsersError) throw existingUsersError;

  if (existingDemoUsers?.length) {
    const { error } = await supabase
      .from("User")
      .delete()
      .in(
        "id",
        existingDemoUsers.map((user) => user.id),
      );
    if (error) throw error;
  }

  const adminUser = {
    id: randomUUID(),
    name: "Admin Hawari",
    email: "admin@hawari.test",
    password: hashSync("Admin123!", 10),
    role: "ADMIN",
    phone: "081234567890",
  };

  const demoUser = {
    id: randomUUID(),
    name: "User Demo",
    email: "user@hawari.test",
    password: hashSync("User12345!", 10),
    role: "USER",
    phone: "081298765432",
  };

  const { error: userError } = await supabase.from("User").insert([adminUser, demoUser]);
  if (userError) throw userError;

  const categoryRows = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
  }));

  const { error: categoryError } = await supabase.from("Category").insert(categoryRows);
  if (categoryError) throw categoryError;

  const categoryMap = new Map(categoryRows.map((category) => [category.slug, category.id]));

  const productRows = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    flashSalePrice: product.flashSalePrice,
    sku: `SKU-${product.id.toUpperCase()}`,
    stock: product.stock,
    soldCount: product.soldCount,
    rating: product.rating,
    reviewCount: product.reviewCount,
    featured: product.featured ?? false,
    flashSale: product.flashSale ?? false,
    tags: product.tags,
    images: product.images,
    categoryId: categoryMap.get(product.categorySlug),
  }));

  const { error: productError } = await supabase.from("Product").insert(productRows);
  if (productError) throw productError;

  const reviewRows = products.flatMap((product) =>
    product.reviews.map((review, index) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userId: index % 2 === 0 ? demoUser.id : adminUser.id,
      productId: product.id,
      createdAt: review.createdAt,
    })),
  );

  if (reviewRows.length) {
    const { error: reviewError } = await supabase.from("Review").insert(reviewRows);
    if (reviewError) throw reviewError;
  }

  const shippedOrderId = randomUUID();
  const deliveredOrderId = randomUUID();

  const { error: orderError } = await supabase.from("Order").insert([
    {
      id: shippedOrderId,
      userId: demoUser.id,
      status: "SHIPPED",
      subtotal: 1538000,
      shippingCost: 18000,
      total: 1556000,
      addressLine1: "Jl. Sudirman No. 88",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12190",
      country: "Indonesia",
      notes: "Titip satpam lobby",
    },
    {
      id: deliveredOrderId,
      userId: demoUser.id,
      status: "DELIVERED",
      subtotal: 289000,
      shippingCost: 18000,
      total: 307000,
      addressLine1: "Jl. Sudirman No. 88",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12190",
      country: "Indonesia",
    },
  ]);

  if (orderError) throw orderError;

  const { error: orderItemError } = await supabase.from("OrderItem").insert([
    {
      orderId: shippedOrderId,
      productId: "prod-1",
      quantity: 1,
      price: 1149000,
      productName: "Aurora Pro Wireless Headset",
      productSlug: "aurora-pro-wireless-headset",
    },
    {
      orderId: shippedOrderId,
      productId: "prod-5",
      quantity: 1,
      price: 419000,
      productName: "PixelFold Smart Lamp",
      productSlug: "pixelfold-smart-lamp",
    },
    {
      orderId: deliveredOrderId,
      productId: "prod-3",
      quantity: 1,
      price: 289000,
      productName: "Silk Repair Night Serum",
      productSlug: "silk-repair-night-serum",
    },
  ]);

  if (orderItemError) throw orderItemError;

  console.log("Seed completed.");
  console.log("Admin:", adminUser.email, "password: Admin123!");
  console.log("User:", demoUser.email, "password: User12345!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
