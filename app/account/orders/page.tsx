import { OrdersTable } from "@/components/account/orders-table";
import { getOrderHistory } from "@/lib/data";

export default async function OrdersPage() {
  const orders = await getOrderHistory();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Order History</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Riwayat pesanan</h1>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
