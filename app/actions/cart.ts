"use server";

import { revalidateTag, updateTag } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function syncCartAction() {
  updateTag("cart");
  revalidateTag("orders", "max");
}

export async function addToCartAction(productId: string, quantity = 1) {
  const session = await auth();

  if (!session?.user.id || !prisma) {
    return;
  }

  const existing = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.cart.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
      },
    });
  } else {
    await prisma.cart.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
      },
    });
  }

  updateTag("cart");
  revalidateTag("orders", "max");
}

export async function updateCartQuantityAction(productId: string, quantity: number) {
  const session = await auth();

  if (!session?.user.id || !prisma) {
    return;
  }

  await prisma.cart.updateMany({
    where: {
      userId: session.user.id,
      productId,
    },
    data: {
      quantity: Math.max(1, quantity),
    },
  });

  updateTag("cart");
}

export async function removeFromCartAction(productId: string) {
  const session = await auth();

  if (!session?.user.id || !prisma) {
    return;
  }

  await prisma.cart.deleteMany({
    where: {
      userId: session.user.id,
      productId,
    },
  });

  updateTag("cart");
}
