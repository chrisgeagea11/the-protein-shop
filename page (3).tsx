import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-2xl border border-char-700 bg-char-900 overflow-hidden hover:border-lime-400/60 transition-colors"
    >
      <div className="aspect-square bg-char-800 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-chalk/20 font-display text-sm">
          {product.name.split(" ").slice(0, 2).join(" ")}
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[80%]">
          {product.dietaryTags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-wide bg-char-950/80 text-lime-400 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-chalk/40 mb-1">
          {product.proteinType} · {product.category}
        </p>
        <h3 className="font-semibold text-chalk group-hover:text-lime-400 transition-colors leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <span className="font-display text-lime-400">${product.basePrice.toFixed(2)}</span>
          <span className="text-xs text-chalk/50 font-tabular">★ {product.rating} ({product.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
