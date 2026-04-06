import { OrdersTable } from "@/components/account/orders-table";
import { getOrderHistory } from "@/lib/data";

export default async function AdminOrdersPage() {
  const orders = await getOrderHistory();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Kelola pesanan</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
