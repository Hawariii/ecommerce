"use server";

import { revalidateTag, updateTag } from "next/cache";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function syncCartAction() {
  updateTag("cart");
  revalidateTag("orders", "max");
}

export async function addToCartAction(productId: string, quantity = 1) {
  const session = await auth();

  if (!session?.user.id || !supabase) {
    return;
  }

  const { data: existing } = await supabase
    .from("Cart")
    .select("id,quantity")
    .eq("userId", session.user.id)
    .eq("productId", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("Cart")
      .update({
        quantity: existing.quantity + quantity,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("Cart").insert({
        userId: session.user.id,
        productId,
        quantity,
    });
  }

  updateTag("cart");
  revalidateTag("orders", "max");
}

export async function updateCartQuantityAction(productId: string, quantity: number) {
  const session = await auth();

  if (!session?.user.id || !supabase) {
    return;
  }

  await supabase
    .from("Cart")
    .update({
      quantity: Math.max(1, quantity),
      updatedAt: new Date().toISOString(),
    })
    .match({
      userId: session.user.id,
      productId,
    });

  updateTag("cart");
}

export async function removeFromCartAction(productId: string) {
  const session = await auth();

  if (!session?.user.id || !supabase) {
    return;
  }

  await supabase.from("Cart").delete().match({
      userId: session.user.id,
      productId,
  });

  updateTag("cart");
}
