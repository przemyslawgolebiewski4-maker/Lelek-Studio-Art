import { serverFetch } from "@/lib/api-server";
import { ELEMENTS_SCOPE_NOTE } from "@/lib/brand";
import {
  DEFAULT_ARCHITECTS,
  DEFAULT_HERO,
  DEFAULT_SIGNPOST,
  DEFAULT_STORY,
  resolveArchitectsSection,
  resolveArchitectsSub,
  resolveElementsScope,
  resolveSignpostSection,
  resolveStorySection,
} from "@/lib/brand-copy";
import { resolveShopUrl } from "@/lib/config";
import type { Product } from "@/types/product";
import type {
  ArchitectsSection,
  ElementsSection,
  FeaturedSection,
  FindSection,
  JournalPost,
  JournalPostSummary,
  JournalSection,
  SignpostSection,
  StorySection,
} from "@/types/content";

export {
  DEFAULT_ARCHITECTS,
  DEFAULT_HERO,
  DEFAULT_SIGNPOST,
  DEFAULT_STORY,
  resolveArchitectsSub,
};

export type HomeSectionKey =
  | "hero"
  | "story"
  | "signpost"
  | "elements"
  | "featured"
  | "architects"
  | "journal"
  | "find";

export async function getSiteSettings(): Promise<Record<string, string>> {
  return serverFetch("/settings/public", { fallback: {} });
}

export async function getPublicHomeData() {
  const [
    settings,
    featured,
    hero,
    story,
    signpost,
    elements,
    architects,
    journalSection,
    journalPosts,
    find,
    featuredSection,
    homeProducts,
  ] = await Promise.all([
    serverFetch<Record<string, string>>("/settings/public", { fallback: {} }),
    serverFetch<Product[]>("/products/public?limit=6", { fallback: [] }),
    serverFetch<Record<string, string>>("/sections/hero", { fallback: DEFAULT_HERO }),
    serverFetch<StorySection>("/sections/story", { fallback: DEFAULT_STORY }),
    serverFetch<SignpostSection>("/sections/signpost", { fallback: DEFAULT_SIGNPOST }),
    serverFetch<ElementsSection>("/sections/elements", {
      fallback: {
        items: [],
        scopeNote: ELEMENTS_SCOPE_NOTE,
      },
    }),
    serverFetch<ArchitectsSection>("/sections/architects", { fallback: DEFAULT_ARCHITECTS }),
    serverFetch<JournalSection>("/sections/journal", {
      fallback: {
        eyebrow: "Journal",
        heading: "Notes on process",
        headingEm: "and material",
        sub: "What the kiln and the material decide together.",
      },
    }),
    serverFetch<JournalPostSummary[]>("/journal/public", { fallback: [] }),
    serverFetch<FindSection>("/sections/find", { fallback: {} }),
    serverFetch<FeaturedSection>("/sections/featured", {
      fallback: {
        eyebrow: "Works",
        heading: "Shaped by hand",
        headingEm: "never exactly",
      },
    }),
    serverFetch<Product[]>("/products/home", { fallback: [] }),
  ]);

  const shopUrl = resolveShopUrl(settings);

  return {
    settings,
    hero,
    featured,
    featuredSection,
    homeProducts,
    story: resolveStorySection(story),
    signpost: resolveSignpostSection(signpost, shopUrl),
    elementsSection: {
      ...elements,
      scopeNote: resolveElementsScope(elements.scopeNote),
    },
    elements: elements.items ?? [],
    architects: resolveArchitectsSection(architects),
    journalSection,
    journalPosts: journalPosts.slice(0, 1),
    find,
  };
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return serverFetch(`/products/public?limit=${limit}`, { fallback: [] });
}

/**
 * Prefer Admin "Visible on Home" products; if fewer than `minCount`, pad from
 * published catalog (by order) so the homepage always has internal /objects links.
 * All candidates remain CMS products — never hardcoded slugs.
 */
export function resolveHomeFeaturedProducts(
  homeVisible: Product[],
  publishedFallback: Product[],
  minCount = 3,
  maxCount = 6,
): Product[] {
  const byId = new Map<string, Product>();
  for (const p of homeVisible) {
    byId.set(String(p._id), p);
  }
  if (byId.size < minCount) {
    for (const p of publishedFallback) {
      if (byId.size >= minCount) break;
      const id = String(p._id);
      if (!byId.has(id)) byId.set(id, p);
    }
  }
  return Array.from(byId.values()).slice(0, maxCount);
}

export async function getPublishedProducts(limit = 50): Promise<Product[]> {
  return serverFetch(`/products/public?limit=${limit}`, { fallback: [] });
}

export async function getOriginalProducts(limit = 50): Promise<Product[]> {
  const products = await getPublishedProducts(limit);
  return products.filter((p) => p.isOriginal);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return serverFetch<Product | null>(`/products/public/${encodeURIComponent(slug)}`, {
    fallback: null,
  });
}

export async function getStorySection(): Promise<StorySection> {
  const story = await serverFetch<StorySection>("/sections/story", {
    fallback: DEFAULT_STORY,
  });
  return resolveStorySection(story);
}

export async function getArchitectsSection(): Promise<ArchitectsSection> {
  const section = await serverFetch<ArchitectsSection>("/sections/architects", {
    fallback: DEFAULT_ARCHITECTS,
  });
  return resolveArchitectsSection(section);
}

export async function getJournalSection(): Promise<JournalSection> {
  return serverFetch<JournalSection>("/sections/journal", {
    fallback: {
      eyebrow: "Journal",
      heading: "Notes on process",
      headingEm: "and material",
      sub: "What the kiln and the material decide together.",
    },
  });
}

export async function getJournalPosts(): Promise<JournalPostSummary[]> {
  return serverFetch<JournalPostSummary[]>("/journal/public", { fallback: [] });
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  return serverFetch<JournalPost | null>(`/journal/public/${encodeURIComponent(slug)}`, {
    fallback: null,
  });
}
