import { cache } from "react";
import type { Metadata } from "next";
import { serverFetch } from "@/lib/api-server";
import { ABOUT_URL } from "@/lib/links";
import { readPl } from "@/lib/i18n/cms";
import { suggestPl } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";

export type PortfolioWork = {
  image: string;
  title: string;
  caption: string;
  alt: string;
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
        },
      ];
    }),
  };
}

export const getPortfolio = cache(async (locale: Locale): Promise<PortfolioContent> => {
  const raw = await serverFetch<Record<string, unknown>>("/sections/portfolio", { fallback: {} });
  return presentPortfolio(raw, locale);
});

export function portfolioMetadata(content: PortfolioContent, path: "" | "/about" | "/galleries" | "/contact"): Metadata {
  const heading =
    path === "/about"
      ? content.aboutHeading
      : path === "/galleries"
        ? content.galleriesHeading
        : path === "/contact"
          ? content.contactHeading
          : "";
  const title = heading ? `${heading} | ${content.name}` : content.name;
  const description = content.intro || content.role;
  const url = path ? `${ABOUT_URL}${path}` : `${ABOUT_URL}/`;
  const image = content.bannerImage || content.aboutImage || content.works[0]?.image || "";

  return {
    title: { absolute: title },
    description,
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
