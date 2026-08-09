import { serverFetch } from "@/lib/api-server";
import { SHOP_URL } from "@/lib/config";
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

export type HomeSectionKey =
  | "hero"
  | "story"
  | "signpost"
  | "elements"
  | "featured"
  | "architects"
  | "journal"
  | "find";

export const DEFAULT_HERO: Record<string, string> = {
  eyebrow: "Design through material.",
  headline: "Shaped by hand,",
  headlineEm: "guided by instinct",
  subheadline: "Ceramic objects, vessels, prints.",
  brandline: "LELEK - Berlin.",
  quote: "",
  image: "/images/hero/hero-main.jpg",
  imageMobile: "/images/hero/hero-main-mobile.jpg",
  video: "",
  videoMobile: "",
  imageCaption: "Vessel - Clay Stories Berlin",
  imageAlt: "Lelek Studio Berlin - handmade ceramics",
  cta1Text: "Shop",
  cta1Url: SHOP_URL,
  cta2Text: "About",
  cta2Url: "/about",
};

export const DEFAULT_SIGNPOST: SignpostSection = {
  intro:
    "LELEK works across ceramics, sculpture and print. Originals for collectors. Stoneware, fine art posters and wearable pieces for everyday use.",
  tradeSignal: "Designing a space? Let's talk",
  tradeHref: "/for-architects",
  cards: [
    {
      label: "Shop",
      description: "Ceramic objects, vessels, prints and wearable pieces for everyday use.",
      href: SHOP_URL,
    },
    {
      label: "About",
      description: "The studio story and one-of-a-kind Originals for collectors.",
      href: "/about",
    },
    {
      label: "Process",
      description: "Notes on material, making and life in the Berlin studio.",
      href: "/journal",
    },
    {
      label: "Trade",
      description: "Commissions for hospitality, offices and private spaces.",
      href: "/for-architects",
    },
  ],
};

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
        scopeNote: "Ceramics process, below - Mire & Silt collections only",
      },
    }),
    serverFetch<ArchitectsSection>("/sections/architects", { fallback: DEFAULT_ARCHITECTS }),
    serverFetch<JournalSection>("/sections/journal", {
      fallback: {
        eyebrow: "Journal",
        heading: "Stories from",
        headingEm: "the studio",
        sub: "Notes on process, material and making in Berlin.",
      },
    }),
    serverFetch<JournalPostSummary[]>("/journal/public", { fallback: [] }),
    serverFetch<FindSection>("/sections/find", { fallback: {} }),
    serverFetch<FeaturedSection>("/sections/featured", {
      fallback: {
        eyebrow: "Works",
        heading: "Form, surface",
        headingEm: "and presence",
      },
    }),
    serverFetch<Product[]>("/products/home", { fallback: [] }),
  ]);

  return {
    settings,
    hero,
    featured,
    featuredSection,
    homeProducts,
    story,
    signpost,
    elementsSection: elements,
    elements: elements.items ?? [],
    architects,
    journalSection,
    journalPosts: journalPosts.slice(0, 1),
    find,
  };
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  return serverFetch(`/products/public?limit=${limit}`, { fallback: [] });
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

export const DEFAULT_STORY: StorySection = {
  eyebrow: "The story",
  heading: "From peatlands",
  headingEm: "to clay",
  body1:
    "As a small boy I always followed the pull of nature - that was where I felt safe.",
  body2:
    "Not far from my family home stretched wide peatlands, home to different animals and the sounds of nature.",
  body3:
    "I am self-taught. I work intuitively, whether painting or working with clay.",
  signature: "Przemyslaw Golebiewski - ceramist",
  image: "/images/process/studio.jpg",
  imageMobile: "/images/process/studio-mobile.jpg",
  imageAlt: "Przemyslaw Golebiewski at the wheel, Clay Stories Berlin",
  imageCaption: "Clay Stories Berlin",
  gallery: [],
  ctaShopLabel: "Shop the collections",
  ctaTradeLabel: "Designing a space?",
};

export const DEFAULT_ARCHITECTS: ArchitectsSection = {
  eyebrow: "For architects & designers",
  headline: "Objects for spaces",
  headlineEm: "that refuse the ordinary.",
  sub: "Custom ceramic pieces for residential, hospitality and concept stores. Each object unique. None manufactured.",
  ctaText: "Get in touch",
  formTitle: "Send an inquiry",
  formSuccessTitle: "Message received.",
  formSuccessBody: "We will get back to you within 1-2 working days.",
  heroCaption:
    "Ceramic wall objects and vessels made for spaces - hospitality, offices, private commissions.",
  heroImageAlt: "Ceramic wall objects and vessels for spaces",
};

export async function getStorySection(): Promise<StorySection> {
  return serverFetch<StorySection>("/sections/story", { fallback: DEFAULT_STORY });
}

export async function getArchitectsSection(): Promise<ArchitectsSection> {
  return serverFetch<ArchitectsSection>("/sections/architects", { fallback: DEFAULT_ARCHITECTS });
}

export async function getJournalSection(): Promise<JournalSection> {
  return serverFetch<JournalSection>("/sections/journal", {
    fallback: {
      eyebrow: "Journal",
      heading: "Stories from",
      headingEm: "the studio",
      sub: "Notes on process, material and making in Berlin.",
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
