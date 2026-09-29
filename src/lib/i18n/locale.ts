export const LOCALE_COOKIE = "lelek_lang";

export type Locale = "en" | "pl";

export function parseLocale(value: string | undefined | null): Locale {
  return value === "pl" ? "pl" : "en";
}
