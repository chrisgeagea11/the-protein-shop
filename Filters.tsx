"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close cart"
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-char-950/70"
      />
      <div className="relative w-full max-w-md bg-char-900 h-full flex flex-col border-l border-char-700">
        <div className="flex items-center justify-between px-6 py-5 border-b border-char-700">
          <h2 className="font-display text-lg text-chalk">Your cart</h2>
          <button onClick={() => setIsOpen(false)} className="text-chalk/60 hover:text-chalk" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 && <p className="text-chalk/50 text-sm">Your cart is empty. Go add something.</p>}
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-3 border-b border-char-700 pb-4">
              <div className="w-16 h-16 bg-char-800 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-chalk font-medium truncate">{item.productName}</p>
                <p className="text-xs text-chalk/50">{item.flavor} · {item.size}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-char-800 text-chalk hover:bg-char-700"
                    >
                      −
                    </button>
                    <span className="text-sm font-tabular w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-char-800 text-chalk hover:bg-char-700"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-tabular text-sm text-lime-400">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.variantId)}
                aria-label={`Remove ${item.productName} from cart`}
                className="text-chalk/40 hover:text-chalk text-sm self-start"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-char-700 px-6 py-5 space-y-4">
            <div className="flex justify-between text-chalk">
              <span>Subtotal</span>
              <span className="font-tabular font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block text-center rounded-full bg-lime-400 text-char-950 py-3 font-semibold hover:bg-lime-500 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
