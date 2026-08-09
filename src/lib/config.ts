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

/** Shopify storefront URL (purchasing lives off this site). */
export const SHOP_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SHOP_URL ?? "",
  "https://shop.lelekstudio.com",
);

export const API_FETCH_TIMEOUT_MS = 5_000;
export const DEFAULT_REVALIDATE = 60;

export function shouldSkipApiFetch(): boolean {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) return true;
  if (apiUrl.includes("localhost") && process.env.VERCEL === "1") return true;
  return false;
}
