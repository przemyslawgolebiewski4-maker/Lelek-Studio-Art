"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminInput, AdminButton } from "@/components/admin/AdminShell";
import { apiPostDirect } from "@/lib/api";
import "../admin.css";

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
  if (err instanceof TypeError) {
    return "Nie można połączyć z API. Sprawdź NEXT_PUBLIC_API_URL na Vercel.";
  }
  return "Logowanie nie powiodło się. Spróbuj ponownie.";
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
      const res = await apiPostDirect("/auth/login", { email, password });

      let data: { ok?: boolean; token?: string; error?: string; code?: string; hint?: string };
      try {
        data = await res.json();
      } catch {
        setError(
          `API zwróciło nieprawidłową odpowiedź (HTTP ${res.status}). Sprawdź NEXT_PUBLIC_API_URL.`,
        );
        setLoading(false);
        return;
      }

      if (!res.ok || !data.ok) {
        if (data.code === "not_admin") {
          setError("Konto istnieje, ale brak roli lelek_admin. Użyj /setup/admin?force=true");
        } else if (data.code === "wrong_password") {
          setError("Złe hasło. Zresetuj przez /setup/admin?force=true");
        } else if (data.code === "server_error") {
          setError(data.hint ?? "Błąd serwera API. Sprawdź JWT_SECRET na Railway.");
        } else {
          setError(data.error ?? "Nieprawidłowy email lub hasło");
        }
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
    <div className="admin-login-wrap">
      <div className="admin-login-card surface-wabi">
        <p className="admin-stat-label">Lelek Studio</p>
        <h1>Admin login</h1>
        <p className="admin-muted">Sign in with your admin account.</p>

        {process.env.NEXT_PUBLIC_API_URL?.includes("localhost") ? (
          <p className="admin-warning">
            Brak NEXT_PUBLIC_API_URL - ustaw env na Vercel i redeploy.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="admin-form-stack" style={{ marginTop: 32 }}>
          {error ? <p className="admin-error">{error}</p> : null}
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
          <AdminButton type="submit" disabled={loading} className="filled" style={{ width: "100%" }}>
            {loading ? "Signing in..." : "Sign in"}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
