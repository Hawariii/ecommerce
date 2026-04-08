import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="px-4 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#f7fff9_0%,#ffffff_45%,#edf6ff_100%)] p-5 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute bottom-6 right-2 h-44 w-44 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="relative space-y-6">
          <Badge>Campaign April 2026</Badge>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
            <div className="space-y-5">
              <div className="space-y-3">
                <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[3.25rem]">
              Belanja cepat, tampilan bersih, dan flow checkout yang terasa rapi.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Storefront ini dirancang seperti marketplace modern, tapi dengan visual yang lebih tenang dan fokus ke
                  discovery produk.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/products" className="flex items-center gap-2">
                    Belanja Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
                  <Truck className="h-5 w-5 text-orange-500" />
                  <p className="mt-3 text-sm font-medium text-slate-950">Same day delivery</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">Jabodetabek dan kota besar.</p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <p className="mt-3 text-sm font-medium text-slate-950">Pembayaran aman</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">Stripe checkout dan audit trail.</p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
                  <Sparkles className="h-5 w-5 text-sky-500" />
                  <p className="mt-3 text-sm font-medium text-slate-950">Search instan</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">Filter cepat tanpa JS berat.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200/70 bg-white/92 p-5 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Highlight</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">Flash sale hingga 35%</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Fokus promo untuk elektronik, beauty, dan home essentials dengan stok terbatas.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <div className="rounded-2xl bg-slate-50 px-2 py-3">
                  <p className="text-base font-semibold text-slate-950">12</p>
                  <p>Jam</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-2 py-3">
                  <p className="text-base font-semibold text-slate-950">48</p>
                  <p>Menit</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-2 py-3">
                  <p className="text-base font-semibold text-slate-950">09</p>
                  <p>Detik</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">Kurasi</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    Rekomendasi produk berbasis rating dan penjualan.
                  </p>
                </div>
                <div className="rounded-[22px] border border-sky-100 bg-sky-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-sky-700">Discovery</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    Search, filter, dan wishlist dibuat tetap ringan di berbagai layar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
