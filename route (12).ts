import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminProductsPage() {
  const session = getSession();
  if (!session || session.role !== "ADMIN") redirect("/account/login");

  const products = await db.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-chalk">Products</h1>
        <Link href="/admin" className="text-sm text-chalk/60 hover:text-lime-400">← Dashboard</Link>
      </div>

      <div className="border border-char-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-char-900 text-chalk/50 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Variants / stock</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-char-700">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4 text-chalk font-medium">{p.name}</td>
                <td className="px-5 py-4 text-chalk/70">{p.category} · {p.proteinType}</td>
                <td className="px-5 py-4 font-tabular text-chalk">${Number(p.basePrice).toFixed(2)}</td>
                <td className="px-5 py-4 text-chalk/70">
                  {p.variants.map((v) => (
                    <div key={v.id}>{v.flavor} ({v.size}): {v.stock} in stock</div>
                  ))}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.active ? "bg-lime-400/20 text-lime-400" : "bg-chalk/10 text-chalk/50"}`}>
                    {p.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-chalk/50">
                  No products in the database yet — run <code className="text-lime-400">npm run db:seed</code>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-chalk/40 mt-4">
        Editing here calls the /api/products and /api/products/[id] routes — hook up a form here to POST/PATCH once you're ready to manage inventory live.
      </p>
    </div>
  );
}
