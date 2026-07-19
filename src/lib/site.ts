import { serverFetch } from "@/lib/api-server";
import type { Product } from "@/types/product";
import type {
  ArchitectsSection,
  ElementsSection,
  FeaturedSection,
  FindSection,
  JournalPost,
  JournalPostSummary,
  JournalSection,
  StorySection,
} from "@/types/content";

export type HomeSectionKey =
  | "hero"
  | "story"
  | "elements"
  | "featured"
  | "architects"
  | "journal"
  | "find";

export const DEFAULT_HERO: Record<string, string> = {
  eyebrow: "Handmade in Berlin — Ceramic Studio",
  headline: "Shaped by hand,",
  headlineEm: "guided by instinct",
  subheadline:
    "Functional ceramics, vessels and wall objects made in Berlin. Each piece shaped slowly — by material, process and use.",
  quote: "Every grain of sand is different too...",
  image: "/images/hero/hero-main.jpg",
  imageMobile: "/images/hero/hero-main-mobile.jpg",
  video: "",
  videoMobile: "",
  imageCaption: "Vessel — Clay Stories Berlin",
  cta1Text: "View works",
  cta1Url: "/collections",
  cta2Text: "My story",
  cta2Url: "/about",
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
    serverFetch<ElementsSection>("/sections/elements", { fallback: { items: [] } }),
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
};

export const DEFAULT_ARCHITECTS: ArchitectsSection = {
  eyebrow: "For architects & designers",
  headline: "Looking for something made by hand, not manufactured?",
  sub: "Ceramics for residential, hospitality, and concept stores.",
  body: "Wall objects, vessels and functional pieces for contemporary interiors.",
  ctaText: "Get in touch",
  ctaUrl: "/for-architects",
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
