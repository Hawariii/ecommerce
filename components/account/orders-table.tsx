import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { OrderSummary } from "@/types";

export function OrdersTable({ orders }: { orders: OrderSummary[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-medium">Invoice</th>
            <th className="px-5 py-4 font-medium">Tanggal</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 font-medium">Item</th>
            <th className="px-5 py-4 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100">
              <td className="px-5 py-4 font-medium text-slate-950">{order.id}</td>
              <td className="px-5 py-4 text-slate-600">{order.createdAt}</td>
              <td className="px-5 py-4">
                <Badge className="bg-slate-100 text-slate-700">{order.status}</Badge>
              </td>
              <td className="px-5 py-4 text-slate-600">{order.items}</td>
              <td className="px-5 py-4 font-medium text-slate-950">{formatCurrency(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
