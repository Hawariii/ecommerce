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
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Cart</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Keranjang belanja</h1>
        </div>
        <CartList />
      </div>
      <CartSummary />
    </div>
  );
}
