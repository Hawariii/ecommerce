import Link from "next/link";

import { StatsGrid } from "@/components/admin/stats-grid";
import { Card } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/data";

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#1e293b_55%,#334155)] p-8 text-white shadow-[0_25px_70px_-35px_rgba(15,23,42,0.55)]">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Admin</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Dashboard operasional</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Satu panel untuk memantau revenue, inventory, user, dan pipeline order. Layout ini sengaja dibuat kontras
          agar area admin terasa berbeda dari storefront.
        </p>
      </div>
      <StatsGrid stats={stats} />
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
          <h2 className="text-xl font-semibold text-slate-950">CRUD Produk</h2>
          <p className="mt-2 text-sm text-slate-500">Kelola katalog, harga, dan stok.</p>
          <Link href="/admin/products" className="mt-6 inline-block text-sm font-semibold text-orange-600">
            Buka modul produk
          </Link>
        </Card>
        <Card className="border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
          <h2 className="text-xl font-semibold text-slate-950">Kelola Pesanan</h2>
          <p className="mt-2 text-sm text-slate-500">Pantau order baru dan fulfillment.</p>
          <Link href="/admin/orders" className="mt-6 inline-block text-sm font-semibold text-orange-600">
            Buka modul order
          </Link>
        </Card>
        <Card className="border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
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
