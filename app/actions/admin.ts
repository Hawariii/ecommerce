"use server";

import { revalidateTag } from "next/cache";

export async function upsertProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  if (!name) {
    return;
  }

  revalidateTag("products", "max");
  revalidateTag("admin", "max");
}
