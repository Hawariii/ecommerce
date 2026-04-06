import { cacheLife, cacheTag } from "next/cache";

import { dashboardStats, categories, orderHistory, products } from "@/lib/sample-data";

type ProductQuery = {
  page?: number;
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
};

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return categories;
}

export async function getHomePageData() {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  return {
    categories,
    featuredProducts: products.filter((product) => product.featured).slice(0, 4),
    flashSaleProducts: products.filter((product) => product.flashSale).slice(0, 4),
    recommendationProducts: [...products].sort((a, b) => b.rating - a.rating).slice(0, 4),
  };
}

export async function getProducts(query: ProductQuery = {}) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const {
    page = 1,
    search = "",
    category,
    sort = "terlaris",
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    rating = 0,
  } = query;

  const filtered = products
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    .filter((product) => (category ? product.categorySlug === category : true))
    .filter((product) => product.price >= minPrice && product.price <= maxPrice)
    .filter((product) => product.rating >= rating);

  const sorted = filtered.sort((a, b) => {
    if (sort === "termurah") return a.price - b.price;
    if (sort === "terbaru") return b.id.localeCompare(a.id);
    return b.soldCount - a.soldCount;
  });

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return {
    items: paginated,
    total: sorted.length,
    totalPages,
    currentPage: page,
  };
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(categorySlug: string, currentSlug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  return products
    .filter((product) => product.categorySlug === categorySlug && product.slug !== currentSlug)
    .slice(0, 4);
}

export async function getOrderHistory() {
  "use cache";
  cacheLife("minutes");
  cacheTag("orders");
  return orderHistory;
}

export async function getDashboardStats() {
  "use cache";
  cacheLife("minutes");
  cacheTag("admin");
  return dashboardStats;
}
