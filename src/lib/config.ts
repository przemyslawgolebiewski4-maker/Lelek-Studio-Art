function normalizeUrl(raw: string, fallback: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const API_BASE = normalizeUrl(
  process.env.NEXT_PUBLIC_API_URL ?? "",
  "http://localhost:3001",
);

export const SITE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "",
  "https://www.lelekstudio.com",
);

/**
 * Env fallback for the shop destination (nav / CTAs / footer).
 * Prefer resolveShopUrl(settings) so Admin → Settings → shop_url wins when set.
 */
export const SHOP_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SHOP_URL ?? "",
  "https://shop.lelekstudio.com",
);

/** Settings `shop_url` when present; otherwise NEXT_PUBLIC_SHOP_URL / hardcoded default. */
export function resolveShopUrl(settings?: Record<string, string> | null): string {
  const fromSettings = settings?.shop_url?.trim() ?? "";
  if (fromSettings) return normalizeUrl(fromSettings, SHOP_URL);
  return SHOP_URL;
}

export const API_FETCH_TIMEOUT_MS = 5_000;
export const DEFAULT_REVALIDATE = 60;

/** Official LELEK Instagram profile. Rewrites the retired lelek.studio.berlin handle. */
export const INSTAGRAM_URL = "https://www.instagram.com/lelek.berlin/";

export function resolveInstagramUrl(raw?: string | null): string {
  const url = (raw ?? "").trim() || INSTAGRAM_URL;
  if (/instagram\.com\/lelek\.studio\.berlin\/?/i.test(url)) return INSTAGRAM_URL;
  return url;
}

export function shouldSkipApiFetch(): boolean {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) return true;
  if (apiUrl.includes("localhost") && process.env.VERCEL === "1") return true;
  return false;
}
