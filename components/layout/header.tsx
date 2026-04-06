import Link from "next/link";
import { Heart, Search, ShoppingCart, Sparkles, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSearchSuggestions } from "@/lib/data";

export async function Header() {
  const suggestions = await getSearchSuggestions();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#f7f8f4]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#065f46,#0f766e)] text-white shadow-lg shadow-emerald-900/10">
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
              list="product-suggestions"
              placeholder="Cari produk, brand, atau kategori..."
              className="rounded-full border-white/70 bg-white/90 pl-10 shadow-sm"
            />
            <datalist id="product-suggestions">
              {suggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
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

        <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-medium text-slate-600 xl:flex">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span>Search suggestion aktif</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="rounded-full border border-white/60 bg-white/70 p-2 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-white"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-white/60 bg-white/70 p-2 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-white"
          >
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
