"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Signup failed");
      setLoading(false);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-3xl text-chalk mb-8">Create an account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="rounded-lg bg-char-900 border border-char-700 px-4 py-3 text-chalk placeholder:text-chalk/40" />
          <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="rounded-lg bg-char-900 border border-char-700 px-4 py-3 text-chalk placeholder:text-chalk/40" />
        </div>
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg bg-char-900 border border-char-700 px-4 py-3 text-chalk placeholder:text-chalk/40" />
        <input required type="password" placeholder="Password (min 8 characters)" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg bg-char-900 border border-char-700 px-4 py-3 text-chalk placeholder:text-chalk/40" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-lime-400 text-char-950 py-3 font-semibold hover:bg-lime-500 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-chalk/50 mt-6">
        Already have an account?{" "}
        <Link href="/account/login" className="text-lime-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
