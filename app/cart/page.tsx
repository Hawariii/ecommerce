import type { Metadata } from "next";

import { CartList } from "@/components/cart/cart-list";
import { CartSummary } from "@/components/cart/cart-summary";

export const metadata: Metadata = {
  title: "Keranjang",
};

export default function CartPage() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#f4fff7,#ffffff_55%,#eef7ff)] p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Cart</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Keranjang belanja</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Ringkas, mudah dipindai, dan siap dikonversi ke checkout tanpa langkah yang membingungkan.
          </p>
        </div>
        <CartList />
      </div>
      <CartSummary />
    </div>
  );
}
