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
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-slate-950">Ringkasan Belanja</h2>
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
      <Button className="mt-6 w-full" disabled={!items.length} asChild>
        <Link href="/checkout">Lanjut ke Checkout</Link>
      </Button>
    </Card>
  );
}
