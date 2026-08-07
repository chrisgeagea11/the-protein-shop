"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export default function ProductOptions({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const variant = product.variants.find((v) => v.id === variantId)!;
  const price = product.basePrice + variant.priceDelta;

  function handleAdd() {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      image: product.images[0],
      variantId: variant.id,
      flavor: variant.flavor,
      size: variant.size,
      price,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-chalk/40 mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                v.id === variantId
                  ? "bg-lime-400 border-lime-400 text-char-950 font-semibold"
                  : "border-char-700 text-chalk/70 hover:border-lime-400/60"
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-display text-3xl text-lime-400">${price.toFixed(2)}</span>
        {variant.stock <= 15 && variant.stock > 0 && (
          <span className="text-xs text-chalk/50">Only {variant.stock} left</span>
        )}
        {variant.stock === 0 && <span className="text-xs text-red-400">Out of stock</span>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 border border-char-700 rounded-full px-4 py-2">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span className="font-tabular w-4 text-center">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={variant.stock === 0}
          className="flex-1 rounded-full bg-lime-400 text-char-950 py-3 font-semibold hover:bg-lime-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
