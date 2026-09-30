import { SITE_URL } from "./config";

/** Public host for the maker page (Przemysław Gołębiewski). */
export const CREATOR_HOST = "przemyslawgolebiewski.lelekstudio.com";

export const ABOUT_URL = `https://${CREATOR_HOST}`;

/** Studio site origin. Respects NEXT_PUBLIC_SITE_URL when set. */
export const STUDIO_ORIGIN = SITE_URL.replace(/\/+$/, "");

const CREATOR_HOSTS = new Set([CREATOR_HOST, `www.${CREATOR_HOST}`]);
const STUDIO_HOSTS = new Set(["www.lelekstudio.com", "lelekstudio.com"]);

export type LinkMode = "path" | "host";

export type HostDecision =
  | { action: "continue" }
  | { action: "rewrite"; pathname: string }
  | { action: "redirect"; destination: string };

/**
 * Production links that leave the studio host use absolute studio URLs.
 * Preview and local development keep same-origin paths.
 * /about stays on the studio site. The maker menu item uses ABOUT_URL directly.
 */
export function linkMode(): LinkMode {
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || "";
  if (vercelEnv) return vercelEnv === "production" ? "host" : "path";
  return process.env.NODE_ENV === "production" ? "host" : "path";
}

export function hostnameOf(hostHeader: string | null | undefined): string {
  const first = (hostHeader ?? "").split(",")[0]?.trim().toLowerCase() ?? "";
  return first.replace(/:\d+$/, "");
}

function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (withSlash.length > 1 && withSlash.endsWith("/")) return withSlash.slice(0, -1);
  return withSlash;
}

function withSearch(url: string, search: string): string {
  if (!search || search === "?") return url;
  const query = search.startsWith("?") ? search : `?${search}`;
  return `${url}${query}`;
}

function isAboutPath(pathname: string): boolean {
  return pathname === "/about" || pathname.startsWith("/about/");
}

/**
 * Where a request should go based on the public host.
 * Unknown hosts (localhost, preview) are left unchanged.
 * /about is served on the studio host. The maker host root rewrites to that page.
 */
export function decideHostRoute(
  hostHeader: string | null | undefined,
  pathname: string,
  search = "",
): HostDecision {
  const host = hostnameOf(hostHeader);
  const path = normalizePathname(pathname);

  if (CREATOR_HOSTS.has(host)) {
    if (host !== CREATOR_HOST) {
      const destPath = path === "/" ? "/" : path;
      return { action: "redirect", destination: withSearch(`${ABOUT_URL}${destPath}`, search) };
    }

    if (path === "/") {
      return { action: "rewrite", pathname: "/about" };
    }

    if (path.startsWith("/api") || path.startsWith("/_next") || isAboutPath(path)) {
      return { action: "continue" };
    }

    return {
      action: "redirect",
      destination: withSearch(`${STUDIO_ORIGIN}${path}`, search),
    };
  }

  if (STUDIO_HOSTS.has(host) && (path === "/collections" || path.startsWith("/collections/"))) {
    return { action: "redirect", destination: `${STUDIO_ORIGIN}/about#originals` };
  }

  return { action: "continue" };
}

/**
 * Turn an in-app href into the public URL.
 * In host mode, site paths point at the studio origin so they stay correct
 * from the maker host. /about stays on that studio origin.
 */
export function resolvePublicHref(href: string, mode: LinkMode = linkMode()): string {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed, `${STUDIO_ORIGIN}/`);
  } catch {
    return trimmed;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return trimmed;

  const path = normalizePathname(url.pathname);
  const relative = trimmed.startsWith("/");

  if (mode === "host" && relative) {
    if (path === "/") return withSearch(`${STUDIO_ORIGIN}/`, url.search) + url.hash;
    return `${STUDIO_ORIGIN}${path}${url.search}${url.hash}`;
  }

  if (relative) return `${path === "/" ? "/" : path}${url.search}${url.hash}`;
  return trimmed;
}

export function aboutHref(hash = "", mode: LinkMode = linkMode()): string {
  const fragment = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
  return resolvePublicHref(`/about${fragment}`, mode);
}

export function studioHref(path: string, mode: LinkMode = linkMode()): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return resolvePublicHref(normalized, mode);
}

export function isAboutHref(href: string): boolean {
  if (href.startsWith("/")) {
    const path = normalizePathname(href.split("#")[0]?.split("?")[0] ?? href);
    return isAboutPath(path);
  }
  try {
    const url = new URL(href);
    return CREATOR_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}
