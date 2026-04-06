"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import { removeFromCartAction, updateCartQuantityAction } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartList() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <Card className="border-white/70 bg-white/85 p-8 text-center shadow-sm backdrop-blur">
        <h2 className="text-xl font-semibold text-slate-950">Keranjang masih kosong</h2>
        <p className="mt-3 text-sm text-slate-500">Tambahkan produk dari katalog untuk memulai checkout.</p>
        <Button className="mt-6" asChild>
          <Link href="/products">Belanja Sekarang</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card
          key={item.productId}
          className="grid gap-4 border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:grid-cols-[120px_1fr_auto] sm:p-5"
        >
          <div className="relative h-28 overflow-hidden rounded-3xl bg-slate-100">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>
          <div className="space-y-2">
            <Link href={`/products/${item.slug}`} className="text-lg font-semibold text-slate-950">
              {item.name}
            </Link>
            <p className="text-sm text-slate-500">Stok tersedia: {item.stock}</p>
            <p className="text-base font-semibold text-slate-950">{formatCurrency(item.price)}</p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(event) => {
                const quantity = Number(event.target.value);
                updateQuantity(item.productId, quantity);
                startTransition(async () => {
                  await updateCartQuantityAction(item.productId, quantity);
                });
              }}
              className="h-11 w-20 rounded-2xl border border-slate-200 px-3"
              disabled={isPending}
            />
            <Button
              variant="ghost"
              onClick={() => {
                removeItem(item.productId);
                startTransition(async () => {
                  await removeFromCartAction(item.productId);
                });
              }}
            >
              Hapus
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
