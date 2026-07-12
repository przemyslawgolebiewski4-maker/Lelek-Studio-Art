"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminInput, AdminButton } from "@/components/admin/AdminShell";
import { API_BASE, apiPost } from "@/lib/api";

async function setFrontendSession(token: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("session");
}

function loginErrorMessage(err: unknown): string {
  if (API_BASE.includes("localhost")) {
    return "NEXT_PUBLIC_API_URL nie jest ustawione na Vercel. Dodaj URL Railway API i zrób Redeploy.";
  }
  if (err instanceof TypeError) {
    return `Nie można połączyć z API (${API_BASE}). Sprawdź URL Railway i CORS (FRONTEND_URL).`;
  }
  return "Logowanie nie powiodło się. Sprawdź API URL i redeploy Vercel + Railway.";
}

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

    try {
      const res = await apiPost("/auth/login", { email, password });

      let data: { ok?: boolean; token?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        setError(
          `API zwróciło nieprawidłową odpowiedź (HTTP ${res.status}). Sprawdź NEXT_PUBLIC_API_URL: ${API_BASE}`,
        );
        setLoading(false);
        return;
      }

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Nieprawidłowy email lub hasło");
        setLoading(false);
        return;
      }

      if (!data.token) {
        setError("API nie zwróciło tokena. Zrób Redeploy Railway (najnowszy kod z main).");
        setLoading(false);
        return;
      }

      await setFrontendSession(data.token);

      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(loginErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md border border-sand/20 bg-peat/30 p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">Lelek Studio</p>
        <h1 className="mt-2 font-serif text-3xl font-light text-cream">Admin login</h1>
        <p className="mt-2 text-sm text-metal">Sign in with your admin account.</p>

        {API_BASE.includes("localhost") ? (
          <p className="mt-4 border border-rust/40 bg-rust/10 p-3 text-xs text-rust-light">
            Brak NEXT_PUBLIC_API_URL — frontend próbuje łączyć się z localhost. Ustaw env na Vercel i
            redeploy.
          </p>
        ) : null}

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
