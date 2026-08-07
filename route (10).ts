import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const session = getSession();
  if (!session || session.role !== "ADMIN") redirect("/account/login");

  const [orderCount, totalRevenue, topProductRows, recentOrders] = await Promise.all([
    db.order.count({ where: { status: { not: "CANCELLED" } } }),
    db.order.aggregate({ _sum: { totalCts: true }, where: { status: { not: "CANCELLED" } } }),
    db.orderItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    db.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ]);

  const topVariants = await db.variant.findMany({
    where: { id: { in: topProductRows.map((r) => r.variantId) } },
    include: { product: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl text-chalk">Admin dashboard</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin/products" className="text-chalk/70 hover:text-lime-400">Products</Link>
          <Link href="/admin/orders" className="text-chalk/70 hover:text-lime-400">Orders</Link>
        </nav>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        <div className="border border-char-700 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-chalk/40 mb-2">Total orders</p>
          <p className="font-display text-3xl text-chalk">{orderCount}</p>
        </div>
        <div className="border border-char-700 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-chalk/40 mb-2">Total revenue</p>
          <p className="font-display text-3xl text-lime-400">
            ${((totalRevenue._sum.totalCts ?? 0) / 100).toFixed(2)}
          </p>
        </div>
        <div className="border border-char-700 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-chalk/40 mb-2">Avg. order value</p>
          <p className="font-display text-3xl text-chalk">
            ${orderCount ? ((totalRevenue._sum.totalCts ?? 0) / orderCount / 100).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-xl text-chalk mb-4">Top-selling products</h2>
        <div className="border border-char-700 rounded-2xl divide-y divide-char-700">
          {topVariants.length === 0 && <p className="p-5 text-chalk/50 text-sm">No sales yet.</p>}
          {topProductRows.map((row) => {
            const variant = topVariants.find((v) => v.id === row.variantId);
            if (!variant) return null;
            return (
              <div key={row.variantId} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-chalk font-medium">{variant.product.name}</p>
                  <p className="text-chalk/50 text-sm">{variant.flavor} · {variant.size}</p>
                </div>
                <p className="font-tabular text-lime-400">{row._sum.quantity} sold</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-chalk mb-4">Recent orders</h2>
        <div className="border border-char-700 rounded-2xl divide-y divide-char-700">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-5">
              <div>
                <p className="text-chalk font-medium">#{order.id.slice(-8)}</p>
                <p className="text-chalk/50 text-sm">{order.email}</p>
              </div>
              <div className="text-right">
                <p className="font-tabular text-chalk">${(order.totalCts / 100).toFixed(2)}</p>
                <p className="text-xs text-chalk/50">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
