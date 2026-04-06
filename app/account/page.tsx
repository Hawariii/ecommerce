import Link from "next/link";

import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const session = await auth();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <Card className="p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Profil</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {session?.user.name ?? "Guest User"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{session?.user.email ?? "Belum login"}</p>
        <p className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Role saat ini: <span className="font-semibold text-slate-950">{session?.user.role ?? "USER"}</span>
        </p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Riwayat pesanan</h2>
          <p className="mt-2 text-sm text-slate-500">Pantau status order dan invoice user.</p>
          <Button className="mt-6" asChild>
            <Link href="/account/orders">Lihat Pesanan</Link>
          </Button>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Wishlist</h2>
          <p className="mt-2 text-sm text-slate-500">Simpan produk favorit untuk repeat visit.</p>
          <Button className="mt-6" variant="secondary" asChild>
            <Link href="/wishlist">Buka Wishlist</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
