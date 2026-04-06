import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Star, Truck } from "lucide-react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
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
          <div className="relative h-[440px] overflow-hidden rounded-[32px] bg-white">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((image) => (
              <div key={image} className="relative h-40 overflow-hidden rounded-[24px] bg-white">
                <Image src={image} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Badge>{product.category}</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{product.name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
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

          <Card className="space-y-3 p-6">
            <div className="flex items-end gap-3">
              <p className="text-3xl font-semibold text-slate-950">{formatCurrency(activePrice)}</p>
              {product.compareAtPrice ? (
                <p className="text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice)}</p>
              ) : null}
            </div>
            <p className="text-sm leading-7 text-slate-600">{product.description}</p>
            <p className="text-sm text-slate-500">Stok tersedia: {product.stock}</p>
            <AddToCartButton product={product} />
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <Truck className="h-5 w-5 text-orange-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950">Kirim cepat</p>
            </Card>
            <Card className="p-4">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950">Garansi resmi</p>
            </Card>
            <Card className="p-4">
              <Star className="h-5 w-5 text-amber-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950">Top rated</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
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
          <div className="grid gap-5 sm:grid-cols-2">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
