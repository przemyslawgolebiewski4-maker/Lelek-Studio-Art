"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminInput, AdminButton } from "@/components/admin/AdminShell";
import { apiPost } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await apiPost("/auth/login", { email, password });
    const data = await res.json();

    if (!res.ok || !data.ok) {
      setError(data.error ?? "Login failed");
      setLoading(false);
      return;
    }

    const from = searchParams.get("from") || "/admin";
    router.push(from);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md border border-sand/20 bg-peat/30 p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">Lelek Studio</p>
        <h1 className="mt-2 font-serif text-3xl font-light text-cream">Admin login</h1>
        <p className="mt-2 text-sm text-metal">Sign in with your admin account.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          {error ? <p className="text-sm text-rust-light">{error}</p> : null}
          <AdminInput
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AdminInput
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <AdminButton type="submit" disabled={loading} className="mt-2 w-full justify-center">
            {loading ? "Signing in..." : "Sign in"}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
