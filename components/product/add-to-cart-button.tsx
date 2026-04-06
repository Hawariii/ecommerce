"use client";

import { ShoppingCart } from "lucide-react";

import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() =>
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0],
          price: product.flashSalePrice ?? product.price,
          quantity: 1,
          stock: product.stock,
        })
      }
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Tambah ke Keranjang
    </Button>
  );
}
