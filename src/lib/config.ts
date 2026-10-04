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

/** Official LELEK Instagram profile and the visible @ handle. */
export const INSTAGRAM_URL = "https://www.instagram.com/lelek.studio_/";
export const INSTAGRAM_HANDLE = "@lelek.studio_";

/** Retired profiles. lelek.studio_ is not in this set, so it is never sent back to an old URL. */
const RETIRED_INSTAGRAM_USERNAMES = new Set([
  "lelek.berlin",
  "lelek.studio.berlin",
  "lelek.studio",
  "claystories.berlin",
]);

function instagramUsername(raw: string): string {
  const match = raw.match(/instagram\.com\/([^/?#]+)/i);
  if (!match) return "";
  try {
    return decodeURIComponent(match[1]).toLowerCase();
  } catch {
    return match[1].toLowerCase();
  }
}

export function resolveInstagramUrl(raw?: string | null): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return INSTAGRAM_URL;
  const username = instagramUsername(trimmed);
  if (username === "lelek.studio_" || RETIRED_INSTAGRAM_USERNAMES.has(username)) return INSTAGRAM_URL;
  return trimmed;
}

export function resolveInstagramHandle(raw?: string | null): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return INSTAGRAM_HANDLE;
  const bare = trimmed.replace(/^@/, "").toLowerCase();
  if (bare === "lelek.studio_" || RETIRED_INSTAGRAM_USERNAMES.has(bare)) return INSTAGRAM_HANDLE;
  return trimmed;
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
