import Link from "next/link";

import { StatsGrid } from "@/components/admin/stats-grid";
import { Card } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/data";

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Admin</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Dashboard operasional</h1>
      </div>
      <StatsGrid stats={stats} />
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">CRUD Produk</h2>
          <p className="mt-2 text-sm text-slate-500">Kelola katalog, harga, dan stok.</p>
          <Link href="/admin/products" className="mt-6 inline-block text-sm font-semibold text-orange-600">
            Buka modul produk
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Kelola Pesanan</h2>
          <p className="mt-2 text-sm text-slate-500">Pantau order baru dan fulfillment.</p>
          <Link href="/admin/orders" className="mt-6 inline-block text-sm font-semibold text-orange-600">
            Buka modul order
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Kelola User</h2>
          <p className="mt-2 text-sm text-slate-500">Segmen pelanggan dan role admin.</p>
          <Link href="/admin/users" className="mt-6 inline-block text-sm font-semibold text-orange-600">
            Buka modul user
          </Link>
        </Card>
      </div>
    </div>
  );
}
