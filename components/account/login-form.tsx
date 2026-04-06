"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: true,
            callbackUrl: "/account",
          });

          if (result?.error) {
            setError("Login gagal. Periksa email demo yang digunakan.");
          }
        });
      }}
    >
      <Input name="email" type="email" placeholder="Email" />
      <Input name="password" type="password" placeholder="Password" />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button className="h-11 w-full rounded-full bg-slate-950 text-sm font-semibold text-white" type="submit">
        {isPending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
