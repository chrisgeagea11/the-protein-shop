import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Payment pending",
  PAID: "Processing",
  FORWARDED_TO_SUPPLIER: "Preparing shipment",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default async function AccountPage() {
  const session = getSession();
  if (!session) redirect("/account/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { addresses: true },
  });

  const orders = await db.order.findMany({
    where: { userId: session.userId },
    include: { items: { include: { variant: { include: { product: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-chalk">Hey, {user?.firstName ?? "there"}</h1>
          <p className="text-chalk/50 text-sm mt-1">{user?.email}</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="text-sm text-chalk/60 hover:text-lime-400">Log out</button>
        </form>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-xl text-chalk mb-4">Order history</h2>
        {orders.length === 0 ? (
          <p className="text-chalk/50 text-sm">
            No orders yet. <Link href="/products" className="text-lime-400 hover:underline">Start shopping →</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border border-char-700 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-chalk font-semibold">Order #{order.id.slice(-8)}</p>
                  <p className="text-chalk/50 text-sm">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lime-400 font-tabular font-semibold">${(order.totalCts / 100).toFixed(2)}</p>
                  <p className="text-xs text-chalk/50">{STATUS_LABELS[order.status] ?? order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-chalk mb-4">Saved addresses</h2>
        {!user?.addresses.length ? (
          <p className="text-chalk/50 text-sm">No saved addresses yet — add one at checkout.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div key={addr.id} className="border border-char-700 rounded-2xl p-4 text-sm text-chalk/70">
                <p className="text-chalk font-semibold mb-1">{addr.label}</p>
                <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                <p>{addr.city}, {addr.region} {addr.postalCode}</p>
                <p>{addr.country}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
