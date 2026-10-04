/** Format an ISO date for subtle display (e.g. journal teasers). */
export function formatDisplayDate(iso?: string, locale: "en" | "pl" = "en"): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Prefer updatedAt when it differs from createdAt; otherwise createdAt. */
export function resolvePostDate(
  post: {
    createdAt?: string;
    updatedAt?: string;
  },
  locale: "en" | "pl" = "en",
): { iso: string; label: string } | null {
  const iso = post.updatedAt || post.createdAt;
  if (!iso) return null;
  const label = formatDisplayDate(iso, locale);
  if (!label) return null;
  return { iso, label };
}
