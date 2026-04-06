"use server";

import { revalidateTag } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleWishlistAction(productId: string) {
  const session = await auth();

  if (!session?.user.id || !prisma) {
    return { status: "unauthorized" as const };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      wishlist: {
        where: { id: productId },
        select: { id: true },
      },
    },
  });

  if (user?.wishlist.length) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        wishlist: {
          disconnect: { id: productId },
        },
      },
    });

    revalidateTag("wishlist", "max");
    return { status: "removed" as const };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      wishlist: {
        connect: { id: productId },
      },
    },
  });

  revalidateTag("wishlist", "max");
  return { status: "added" as const };
}
