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

export type ApiResult<T = Record<string, unknown>> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

/** Always resolves - never throws. Use instead of `await res.json()` on every admin call. */
export async function readApiResult<T = Record<string, unknown>>(
  res: Response,
): Promise<ApiResult<T>> {
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return {
      ok: false,
      error: res.ok
        ? "The server returned an unexpected response. Please try again."
        : `Request failed (HTTP ${res.status}). Please try again.`,
    };
  }

  if (typeof data !== "object" || data === null) {
    return { ok: false, error: "The server returned an unexpected response." };
  }

  const parsed = data as Record<string, unknown>;
  if (!res.ok || parsed.ok !== true) {
    return {
      ok: false,
      error:
        typeof parsed.error === "string"
          ? parsed.error
          : `Request failed (HTTP ${res.status}).`,
    };
  }

  return parsed as { ok: true } & T;
}

/**
 * Safe parse for endpoints that return a plain JSON object on success
 * (no `{ ok: true }` envelope), e.g. GET /admin/settings.
 */
export async function readPlainJson<T extends Record<string, unknown>>(
  res: Response,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return {
      ok: false,
      error: res.ok
        ? "The server returned an unexpected response. Please try again."
        : `Request failed (HTTP ${res.status}). Please try again.`,
    };
  }

  if (!res.ok) {
    const error =
      typeof data === "object" &&
      data !== null &&
      typeof (data as Record<string, unknown>).error === "string"
        ? ((data as Record<string, unknown>).error as string)
        : `Request failed (HTTP ${res.status}).`;
    return { ok: false, error };
  }

  if (typeof data !== "object" || data === null) {
    return { ok: false, error: "The server returned an unexpected response." };
  }

  return { ok: true, data: data as T };
}

import { uploadMedia } from "@/lib/media-upload";

export async function apiUpload(file: File, folder: string) {
  const result = await uploadMedia(file, folder);
  return {
    res: { ok: result.ok } as Response,
    data: result.ok ? { ok: true as const, url: result.url } : { ok: false as const, error: result.error },
  };
}

/** Direct Railway URL - for login (before session cookie exists) */
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
