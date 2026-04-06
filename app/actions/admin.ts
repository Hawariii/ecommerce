"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function upsertProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  const description = String(formData.get("description") ?? "");

  if (!name) {
    return;
  }

  if (prisma) {
    const fallbackCategory = await prisma.category.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!fallbackCategory) {
      return;
    }

    const baseSlug = slugify(name);
    const existingCount = await prisma.product.count({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
    });

    await prisma.product.create({
      data: {
        name,
        slug: existingCount ? `${baseSlug}-${existingCount + 1}` : baseSlug,
        description: description || `Produk baru ${name} siap tayang di katalog.`,
        price: String(Math.max(price, 10000)),
        compareAtPrice: String(Math.max(price || 10000, 10000) + 50000),
        sku: `SKU-${Date.now()}`,
        stock: Math.max(stock, 1),
        soldCount: 0,
        rating: 0,
        reviewCount: 0,
        featured: false,
        flashSale: false,
        tags: ["new-arrival"],
        images: [
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
        ],
        categoryId: fallbackCategory.id,
      },
    });
  }

  revalidateTag("products", "max");
  revalidateTag("admin", "max");
  revalidateTag("categories", "max");
  redirect("/admin/products");
}
