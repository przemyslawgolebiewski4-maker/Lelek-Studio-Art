import { API_BASE as SERVER_API_BASE } from "@/lib/config";

const isBrowser = typeof window !== "undefined";
const CLIENT_PREFIX = "/api/proxy";

function buildUrl(path: string): string {
  if (isBrowser) return `${CLIENT_PREFIX}${path}`;
  return `${SERVER_API_BASE}${path}`;
}

export async function apiGet(path: string, options?: RequestInit) {
  const res = await fetch(buildUrl(path), {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  return res;
}

export async function apiPost(path: string, body: unknown, options?: RequestInit) {
  return apiGet(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPatch(path: string, body: unknown) {
  return apiGet(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete(path: string) {
  return apiGet(path, { method: "DELETE" });
}

/** Direct Railway URL — for login (before session cookie exists) */
export async function apiPostDirect(path: string, body: unknown) {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim();
  const url = base
    ? /^https?:\/\//i.test(base)
      ? base.replace(/\/+$/, "")
      : `https://${base.replace(/\/+$/, "")}`
    : "http://localhost:3001";

  return fetch(`${url}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export { SERVER_API_BASE as API_BASE };
