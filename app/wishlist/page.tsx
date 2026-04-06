import { ProductCard } from "@/components/product/product-card";
import { Card } from "@/components/ui/card";
import { products } from "@/lib/sample-data";

export default function WishlistPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Wishlist</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Produk favorit</h1>
      </div>
      <Card className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Card>
    </div>
  );
}
