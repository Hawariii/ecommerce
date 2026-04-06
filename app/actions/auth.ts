"use server";

import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/register?error=1");
  }

  redirect("/login?registered=1");
}
