import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import OrderStatusControl from "@/components/OrderStatusControl";

export default async function AdminOrdersPage() {
  const session = getSession();
  if (!session || session.role !== "ADMIN") redirect("/account/login");

  const orders = await db.order.findMany({
    include: { items: { include: { variant: { include: { product: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-chalk">Orders</h1>
        <Link href="/admin" className="text-sm text-chalk/60 hover:text-lime-400">← Dashboard</Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-char-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-chalk font-semibold">#{order.id.slice(-8)} · {order.email}</p>
                <p className="text-chalk/50 text-xs">
                  {new Date(order.createdAt).toLocaleString()}
                  {order.supplierOrderId && ` · Supplier order ${order.supplierOrderId}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-tabular text-lime-400 font-semibold">${(order.totalCts / 100).toFixed(2)}</span>
                <OrderStatusControl orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
            <div className="text-sm text-chalk/70 space-y-1">
              {order.items.map((item) => (
                <p key={item.id}>
                  {item.variant.product.name} — {item.variant.flavor} ({item.variant.size}) x{item.quantity}
                </p>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-chalk/50 text-sm">No orders yet.</p>}
      </div>
    </div>
  );
}
