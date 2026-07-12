import {
  API_BASE,
  API_FETCH_TIMEOUT_MS,
  DEFAULT_REVALIDATE,
  shouldSkipApiFetch,
} from "@/lib/config";

type ServerFetchOptions<T> = RequestInit & {
  revalidate?: number;
  fallback: T;
};

export async function serverFetch<T>(path: string, options: ServerFetchOptions<T>): Promise<T> {
  if (shouldSkipApiFetch()) {
    return options.fallback;
  }

  const { fallback, revalidate = DEFAULT_REVALIDATE, ...init } = options;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: AbortSignal.timeout(API_FETCH_TIMEOUT_MS),
      next: { revalidate },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
