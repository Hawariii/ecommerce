import type { Metadata } from "next";

import { checkoutAction } from "@/app/actions/checkout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SHIPPING_COST } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <form action={checkoutAction} className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Checkout</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Alamat & pembayaran</h1>
        </div>

        <Card className="grid gap-4 p-6 md:grid-cols-2">
          <Input name="fullName" placeholder="Nama lengkap" />
          <Input name="phone" placeholder="Nomor telepon" />
          <Input name="addressLine1" placeholder="Alamat utama" className="md:col-span-2" />
          <Input name="addressLine2" placeholder="Catatan alamat (opsional)" className="md:col-span-2" />
          <Input name="city" placeholder="Kota" />
          <Input name="province" placeholder="Provinsi" />
          <Input name="postalCode" placeholder="Kode pos" />
          <Input name="country" placeholder="Negara" defaultValue="Indonesia" />
        </Card>

        <button type="submit" className="h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white">
          Bayar dengan Stripe
        </button>
      </form>

      <Card className="h-fit p-6">
        <h2 className="text-lg font-semibold text-slate-950">Ringkasan pesanan</h2>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(1819000)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ongkir</span>
            <span>{formatCurrency(SHIPPING_COST)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950">
            <span>Total</span>
            <span>{formatCurrency(1819000 + SHIPPING_COST)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
