"use server";

import { revalidateTag, updateTag } from "next/cache";

export async function syncCartAction() {
  updateTag("cart");
  revalidateTag("orders", "max");
}
