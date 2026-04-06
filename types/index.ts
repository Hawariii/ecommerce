export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

export type Review = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  flashSalePrice?: number;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  flashSale?: boolean;
  category: string;
  categorySlug: string;
  tags: string[];
  images: string[];
  reviews: Review[];
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
};

export type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type OrderSummary = {
  id: string;
  createdAt: string;
  status: "Pending" | "Paid" | "Processing" | "Shipped" | "Delivered";
  total: number;
  items: number;
};

export type DashboardStat = {
  label: string;
  value: string;
  description: string;
};
