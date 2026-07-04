import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type UserRole = "USER" | "ADMIN";
type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  flashSale: boolean;
  flashSalePrice: number | null;
  tags: string[];
  images: string[];
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  stripeIntentId: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type OrderItemRow = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  productSlug: string;
};

type CartRow = {
  id: string;
  userId: string | null;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

type WishlistRow = {
  A: string;
  B: string;
};

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type Database = {
  public: {
    Tables: {
      User: Table<UserRow>;
      Category: Table<CategoryRow>;
      Product: Table<ProductRow>;
      Review: Table<ReviewRow>;
      Order: Table<OrderRow>;
      OrderItem: Table<OrderItemRow>;
      Cart: Table<CartRow>;
      _WishlistUsers: Table<WishlistRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      UserRole: UserRole;
      OrderStatus: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

type AppSupabaseClient = SupabaseClient<Database>;

declare global {
  var supabaseAdmin: AppSupabaseClient | undefined;
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: AppSupabaseClient | null =
  supabaseUrl && supabaseKey
    ? global.supabaseAdmin ??
      createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

if (process.env.NODE_ENV !== "production" && supabase) {
  global.supabaseAdmin = supabase;
}
