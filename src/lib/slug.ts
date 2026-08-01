/** URL-safe slug: lowercase, hyphens only, no leading/trailing dashes. */
export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugFromTitle(title: string): string {
  return normalizeSlug(title);
}
