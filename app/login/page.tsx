import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/account/login-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full p-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Auth</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Masuk ke akun</h1>
          <p className="text-sm text-slate-500">Gunakan `admin@hawari.test` atau `user@hawari.test` untuk demo.</p>
        </div>
        <LoginForm />
        <p className="mt-4 text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-slate-950">
            Daftar
          </Link>
        </p>
      </Card>
    </div>
  );
}
