import { cache } from "react";
import type { Metadata } from "next";
import { serverFetch } from "@/lib/api-server";
import { ABOUT_URL } from "@/lib/links";
import { readPl } from "@/lib/i18n/cms";
import { suggestPl } from "@/lib/i18n/dictionary";
import { presentGallery, presentProduct } from "@/lib/i18n/present";
import type { Locale } from "@/lib/i18n/locale";
import type { Gallery } from "@/types/gallery";
import type { Product } from "@/types/product";

export type PortfolioWork = {
  image: string;
  title: string;
  caption: string;
  alt: string;
  soldOut: boolean;
  galleryName: string;
  galleryUrl: string;
};

export type PortfolioFaq = {
  question: string;
  answer: string;
};

export type PortfolioContent = {
  name: string;
  role: string;
  bannerImage: string;
  bannerVideo: string;
  bannerAlt: string;
  intro: string;
  navAbout: string;
  navGalleries: string;
  navContact: string;
  aboutHeading: string;
  aboutBody: string;
  aboutImage: string;
  aboutImageAlt: string;
  galleriesHeading: string;
  galleriesIntro: string;
  contactHeading: string;
  contactBody: string;
  contactEmail: string;
  works: PortfolioWork[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  aboutSeoTitle: string;
  aboutSeoDescription: string;
  galleriesSeoTitle: string;
  galleriesSeoDescription: string;
  contactSeoTitle: string;
  contactSeoDescription: string;
  geoSummary: string;
  geoPlace: string;
  geoSameAs: string[];
  aeoQuestion: string;
  aeoAnswer: string;
  aeoItems: PortfolioFaq[];
};

const DEFAULTS = {
  name: "Przemysław Gołębiewski",
  role: "visual artist",
  navAbout: "About",
  navGalleries: "Galleries",
  navContact: "Contact",
  aboutHeading: "About",
  galleriesHeading: "Galleries",
  contactHeading: "Contact",
} as const;

const PL_FALLBACKS: Record<string, string> = {
  [DEFAULTS.name]: DEFAULTS.name,
  [DEFAULTS.role]: "artysta wizualny",
  [DEFAULTS.navAbout]: "O mnie",
  [DEFAULTS.navGalleries]: "Galerie",
  [DEFAULTS.navContact]: "Kontakt",
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function field(
  locale: Locale,
  raw: Record<string, unknown>,
  key: string,
  fallback = "",
): string {
  const english = text(raw[key]) || fallback;
  if (locale !== "pl") return english;
  const stored = readPl(raw, key);
  if (stored !== undefined && stored.trim()) return stored.trim();
  const prepared = PL_FALLBACKS[english];
  if (prepared) return prepared;
  return suggestPl(english) || english;
}

function keywordList(value: string): string[] {
  return value
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function sameAsList(value: unknown): string[] {
  return text(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function faqFromRow(locale: Locale, row: Record<string, unknown>): PortfolioFaq | null {
  const question =
    locale === "pl"
      ? text(row.questionPl) || suggestPl(text(row.question)) || text(row.question)
      : text(row.question);
  const answer =
    locale === "pl"
      ? text(row.answerPl) || suggestPl(text(row.answer)) || text(row.answer)
      : text(row.answer);
  if (!question || !answer) return null;
  return { question, answer };
}

function workField(locale: Locale, item: Record<string, unknown>, key: "title" | "caption" | "alt"): string {
  const english = text(item[key]);
  if (locale !== "pl") return english;
  const stored = text(item[`${key}Pl`]);
  if (stored) return stored;
  return suggestPl(english) || english;
}

export function presentPortfolio(raw: Record<string, unknown> | null | undefined, locale: Locale): PortfolioContent {
  const source = raw && typeof raw === "object" ? raw : {};
  const works = Array.isArray(source.works) ? source.works : [];

  return {
    name: field(locale, source, "name", DEFAULTS.name),
    role: field(locale, source, "role", DEFAULTS.role),
    bannerImage: text(source.bannerImage),
    bannerVideo: text(source.bannerVideo),
    bannerAlt: field(locale, source, "bannerAlt"),
    intro: field(locale, source, "intro"),
    navAbout: field(locale, source, "navAbout", DEFAULTS.navAbout),
    navGalleries: field(locale, source, "navGalleries", DEFAULTS.navGalleries),
    navContact: field(locale, source, "navContact", DEFAULTS.navContact),
    aboutHeading: field(locale, source, "aboutHeading", DEFAULTS.aboutHeading),
    aboutBody: field(locale, source, "aboutBody"),
    aboutImage: text(source.aboutImage),
    aboutImageAlt: field(locale, source, "aboutImageAlt"),
    galleriesHeading: field(locale, source, "galleriesHeading", DEFAULTS.galleriesHeading),
    galleriesIntro: field(locale, source, "galleriesIntro"),
    contactHeading: field(locale, source, "contactHeading", DEFAULTS.contactHeading),
    contactBody: field(locale, source, "contactBody"),
    contactEmail: text(source.contactEmail),
    seoTitle: field(locale, source, "seoTitle"),
    seoDescription: field(locale, source, "seoDescription"),
    seoKeywords: field(locale, source, "seoKeywords"),
    aboutSeoTitle: field(locale, source, "aboutSeoTitle"),
    aboutSeoDescription: field(locale, source, "aboutSeoDescription"),
    galleriesSeoTitle: field(locale, source, "galleriesSeoTitle"),
    galleriesSeoDescription: field(locale, source, "galleriesSeoDescription"),
    contactSeoTitle: field(locale, source, "contactSeoTitle"),
    contactSeoDescription: field(locale, source, "contactSeoDescription"),
    geoSummary: field(locale, source, "geoSummary"),
    geoPlace: field(locale, source, "geoPlace"),
    geoSameAs: sameAsList(source.geoSameAs),
    aeoQuestion: field(locale, source, "aeoQuestion"),
    aeoAnswer: field(locale, source, "aeoAnswer"),
    aeoItems: (Array.isArray(source.aeoItems) ? source.aeoItems : []).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const faq = faqFromRow(locale, item as Record<string, unknown>);
      return faq ? [faq] : [];
    }),
    works: works.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const work = item as Record<string, unknown>;
      const image = text(work.image);
      if (!image) return [];
      return [
        {
          image,
          title: workField(locale, work, "title"),
          caption: workField(locale, work, "caption"),
          alt: workField(locale, work, "alt"),
          soldOut: false,
          galleryName: "",
          galleryUrl: "",
        },
      ];
    }),
  };
}

export function photosFromProducts(
  products: Array<{
    isPortfolio?: boolean;
    title?: string;
    catalog?: string;
    imageAlt?: string;
    images?: string[];
    soldOut?: boolean;
    currentGallery?: { name?: string; url?: string } | null;
  }>,
): PortfolioWork[] {
  const photos: PortfolioWork[] = [];
  for (const product of products) {
    if (!product.isPortfolio) continue;
    const image = (product.images ?? []).map((item) => item.trim()).find(Boolean);
    if (!image) continue;
    const title = product.title?.trim() || "";
    const soldOut = Boolean(product.soldOut);
    const galleryName = product.currentGallery?.name?.trim() || "";
    const galleryUrl = product.currentGallery?.url?.trim() || "";
    const onView = !soldOut && Boolean(galleryName) && Boolean(galleryUrl);
    photos.push({
      image,
      title,
      caption: product.catalog?.trim() || "",
      alt: product.imageAlt?.trim() || title,
      soldOut,
      galleryName: onView ? galleryName : "",
      galleryUrl: onView ? galleryUrl : "",
    });
  }
  return photos;
}

export const getPortfolioProducts = cache(async (locale: Locale): Promise<PortfolioWork[]> => {
  const products = await serverFetch<Product[]>("/products/public?portfolio=1&limit=100", { fallback: [] });
  const list = Array.isArray(products) ? products : [];
  return photosFromProducts(list.map((product) => presentProduct(product, locale)));
});

export const getPartnerGalleries = cache(async (locale: Locale): Promise<Gallery[]> => {
  const galleries = await serverFetch<Gallery[]>("/public/galleries", { fallback: [] });
  const list = Array.isArray(galleries) ? galleries : [];
  return list.map((gallery) => presentGallery(gallery, locale));
});

export const getPortfolio = cache(async (locale: Locale): Promise<PortfolioContent> => {
  const raw = await serverFetch<Record<string, unknown>>("/sections/portfolio", { fallback: {} });
  return presentPortfolio(raw, locale);
});

function pageCopy(content: PortfolioContent, path: "" | "/about" | "/galleries" | "/contact") {
  if (path === "/about") {
    return {
      heading: content.aboutHeading,
      title: content.aboutSeoTitle,
      description: content.aboutSeoDescription,
    };
  }
  if (path === "/galleries") {
    return {
      heading: content.galleriesHeading,
      title: content.galleriesSeoTitle,
      description: content.galleriesSeoDescription,
    };
  }
  if (path === "/contact") {
    return {
      heading: content.contactHeading,
      title: content.contactSeoTitle,
      description: content.contactSeoDescription,
    };
  }
  return { heading: "", title: content.seoTitle, description: content.seoDescription };
}

export function portfolioMetadata(content: PortfolioContent, path: "" | "/about" | "/galleries" | "/contact"): Metadata {
  const page = pageCopy(content, path);
  const title = page.title || (page.heading ? `${page.heading} | ${content.name}` : content.name);
  const description = page.description || content.intro || content.geoSummary || content.role;
  const keywords = keywordList(content.seoKeywords);
  const url = path ? `${ABOUT_URL}${path}` : `${ABOUT_URL}/`;
  const image = content.bannerImage || content.aboutImage || content.works[0]?.image || "";

  return {
    title: { absolute: title },
    description,
    keywords: keywords.length > 0 ? keywords : [content.name],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      ...(image ? { images: [{ url: image, alt: content.bannerAlt || content.name }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function portfolioStructuredData(content: PortfolioContent, sameAs: string[] = []) {
  const description = content.geoSummary || content.seoDescription || content.intro;
  const links = [...sameAs, ...content.geoSameAs]
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, all) => all.findIndex((other) => other.replace(/\/+$/, "") === item.replace(/\/+$/, "")) === index);
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: content.name,
    jobTitle: content.role,
    url: `${ABOUT_URL}/`,
  };
  if (description) person.description = description;
  if (content.geoPlace) person.homeLocation = { "@type": "Place", name: content.geoPlace };
  if (links.length > 0) person.sameAs = links;

  const faqs = [
    ...(content.aeoQuestion && content.aeoAnswer
      ? [{ question: content.aeoQuestion, answer: content.aeoAnswer }]
      : []),
    ...content.aeoItems,
  ];
  const graph: Record<string, unknown>[] = [person];
  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
