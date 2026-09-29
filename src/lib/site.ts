import { serverFetch } from "@/lib/api-server";
import { ELEMENTS_SCOPE_NOTE } from "@/lib/brand";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  presentArchitects,
  presentElements,
  presentFeatured,
  presentFind,
  presentHero,
  presentJournalPost,
  presentJournalSection,
  presentProduct,
  presentSignpost,
  presentStory,
} from "@/lib/i18n/present";
import {
  DEFAULT_ARCHITECTS,
  DEFAULT_HERO,
  DEFAULT_SIGNPOST,
  DEFAULT_STORY,
  resolveArchitectsSection,
  resolveArchitectsSub,
  resolveElementsScope,
  resolveHeroContent,
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
  const locale = await getLocale();
  const heroResolved = resolveHeroContent(hero, shopUrl);
  const signpostResolved = resolveSignpostSection(signpost, shopUrl);
  const storyResolved = resolveStorySection(story);
  const elementsResolved = {
    ...elements,
    scopeNote: resolveElementsScope(elements.scopeNote),
  };
  const architectsResolved = resolveArchitectsSection(architects);
  const heroRaw = hero as unknown as Record<string, unknown>;
  const storyRaw = story as unknown as Record<string, unknown>;
  const signpostRaw = signpost as unknown as Record<string, unknown>;
  const elementsRaw = elements as unknown as Record<string, unknown>;
  const architectsRaw = architects as unknown as Record<string, unknown>;
  const journalRaw = journalSection as unknown as Record<string, unknown>;
  const findRaw = find as unknown as Record<string, unknown>;
  const featuredRaw = featuredSection as unknown as Record<string, unknown>;
  const elementsView = presentElements(elementsResolved, elementsRaw, locale);

  return {
    settings,
    locale,
    hero: presentHero(heroResolved, heroRaw, locale),
    featured: featured.map((product) => presentProduct(product, locale)),
    featuredSection: presentFeatured(featuredSection, featuredRaw, locale),
    homeProducts: homeProducts.map((product) => presentProduct(product, locale)),
    story: presentStory(storyResolved, storyRaw, locale),
    signpost: presentSignpost(signpostResolved, signpostRaw, locale),
    elementsSection: elementsView,
    elements: elementsView.items ?? [],
    architects: presentArchitects(architectsResolved, architectsRaw, locale),
    journalSection: presentJournalSection(journalSection, journalRaw, locale),
    journalPosts: journalPosts.slice(0, 1).map((post) => presentJournalPost(post, locale)),
    find: presentFind(find, findRaw, locale),
  };
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await serverFetch<Product[]>(`/products/public?limit=${limit}`, { fallback: [] });
  const locale = await getLocale();
  return products.map((product) => presentProduct(product, locale));
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
  const products = await serverFetch<Product[]>(`/products/public?limit=${limit}`, { fallback: [] });
  const locale = await getLocale();
  return products.map((product) => presentProduct(product, locale));
}

export async function getOriginalProducts(limit = 50): Promise<Product[]> {
  const products = await getPublishedProducts(limit);
  return products.filter((p) => p.isOriginal);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await serverFetch<Product | null>(`/products/public/${encodeURIComponent(slug)}`, {
    fallback: null,
  });
  if (!product) return null;
  return presentProduct(product, await getLocale());
}

export async function getStorySection(): Promise<StorySection> {
  const story = await serverFetch<StorySection>("/sections/story", {
    fallback: DEFAULT_STORY,
  });
  return presentStory(
    resolveStorySection(story),
    story as unknown as Record<string, unknown>,
    await getLocale(),
  );
}

export async function getArchitectsSection(): Promise<ArchitectsSection> {
  const section = await serverFetch<ArchitectsSection>("/sections/architects", {
    fallback: DEFAULT_ARCHITECTS,
  });
  return presentArchitects(
    resolveArchitectsSection(section),
    section as unknown as Record<string, unknown>,
    await getLocale(),
  );
}

export async function getJournalSection(): Promise<JournalSection> {
  const section = await serverFetch<JournalSection>("/sections/journal", {
    fallback: {
      eyebrow: "Journal",
      heading: "Notes on process",
      headingEm: "and material",
      sub: "What the kiln and the material decide together.",
    },
  });
  return presentJournalSection(section, section as unknown as Record<string, unknown>, await getLocale());
}

export async function getJournalPosts(): Promise<JournalPostSummary[]> {
  const posts = await serverFetch<JournalPostSummary[]>("/journal/public", { fallback: [] });
  const locale = await getLocale();
  return posts.map((post) => presentJournalPost(post, locale));
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const post = await serverFetch<JournalPost | null>(`/journal/public/${encodeURIComponent(slug)}`, {
    fallback: null,
  });
  if (!post) return null;
  return presentJournalPost(post, await getLocale());
}
