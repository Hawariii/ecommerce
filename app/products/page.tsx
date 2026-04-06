import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getCategories, getProducts } from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Produk",
  description: "Katalog produk dengan search, filter, dan sorting.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categories = await getCategories();
  const result = await getProducts({
    page: Number(params.page ?? 1),
    search: typeof params.search === "string" ? params.search : "",
    category: typeof params.category === "string" ? params.category : undefined,
    sort: typeof params.sort === "string" ? params.sort : "terlaris",
    rating: Number(params.rating ?? 0),
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Katalog</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Semua produk</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Search bar, filter kategori, rating minimum, dan sorting untuk skenario marketplace berskala besar.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-5">
          <form className="space-y-4">
            <Input
              name="search"
              placeholder="Cari produk..."
              defaultValue={typeof params.search === "string" ? params.search : ""}
            />
            <Select
              name="category"
              defaultValue={typeof params.category === "string" ? params.category : ""}
              options={[
                { label: "Semua kategori", value: "" },
                ...categories.map((category) => ({ label: category.name, value: category.slug })),
              ]}
            />
            <Select
              name="sort"
              defaultValue={typeof params.sort === "string" ? params.sort : "terlaris"}
              options={[
                { label: "Terlaris", value: "terlaris" },
                { label: "Terbaru", value: "terbaru" },
                { label: "Termurah", value: "termurah" },
              ]}
            />
            <Select
              name="rating"
              defaultValue={String(params.rating ?? "0")}
              options={[
                { label: "Semua rating", value: "0" },
                { label: "4 ke atas", value: "4" },
                { label: "4.5 ke atas", value: "4.5" },
              ]}
            />
            <button
              type="submit"
              className="h-11 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white"
            >
              Terapkan Filter
            </button>
          </form>
        </Card>

        <div className="space-y-6">
          <p className="text-sm text-slate-500">Menampilkan {result.total} produk</p>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Halaman {result.currentPage} dari {result.totalPages}
            </p>
            <div className="flex gap-3">
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
                href={`/products?page=${Math.max(1, result.currentPage - 1)}`}
              >
                Sebelumnya
              </Link>
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
                href={`/products?page=${Math.min(result.totalPages, result.currentPage + 1)}`}
              >
                Berikutnya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
