"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SHIPPING_COST } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal + (items.length ? SHIPPING_COST : 0);

  return (
    <Card className="border-white/70 bg-white/85 p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-slate-950">Ringkasan Belanja</h2>
      <p className="mt-2 text-sm text-slate-500">Checkout ringkas dengan breakdown biaya yang mudah dipindai.</p>
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Ongkir</span>
          <span>{formatCurrency(items.length ? SHIPPING_COST : 0)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      <div className="mt-5 rounded-[22px] bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
        Benefit: free insurance untuk order elektronik tertentu.
      </div>
      <Button className="mt-6 w-full" disabled={!items.length} asChild>
        <Link href="/checkout">Lanjut ke Checkout</Link>
      </Button>
    </Card>
  );
}
