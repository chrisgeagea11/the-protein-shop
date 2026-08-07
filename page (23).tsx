"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-3xl text-chalk mb-8">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-char-900 border border-char-700 px-4 py-3 text-chalk placeholder:text-chalk/40"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-char-900 border border-char-700 px-4 py-3 text-chalk placeholder:text-chalk/40"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-lime-400 text-char-950 py-3 font-semibold hover:bg-lime-500 transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-sm text-chalk/50 mt-6">
        No account yet?{" "}
        <Link href="/account/signup" className="text-lime-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
