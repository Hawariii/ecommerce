import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Star, Store, Truck } from "lucide-react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produk tidak ditemukan" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categorySlug, product.slug);
  const activePrice = product.flashSalePrice ?? product.price;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="relative h-[300px] overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] sm:h-[440px] sm:rounded-[32px]">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
            <div className="absolute left-5 top-5">
              <Badge className="bg-white/85 text-slate-700">{product.tags[0] ?? "featured"}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((image) => (
              <div key={image} className="relative h-28 overflow-hidden rounded-[20px] border border-white/70 bg-white/80 shadow-sm sm:h-40 sm:rounded-[24px]">
                <Image src={image} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Badge>{product.category}</Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 sm:gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{product.reviewCount} review</span>
              <span>•</span>
              <span>{product.soldCount}+ terjual</span>
            </div>
          </div>

          <Card className="space-y-4 border-white/70 bg-white/85 p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="flex items-end gap-3">
              <p className="text-3xl font-semibold text-slate-950">{formatCurrency(activePrice)}</p>
              {product.compareAtPrice ? (
                <p className="text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice)}</p>
              ) : null}
            </div>
            <p className="text-sm leading-7 text-slate-600">{product.description}</p>
            <div className="grid gap-3 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Stok</p>
                <p className="mt-2 font-semibold text-slate-950">{product.stock} unit</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Kategori</p>
                <p className="mt-2 font-semibold text-slate-950">{product.category}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Merchant</p>
                <p className="mt-2 font-semibold text-slate-950">Hawari Official</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={product} />
              <WishlistButton productId={product.id} />
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
              <Truck className="h-5 w-5 text-orange-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950">Kirim cepat</p>
            </Card>
            <Card className="border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950">Garansi resmi</p>
            </Card>
            <Card className="border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
              <Store className="h-5 w-5 text-sky-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950">Official seller</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
          <h2 className="text-2xl font-semibold text-slate-950">Review & rating</h2>
          <div className="mt-6 space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-[24px] border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-950">{review.userName}</p>
                  <p className="text-sm text-slate-400">{review.createdAt}</p>
                </div>
                <p className="mt-2 text-sm text-amber-500">{"★".repeat(review.rating)}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-slate-950">Produk terkait</h2>
          <div className="grid gap-5">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
