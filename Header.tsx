"use client";

import { useState } from "react";

const STATUSES = ["PENDING", "PAID", "FORWARDED_TO_SUPPLIER", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default function OrderStatusControl({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setStatus(newStatus);
    setSaving(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
    setSaving(false);
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className="text-xs bg-char-800 border border-char-700 rounded-lg px-2 py-1.5 text-chalk"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
      ))}
    </select>
  );
}
