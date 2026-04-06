"use client";

import { useTransition } from "react";
import { ShoppingCart } from "lucide-react";

import { addToCartAction } from "@/app/actions/cart";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => {
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0],
          price: product.flashSalePrice ?? product.price,
          quantity: 1,
          stock: product.stock,
        });

        startTransition(async () => {
          await addToCartAction(product.id, 1);
        });
      }}
      disabled={isPending}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isPending ? "Menyimpan..." : "Tambah ke Keranjang"}
    </Button>
  );
}
