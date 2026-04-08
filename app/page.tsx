import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductShowcase } from "@/components/home/product-showcase";
import { getHomePageData } from "@/lib/data";

export default async function Home() {
  const data = await getHomePageData();

  return (
    <div className="pb-10">
      <HeroSection />
      <CategoryGrid categories={data.categories} />
      <ProductShowcase
        eyebrow="Produk Pilihan"
        title="Rekomendasi berdasarkan performa penjualan"
        description="Produk dengan conversion tinggi dan rating terbaik untuk mempercepat keputusan belanja."
        products={data.recommendationProducts}
      />
      <ProductShowcase
        eyebrow="Flash Sale"
        title="Harga spesial dengan stok terbatas"
        description="Blok promo prioritas untuk mendorong urgency dan CTR seperti experience marketplace besar."
        products={data.flashSaleProducts}
      />
    </div>
  );
}
