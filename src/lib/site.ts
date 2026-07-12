import { serverFetch } from "@/lib/api-server";
import type { Product } from "@/types/product";

export type HomeSectionKey =
  | "hero"
  | "story"
  | "elements"
  | "featured"
  | "architects"
  | "journal"
  | "find";

export const DEFAULT_HERO: Record<string, string> = {
  eyebrow: "Handmade in Berlin - Ceramic Studio",
  headline: "Shaped by hand,",
  headlineEm: "guided by instinct",
  subheadline:
    "Functional ceramics, vessels and wall objects made in Berlin. Each piece shaped slowly - by material, process and use.",
  image: "/images/hero/hero-main.jpg",
  imageMobile: "/images/hero/hero-main-mobile.jpg",
  cta1Text: "View works",
  cta1Url: "/collections",
  cta2Text: "My story",
  cta2Url: "/about",
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  return serverFetch("/settings/public", { fallback: {} });
}

export async function getPublicHomeData() {
  const [settings, featured, hero] = await Promise.all([
    serverFetch<Record<string, string>>("/settings/public", { fallback: {} }),
    serverFetch<Product[]>("/products/public?limit=6", { fallback: [] }),
    serverFetch<Record<string, string>>("/sections/hero", { fallback: DEFAULT_HERO }),
  ]);

  return { settings, hero, featured };
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  return serverFetch(`/products/public?limit=${limit}`, { fallback: [] });
}
