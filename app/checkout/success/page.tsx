import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Pembayaran berhasil</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Pesanan kamu sedang diproses</h1>
      <p className="max-w-xl text-sm leading-7 text-slate-600">
        Halaman sukses checkout ini siap dihubungkan dengan webhook Stripe untuk status order yang lebih akurat.
      </p>
      <Button className="mt-4" asChild>
        <Link href="/account/orders">Lihat Riwayat Pesanan</Link>
      </Button>
    </div>
  );
}
