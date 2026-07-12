const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiGet(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
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

export { API_BASE };
