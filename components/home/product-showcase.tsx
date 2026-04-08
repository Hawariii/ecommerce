import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProductShowcase({
  eyebrow,
  title,
  description,
  products,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
}) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
