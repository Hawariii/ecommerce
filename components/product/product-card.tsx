import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const activePrice = product.flashSalePrice ?? product.price;

  return (
    <Card className="group overflow-hidden border-white/70 bg-white/85 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-64 overflow-hidden bg-slate-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/25 to-transparent" />
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{product.category}</p>
            <Link href={`/products/${product.slug}`} className="mt-2 block text-lg font-semibold text-slate-950">
              {product.name}
            </Link>
          </div>
          {product.flashSale ? <Badge>Flash Sale</Badge> : null}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span>•</span>
          <span>{product.reviewCount} review</span>
          <span>•</span>
          <span>{product.soldCount}+ terjual</span>
        </div>

        <div className="flex items-end gap-3">
          <p className="text-xl font-semibold text-slate-950">{formatCurrency(activePrice)}</p>
          {product.compareAtPrice ? (
            <p className="text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice)}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <span>Stok {product.stock}</span>
          <span>{product.tags[0] ?? "featured"}</span>
        </div>

        <Button className="w-full" asChild>
          <Link href={`/products/${product.slug}`}>Lihat Detail</Link>
        </Button>
      </div>
    </Card>
  );
}
