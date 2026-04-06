import type { Metadata } from "next";
import Link from "next/link";

import { registerAction } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full p-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Register</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Buat akun baru</h1>
        </div>
        <form action={registerAction} className="mt-6 space-y-4">
          <Input name="name" placeholder="Nama lengkap" />
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <button className="h-11 w-full rounded-full bg-slate-950 text-sm font-semibold text-white" type="submit">
            Daftar
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-slate-950">
            Masuk
          </Link>
        </p>
      </Card>
    </div>
  );
}
