import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="px-4 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(135deg,#fff8ef_0%,#ffffff_38%,#e8f5ff_100%)] p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.25)] lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute bottom-8 right-4 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="space-y-6">
          <Badge>Campaign April 2026</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Belanja secepat marketplace modern, dengan pengalaman checkout yang lebih rapi.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Temukan flash sale, produk unggulan, dan katalog lintas kategori dalam storefront yang mobile-first dan
              siap scale.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/products" className="flex items-center gap-2">
                Belanja Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/admin">Lihat Dashboard Admin</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <Truck className="h-5 w-5 text-orange-500" />
              <p className="mt-3 font-medium text-slate-950">Same day delivery</p>
              <p className="mt-1 text-sm text-slate-500">Jabodetabek dan kota besar.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <p className="mt-3 font-medium text-slate-950">Pembayaran aman</p>
              <p className="mt-1 text-sm text-slate-500">Stripe checkout dan audit trail.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <Sparkles className="h-5 w-5 text-sky-500" />
              <p className="mt-3 font-medium text-slate-950">Search instan</p>
              <p className="mt-1 text-sm text-slate-500">Filter cepat tanpa JS berat.</p>
            </div>
          </div>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[28px] bg-[linear-gradient(145deg,#0f172a,#1e293b)] p-6 text-white shadow-xl shadow-slate-950/15">
            <p className="text-sm text-slate-300">Flash sale live</p>
            <p className="mt-3 text-3xl font-semibold">Hingga 35%</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Promo elektronik, beauty, dan home essentials dengan stok terbatas.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
              <div className="rounded-2xl bg-white/8 px-2 py-3">
                <p className="text-lg font-semibold text-white">12</p>
                <p>Jam</p>
              </div>
              <div className="rounded-2xl bg-white/8 px-2 py-3">
                <p className="text-lg font-semibold text-white">48</p>
                <p>Menit</p>
              </div>
              <div className="rounded-2xl bg-white/8 px-2 py-3">
                <p className="text-lg font-semibold text-white">09</p>
                <p>Detik</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] bg-[linear-gradient(145deg,#f97316,#fb923c)] p-6 text-white shadow-xl shadow-orange-500/20">
            <p className="text-sm text-orange-100">Merchant tools</p>
            <p className="mt-3 text-3xl font-semibold">Admin-ready</p>
            <p className="mt-2 text-sm leading-7 text-orange-100">
              Pantau order, inventory, dan performa penjualan dalam satu dashboard.
            </p>
            <div className="mt-8 rounded-[24px] border border-white/20 bg-white/10 p-4">
              <div className="flex items-center justify-between text-sm text-orange-50">
                <span>Conversion</span>
                <span>+18.2%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/20">
                <div className="h-2 w-2/3 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
