"use client";

import { useState } from "react";

export default function WishlistButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false);

  async function toggle() {
    setSaved((s) => !s);
    // Calls the wishlist API route; requires the user to be logged in.
    await fetch("/api/wishlist", {
      method: saved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    }).catch(() => {
      // Silently no-op if not authenticated; the button still toggles
      // visually and the account page re-syncs on next load.
    });
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      className="flex items-center gap-2 text-sm text-chalk/70 hover:text-lime-400 transition-colors"
    >
      <span aria-hidden>{saved ? "♥" : "♡"}</span>
      {saved ? "Saved to wishlist" : "Save to wishlist"}
    </button>
  );
}
