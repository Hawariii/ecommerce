import { cacheLife, cacheTag } from "next/cache";

import { dashboardStats, categories, orderHistory, products } from "@/lib/sample-data";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import type { Category, DashboardStat, OrderSummary, Product, Review } from "@/types";

type ProductQuery = {
  page?: number;
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  compareAtPrice: number | string | null;
  flashSalePrice: number | string | null;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  flashSale: boolean;
  tags: string[] | null;
  images: string[] | null;
  Category?: CategoryRow | CategoryRow[] | null;
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  User?: { name: string | null } | { name: string | null }[] | null;
};

type OrderWithItems = {
  id: string;
  createdAt: string;
  status: string;
  total: number | string;
  OrderItem?: { id: string }[] | null;
};

function logDataError(scope: string, error: unknown) {
  console.error(`[data:${scope}]`, error);
}

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: number | string | null | undefined) {
  return value == null ? undefined : Number(value);
}

function getFallbackProducts(query: ProductQuery = {}) {
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

function mapReview(review: ReviewRow): Review {
  const user = firstRelation(review.User);

  return {
    id: review.id,
    userName: user?.name ?? "User",
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.slice(0, 10),
  };
}

function mapProduct(product: ProductRow & { Review?: ReviewRow[] | null }): Product {
  const category = firstRelation(product.Category);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: toNumber(product.price) ?? 0,
    compareAtPrice: toNumber(product.compareAtPrice),
    flashSalePrice: toNumber(product.flashSalePrice),
    stock: product.stock,
    soldCount: product.soldCount,
    rating: product.rating,
    reviewCount: product.reviewCount,
    featured: product.featured,
    flashSale: product.flashSale,
    category: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "uncategorized",
    tags: product.tags ?? [],
    images: product.images ?? [],
    reviews: product.Review?.map(mapReview) ?? [],
  };
}

function mapOrderStatus(status: string): OrderSummary["status"] {
  if (status === "PENDING") return "Pending";
  if (status === "PAID") return "Paid";
  if (status === "PROCESSING") return "Processing";
  if (status === "SHIPPED") return "Shipped";
  return "Delivered";
}

async function fetchProductsByIds(ids: string[]) {
  if (!supabase || ids.length === 0) return [];

  const { data, error } = await supabase
    .from("Product")
    .select("*, Category(name, slug)")
    .in("id", ids);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => mapProduct(item as ProductRow));
}

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  if (supabase) {
    try {
      const [{ data: categoryList, error }, { data: productRows, error: countError }] = await Promise.all([
        supabase.from("Category").select("id,name,slug,description,image").order("name", { ascending: true }),
        supabase.from("Product").select("categoryId"),
      ]);

      if (error) throw error;
      if (countError) throw countError;

      const productCounts = new Map<string, number>();
      for (const row of productRows ?? []) {
        productCounts.set(row.categoryId, (productCounts.get(row.categoryId) ?? 0) + 1);
      }

      return (categoryList ?? []).map<Category>((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        image: category.image ?? "",
        productCount: productCounts.get(category.id) ?? 0,
      }));
    } catch (error) {
      logDataError("getCategories", error);
    }
  }

  return categories;
}

export async function getSearchSuggestions() {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Product")
        .select("name")
        .order("soldCount", { ascending: false })
        .order("rating", { ascending: false })
        .limit(8);

      if (error) throw error;
      return (data ?? []).map((item) => item.name);
    } catch (error) {
      logDataError("getSearchSuggestions", error);
    }
  }

  return products.slice(0, 8).map((product) => product.name);
}

export async function getHomePageData() {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  if (supabase) {
    try {
      const [categoryList, featuredResult, flashSaleResult, recommendationResult] = await Promise.all([
        getCategories(),
        supabase
          .from("Product")
          .select("*, Category(name, slug)")
          .eq("featured", true)
          .order("soldCount", { ascending: false })
          .limit(4),
        supabase
          .from("Product")
          .select("*, Category(name, slug)")
          .eq("flashSale", true)
          .order("soldCount", { ascending: false })
          .limit(4),
        supabase
          .from("Product")
          .select("*, Category(name, slug)")
          .order("rating", { ascending: false })
          .order("reviewCount", { ascending: false })
          .limit(4),
      ]);

      if (featuredResult.error) throw featuredResult.error;
      if (flashSaleResult.error) throw flashSaleResult.error;
      if (recommendationResult.error) throw recommendationResult.error;

      return {
        categories: categoryList,
        featuredProducts: (featuredResult.data ?? []).map((item) => mapProduct(item as ProductRow)),
        flashSaleProducts: (flashSaleResult.data ?? []).map((item) => mapProduct(item as ProductRow)),
        recommendationProducts: (recommendationResult.data ?? []).map((item) => mapProduct(item as ProductRow)),
      };
    } catch (error) {
      logDataError("getHomePageData", error);
    }
  }

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

  if (supabase) {
    try {
      const pageSize = 4;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let request = supabase
        .from("Product")
        .select("*, Category!inner(name, slug)", { count: "exact" })
        .ilike("name", `%${search}%`)
        .gte("price", minPrice)
        .lte("price", maxPrice)
        .gte("rating", rating)
        .range(from, to);

      if (category) {
        request = request.eq("Category.slug", category);
      }

      if (sort === "termurah") {
        request = request.order("price", { ascending: true });
      } else if (sort === "terbaru") {
        request = request.order("createdAt", { ascending: false });
      } else {
        request = request.order("soldCount", { ascending: false });
      }

      const { data, count, error } = await request;
      if (error) throw error;

      return {
        items: (data ?? []).map((item) => mapProduct(item as ProductRow)),
        total: count ?? 0,
        totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
        currentPage: page,
      };
    } catch (error) {
      logDataError("getProducts", error);
    }
  }

  return getFallbackProducts(query);
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  if (supabase) {
    try {
      const { data: product, error } = await supabase
        .from("Product")
        .select("*, Category(name, slug)")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!product) return null;

      const productRow = product as ProductRow;

      const { data: reviews, error: reviewError } = await supabase
        .from("Review")
        .select("id,rating,comment,createdAt,User(name)")
        .eq("productId", productRow.id)
        .order("createdAt", { ascending: false });

      if (reviewError) throw reviewError;

      return mapProduct({
        ...productRow,
        Review: (reviews ?? []) as ReviewRow[],
      });
    } catch (error) {
      logDataError("getProductBySlug", error);
    }
  }

  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(categorySlug: string, currentSlug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Product")
        .select("*, Category!inner(name, slug)")
        .eq("Category.slug", categorySlug)
        .neq("slug", currentSlug)
        .order("soldCount", { ascending: false })
        .limit(4);

      if (error) throw error;
      return (data ?? []).map((item) => mapProduct(item as ProductRow));
    } catch (error) {
      logDataError("getRelatedProducts", error);
    }
  }

  return products
    .filter((product) => product.categorySlug === categorySlug && product.slug !== currentSlug)
    .slice(0, 4);
}

export async function getOrderHistory() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Order")
        .select("id,createdAt,status,total,OrderItem(id)")
        .order("createdAt", { ascending: false })
        .limit(10);

      if (error) throw error;

      return ((data ?? []) as OrderWithItems[]).map<OrderSummary>((order) => ({
        id: order.id,
        createdAt: order.createdAt.slice(0, 10),
        status: mapOrderStatus(order.status),
        total: Number(order.total),
        items: order.OrderItem?.length ?? 0,
      }));
    } catch (error) {
      logDataError("getOrderHistory", error);
    }
  }

  return orderHistory;
}

export async function getUserOrderHistory(userId?: string) {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("Order")
        .select("id,createdAt,status,total,OrderItem(id)")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .limit(10);

      if (error) throw error;

      return ((data ?? []) as OrderWithItems[]).map<OrderSummary>((order) => ({
        id: order.id,
        createdAt: order.createdAt.slice(0, 10),
        status: mapOrderStatus(order.status),
        total: Number(order.total),
        items: order.OrderItem?.length ?? 0,
      }));
    } catch (error) {
      logDataError("getUserOrderHistory", error);
    }
  }

  return orderHistory;
}

export async function getDashboardStats() {
  if (supabase) {
    try {
      const [ordersResult, activeOrdersResult, productResult, userResult] = await Promise.all([
        supabase.from("Order").select("total").in("status", ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]),
        supabase
          .from("Order")
          .select("id", { count: "exact", head: true })
          .in("status", ["PENDING", "PAID", "PROCESSING", "SHIPPED"]),
        supabase.from("Product").select("id", { count: "exact", head: true }),
        supabase.from("User").select("id", { count: "exact", head: true }),
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (activeOrdersResult.error) throw activeOrdersResult.error;
      if (productResult.error) throw productResult.error;
      if (userResult.error) throw userResult.error;

      const revenue = (ordersResult.data ?? []).reduce((sum, order) => sum + Number(order.total), 0);

      return [
        {
          label: "Revenue Total",
          value: formatCurrency(revenue),
          description: "Akumulasi order non-cancelled di database",
        },
        {
          label: "Pesanan Aktif",
          value: String(activeOrdersResult.count ?? 0),
          description: "Order yang masih berjalan",
        },
        {
          label: "Produk Aktif",
          value: String(productResult.count ?? 0),
          description: "Total katalog yang tersedia",
        },
        {
          label: "Pelanggan",
          value: String(userResult.count ?? 0),
          description: "Total user yang tersimpan",
        },
      ] satisfies DashboardStat[];
    } catch (error) {
      logDataError("getDashboardStats", error);
    }
  }

  return dashboardStats;
}

export async function getAdminProducts() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Product")
        .select("*, Category(name, slug)")
        .order("createdAt", { ascending: false })
        .limit(12);

      if (error) throw error;
      return (data ?? []).map((item) => mapProduct(item as ProductRow));
    } catch (error) {
      logDataError("getAdminProducts", error);
    }
  }

  return products;
}

export async function getAdminUsers() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("User")
        .select("id,name,email,role")
        .order("createdAt", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logDataError("getAdminUsers", error);
    }
  }

  return [
    { id: "demo-admin", name: "Admin Hawari", email: "admin@hawari.test", role: "ADMIN" },
    { id: "demo-user", name: "User Demo", email: "user@hawari.test", role: "USER" },
  ];
}

export async function getWishlistProducts(userId?: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("wishlist");

  if (supabase && userId) {
    try {
      const { data: wishlistRows, error } = await supabase
        .from("_WishlistUsers")
        .select("A")
        .eq("B", userId)
        .limit(8);

      if (error) throw error;

      const wishlistProducts = await fetchProductsByIds((wishlistRows ?? []).map((row) => row.A));
      if (wishlistProducts.length) {
        return wishlistProducts;
      }
    } catch (error) {
      logDataError("getWishlistProducts:user", error);
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Product")
        .select("*, Category(name, slug)")
        .eq("featured", true)
        .order("rating", { ascending: false })
        .limit(4);

      if (error) throw error;
      return (data ?? []).map((item) => mapProduct(item as ProductRow));
    } catch (error) {
      logDataError("getWishlistProducts:fallback", error);
    }
  }

  return products.slice(0, 4);
}
