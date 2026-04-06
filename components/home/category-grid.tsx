import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatCompactNumber } from "@/lib/utils";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Kategori"
          title="Navigasi katalog yang langsung terasa familiar"
          description="Kategori utama ditata untuk mempercepat discovery dari mobile maupun desktop."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-950">{category.name}</h3>
                  <span className="text-sm text-slate-500">{formatCompactNumber(category.productCount)} item</span>
                </div>
                <p className="text-sm leading-7 text-slate-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
