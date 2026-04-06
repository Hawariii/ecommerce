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
      <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,#fffdf8,#ffffff_45%,#eef7ff)] p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)] sm:p-8 sm:rounded-[36px]">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="relative space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Katalog</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Semua produk</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Discovery dibuat cepat dan bersih: search, filter, sorting, dan pagination dalam satu flow yang enak dipakai.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-medium text-slate-600">
            <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">Realtime search-ready</span>
            <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">Server rendered filters</span>
            <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">SEO-friendly catalog</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit border-white/70 bg-white/85 p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5 lg:sticky lg:top-24">
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
          <div className="flex flex-col gap-2 rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div>
              <p className="text-sm text-slate-500">Menampilkan {result.total} produk</p>
              <p className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">
                Kurasi katalog dengan visual marketplace yang lebih premium
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Page {result.currentPage}</div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-sm text-slate-500">
              Halaman {result.currentPage} dari {result.totalPages}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm text-slate-600"
                href={`/products?page=${Math.max(1, result.currentPage - 1)}`}
              >
                Sebelumnya
              </Link>
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm text-slate-600"
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
