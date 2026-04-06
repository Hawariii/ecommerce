import Link from "next/link";
import { Heart, Search, ShoppingCart, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#fffaf3]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">Hawari Commerce</p>
            <p className="text-xs text-slate-500">Marketplace modern</p>
          </div>
        </Link>

        <form action="/products" className="hidden flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="search"
              placeholder="Cari produk, brand, atau kategori..."
              className="border-slate-200 bg-white pl-10"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-5 text-sm text-slate-600 lg:flex">
          <Link href="/products" className="hover:text-slate-950">
            Produk
          </Link>
          <Link href="/wishlist" className="hover:text-slate-950">
            Wishlist
          </Link>
          <Link href="/account" className="hover:text-slate-950">
            Akun
          </Link>
          <Link href="/admin" className="hover:text-slate-950">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/wishlist" className="rounded-full p-2 text-slate-600 hover:bg-white">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="rounded-full p-2 text-slate-600 hover:bg-white">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Button variant="dark" size="sm" asChild>
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
