import { upsertProductAction } from "@/app/actions/admin";
import { ProductCard } from "@/components/product/product-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminProducts } from "@/lib/data";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
      <Card className="h-fit p-6">
        <h1 className="text-2xl font-semibold text-slate-950">Tambah / edit produk</h1>
        <form action={upsertProductAction} className="mt-6 space-y-4">
          <Input name="name" placeholder="Nama produk" />
          <Input name="price" placeholder="Harga" />
          <Input name="stock" placeholder="Stok" />
          <Textarea name="description" placeholder="Deskripsi produk" />
          <button className="h-11 w-full rounded-full bg-slate-950 text-sm font-semibold text-white" type="submit">
            Simpan produk
          </button>
        </form>
      </Card>
      <div className="grid gap-5 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
