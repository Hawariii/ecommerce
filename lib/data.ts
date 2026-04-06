import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { dashboardStats, categories, orderHistory, products } from "@/lib/sample-data";
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

function mapReview(review: {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: { name: string | null } | null;
}): Review {
  return {
    id: review.id,
    userName: review.user?.name ?? "User",
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString().slice(0, 10),
  };
}

function mapProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: { toNumber(): number };
  compareAtPrice: { toNumber(): number } | null;
  flashSalePrice: { toNumber(): number } | null;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  flashSale: boolean;
  tags: string[];
  images: string[];
  category: { name: string; slug: string };
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    user?: { name: string | null } | null;
  }[];
}): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber(),
    flashSalePrice: product.flashSalePrice?.toNumber(),
    stock: product.stock,
    soldCount: product.soldCount,
    rating: product.rating,
    reviewCount: product.reviewCount,
    featured: product.featured,
    flashSale: product.flashSale,
    category: product.category.name,
    categorySlug: product.category.slug,
    tags: product.tags,
    images: product.images,
    reviews: product.reviews?.map(mapReview) ?? [],
  };
}

function mapOrderStatus(status: string): OrderSummary["status"] {
  if (status === "PENDING") return "Pending";
  if (status === "PAID") return "Paid";
  if (status === "PROCESSING") return "Processing";
  if (status === "SHIPPED") return "Shipped";
  return "Delivered";
}

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  if (prisma) {
    const categoryList = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return categoryList.map<Category>((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? "",
      productCount: category._count.products,
    }));
  }

  return categories;
}

export async function getHomePageData() {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  if (prisma) {
    const [categoryList, featuredProducts, flashSaleProducts, recommendationProducts] = await Promise.all([
      getCategories(),
      prisma.product.findMany({
        where: { featured: true },
        include: { category: true },
        take: 4,
        orderBy: [{ soldCount: "desc" }],
      }),
      prisma.product.findMany({
        where: { flashSale: true },
        include: { category: true },
        take: 4,
        orderBy: [{ soldCount: "desc" }],
      }),
      prisma.product.findMany({
        include: { category: true },
        take: 4,
        orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      }),
    ]);

    return {
      categories: categoryList,
      featuredProducts: featuredProducts.map(mapProduct),
      flashSaleProducts: flashSaleProducts.map(mapProduct),
      recommendationProducts: recommendationProducts.map(mapProduct),
    };
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

  if (prisma) {
    const pageSize = 4;
    const where = {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
      category: category
        ? {
            slug: category,
          }
        : undefined,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      rating: {
        gte: rating,
      },
    };

    const orderBy =
      sort === "termurah"
        ? [{ price: "asc" as const }]
        : sort === "terbaru"
          ? [{ createdAt: "desc" as const }]
          : [{ soldCount: "desc" as const }];

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: items.map(mapProduct),
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      currentPage: page,
    };
  }

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

  if (prisma) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return product ? mapProduct(product) : null;
  }

  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(categorySlug: string, currentSlug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  if (prisma) {
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
        NOT: {
          slug: currentSlug,
        },
      },
      include: { category: true },
      take: 4,
      orderBy: [{ soldCount: "desc" }],
    });

    return relatedProducts.map(mapProduct);
  }

  return products
    .filter((product) => product.categorySlug === categorySlug && product.slug !== currentSlug)
    .slice(0, 4);
}

export async function getOrderHistory() {
  if (prisma) {
    const orders = await prisma.order.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return orders.map<OrderSummary>((order) => ({
      id: order.id,
      createdAt: order.createdAt.toISOString().slice(0, 10),
      status: mapOrderStatus(order.status),
      total: order.total.toNumber(),
      items: order._count.items,
    }));
  }

  return orderHistory;
}

export async function getUserOrderHistory(userId?: string) {
  if (prisma && userId) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return orders.map<OrderSummary>((order) => ({
      id: order.id,
      createdAt: order.createdAt.toISOString().slice(0, 10),
      status: mapOrderStatus(order.status),
      total: order.total.toNumber(),
      items: order._count.items,
    }));
  }

  return orderHistory;
}

export async function getDashboardStats() {
  if (prisma) {
    const [revenueAgg, activeOrders, productCount, newUsers] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: {
            in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
          },
        },
      }),
      prisma.order.count({
        where: {
          status: {
            in: ["PENDING", "PAID", "PROCESSING", "SHIPPED"],
          },
        },
      }),
      prisma.product.count(),
      prisma.user.count(),
    ]);

    const revenue = revenueAgg._sum.total?.toNumber() ?? 0;

    return [
      {
        label: "Revenue Total",
        value: formatCurrency(revenue),
        description: "Akumulasi order non-cancelled di database",
      },
      {
        label: "Pesanan Aktif",
        value: String(activeOrders),
        description: "Order yang masih berjalan",
      },
      {
        label: "Produk Aktif",
        value: String(productCount),
        description: "Total katalog yang tersedia",
      },
      {
        label: "Pelanggan",
        value: String(newUsers),
        description: "Total user yang tersimpan",
      },
    ] satisfies DashboardStat[];
  }

  return dashboardStats;
}

export async function getAdminProducts() {
  if (prisma) {
    const items = await prisma.product.findMany({
      include: { category: true },
      orderBy: [{ createdAt: "desc" }],
      take: 12,
    });

    return items.map(mapProduct);
  }

  return products;
}

export async function getAdminUsers() {
  if (prisma) {
    return prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  return [
    { id: "demo-admin", name: "Admin Hawari", email: "admin@hawari.test", role: "ADMIN" },
    { id: "demo-user", name: "User Demo", email: "user@hawari.test", role: "USER" },
  ];
}

export async function getWishlistProducts(userId?: string) {
  if (prisma && userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlist: {
          include: { category: true },
          orderBy: [{ createdAt: "desc" }],
          take: 8,
        },
      },
    });

    if (user?.wishlist.length) {
      return user.wishlist.map(mapProduct);
    }
  }

  if (prisma) {
    const items = await prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 4,
      orderBy: [{ rating: "desc" }],
    });

    return items.map(mapProduct);
  }

  return products.slice(0, 4);
}
