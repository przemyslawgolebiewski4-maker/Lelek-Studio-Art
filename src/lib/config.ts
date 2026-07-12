export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lelekstudio.com";
export const API_FETCH_TIMEOUT_MS = 5_000;
export const DEFAULT_REVALIDATE = 60;

export function shouldSkipApiFetch(): boolean {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return true;
  if (apiUrl.includes("localhost") && process.env.VERCEL === "1") return true;
  return false;
}
