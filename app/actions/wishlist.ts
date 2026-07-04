"use server";

import { revalidateTag } from "next/cache";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function toggleWishlistAction(productId: string) {
  const session = await auth();

  if (!session?.user.id || !supabase) {
    return { status: "unauthorized" as const };
  }

  const { data: wishlistItem } = await supabase
    .from("_WishlistUsers")
    .select("A")
    .eq("A", productId)
    .eq("B", session.user.id)
    .maybeSingle();

  if (wishlistItem) {
    await supabase.from("_WishlistUsers").delete().match({
      A: productId,
      B: session.user.id,
    });

    revalidateTag("wishlist", "max");
    return { status: "removed" as const };
  }

  await supabase.from("_WishlistUsers").insert({
    A: productId,
    B: session.user.id,
  });

  revalidateTag("wishlist", "max");
  return { status: "added" as const };
}
