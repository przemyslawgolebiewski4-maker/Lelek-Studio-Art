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

/**
 * Organization JSON-LD sameAs: Instagram + shop, then Admin → Settings → same_as_urls
 * (one URL per line). Extra lines are appended; duplicates of Instagram/shop are dropped.
 */
export function resolveOrganizationSameAs(
  settings?: Record<string, string> | null,
): string[] {
  const instagram = resolveInstagramUrl(settings?.instagram);
  const shop = resolveShopUrl(settings);
  const extras = (settings?.same_as_urls || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (/^https?:\/\//i.test(line) ? line : `https://${line}`));

  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of [instagram, shop, ...extras]) {
    if (!url) continue;
    const key = url.replace(/\/+$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(url);
  }
  return out;
}

export function shouldSkipApiFetch(): boolean {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) return true;
  if (apiUrl.includes("localhost") && process.env.VERCEL === "1") return true;
  return false;
}
