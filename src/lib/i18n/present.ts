import { suggestPl } from "@/lib/i18n/dictionary";
import { readPl } from "@/lib/i18n/cms";
import type { Locale } from "@/lib/i18n/locale";
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
import type { Product } from "@/types/product";
import type { Gallery } from "@/types/gallery";

export function localeText(
  locale: Locale,
  english: string | undefined | null,
  storedPl?: string | null,
): string {
  const en = english ?? "";
  if (locale !== "pl") return en;
  const custom = storedPl?.trim();
  if (custom && custom !== en.trim()) return custom;
  return suggestPl(en) || custom || en;
}

function presentKeys<T extends Record<string, unknown>>(
  resolved: T,
  raw: Record<string, unknown> | undefined,
  keys: string[],
  locale: Locale,
): T {
  if (locale !== "pl") return resolved;
  const next = { ...resolved };
  for (const key of keys) {
    const en = typeof resolved[key] === "string" ? (resolved[key] as string) : "";
    if (!en && resolved[key] == null) continue;
    (next as Record<string, unknown>)[key] = localeText(locale, en, raw ? readPl(raw, key) : undefined);
  }
  return next;
}

const HERO_KEYS = [
  "eyebrow",
  "subheadline",
  "semanticCore",
  "brandline",
  "kozodoj",
  "imageAlt",
  "imageCaption",
  "cta1Text",
  "cta2Text",
];

export function presentHero(
  resolved: Record<string, string>,
  raw: Record<string, unknown>,
  locale: Locale,
): Record<string, string> {
  return presentKeys(resolved, raw, HERO_KEYS, locale);
}

const STORY_KEYS = [
  "eyebrow",
  "heading",
  "headingEm",
  "body1",
  "body2",
  "body3",
  "signature",
  "imageAlt",
  "imageCaption",
  "ctaShopLabel",
  "ctaTradeLabel",
  "originalsEyebrow",
  "originalsHeading",
  "originalsIntro",
];

export function presentStory(story: StorySection, raw: Record<string, unknown> | StorySection, locale: Locale): StorySection {
  const next = presentKeys(story as unknown as Record<string, unknown>, raw as Record<string, unknown>, STORY_KEYS, locale) as unknown as StorySection;
  if (locale !== "pl" || !next.gallery) return next;
  return {
    ...next,
    gallery: next.gallery.map((item) => ({
      ...item,
      alt: localeText(locale, item.alt, item.altPl),
    })),
  };
}

export function presentSignpost(section: SignpostSection, raw: Record<string, unknown> | undefined, locale: Locale): SignpostSection {
  const next = presentKeys(
    section as unknown as Record<string, unknown>,
    raw,
    ["intro", "tradeSignal"],
    locale,
  ) as unknown as SignpostSection;
  if (locale !== "pl" || !next.cards) return next;
  const rawCards = Array.isArray(raw?.cards) ? (raw.cards as Array<Record<string, unknown>>) : [];
  return {
    ...next,
    cards: next.cards.map((card, i) => {
      const rawCard = rawCards[i];
      return {
        ...card,
        label: localeText(locale, card.label, (card.labelPl || rawCard?.labelPl) as string | undefined),
        description: localeText(
          locale,
          card.description,
          (card.descriptionPl || rawCard?.descriptionPl) as string | undefined,
        ),
      };
    }),
  };
}

export function presentElements(section: ElementsSection, raw: Record<string, unknown> | undefined, locale: Locale): ElementsSection {
  const next = presentKeys(section as unknown as Record<string, unknown>, raw, ["scopeNote"], locale) as unknown as ElementsSection;
  if (locale !== "pl") return next;
  const items = (next.items ?? []).map((item) => ({
    ...item,
    name: localeText(locale, item.name, item.namePl),
    description: item.description ? localeText(locale, item.description, item.descriptionPl) : item.description,
  }));
  return { ...next, items };
}

const FEATURED_KEYS = ["eyebrow", "heading", "headingEm", "videoAlt"];

export function presentFeatured(section: FeaturedSection, raw: Record<string, unknown> | undefined, locale: Locale): FeaturedSection {
  return presentKeys(section as unknown as Record<string, unknown>, raw, FEATURED_KEYS, locale) as unknown as FeaturedSection;
}

const FIND_KEYS = [
  "studioName",
  "openDaysNote",
  "onlineHeading",
  "onlineDescription",
  "onlineCtaLabel",
  "lelekMeaning",
];

export function presentFind(section: FindSection, raw: Record<string, unknown> | undefined, locale: Locale): FindSection {
  return presentKeys(section as unknown as Record<string, unknown>, raw, FIND_KEYS, locale) as unknown as FindSection;
}

const JOURNAL_KEYS = ["eyebrow", "heading", "headingEm", "sub"];

export function presentJournalSection(
  section: JournalSection,
  raw: Record<string, unknown> | undefined,
  locale: Locale,
): JournalSection {
  return presentKeys(section as unknown as Record<string, unknown>, raw, JOURNAL_KEYS, locale) as unknown as JournalSection;
}

const ARCHITECT_KEYS = [
  "eyebrow",
  "headline",
  "dek",
  "heroBody",
  "intro",
  "heroImageAlt",
  "heroCaption",
  "collabHeadline",
  "collabHeadlineEm",
  "collabBody1",
  "collabBody2",
  "collabBody3",
  "collabBody4",
  "collabNote",
  "existingImageAlt",
  "existingCaption",
  "processImageAlt",
  "processCaption",
  "kindsEyebrow",
  "inviteHeadline",
  "inviteBody1",
  "inviteBody2",
  "inviteSignoff",
  "formEyebrow",
  "formIntro",
  "formCta",
  "formSuccessTitle",
  "formSuccessBody",
  "headlineEm",
  "sub",
  "closingNote",
  "ctaText",
  "formTitle",
  "point1Title",
  "point1Body",
  "point2Title",
  "point2Body",
  "point3Title",
  "point3Body",
];

export function presentArchitects(
  section: ArchitectsSection,
  raw: Record<string, unknown> | undefined,
  locale: Locale,
): ArchitectsSection {
  const next = presentKeys(
    section as unknown as Record<string, unknown>,
    raw,
    ARCHITECT_KEYS,
    locale,
  ) as unknown as ArchitectsSection;
  if (locale !== "pl" || !next.points) return next;
  const rawPoints = Array.isArray(raw?.points) ? (raw.points as Array<Record<string, unknown>>) : [];
  const points = next.points.map((point, i) => {
    const rawPoint = rawPoints[i];
    return {
      ...point,
      title: localeText(locale, point.title, (point.titlePl || rawPoint?.titlePl) as string | undefined),
      body: localeText(locale, point.body, (point.bodyPl || rawPoint?.bodyPl) as string | undefined),
    };
  });
  return {
    ...next,
    points,
    point1Title: points[0]?.title ?? next.point1Title,
    point1Body: points[0]?.body ?? next.point1Body,
    point2Title: points[1]?.title ?? next.point2Title,
    point2Body: points[1]?.body ?? next.point2Body,
    point3Title: points[2]?.title ?? next.point3Title,
    point3Body: points[2]?.body ?? next.point3Body,
  };
}

type ProductPl = {
  title?: string;
  material?: string;
  description?: string;
  process?: string;
  imageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
};

function productPl(product: Product): ProductPl {
  const i18n = (product as Product & { i18n?: { pl?: ProductPl } }).i18n;
  return i18n?.pl ?? {};
}

export function presentProduct<T extends Product>(product: T, locale: Locale): T {
  if (locale !== "pl") return product;
  const pl = productPl(product);
  const gallery = product.currentGallery;
  return {
    ...product,
    title: localeText(locale, product.title, pl.title),
    material: localeText(locale, product.material, pl.material),
    description: localeText(locale, product.description, pl.description),
    process: localeText(locale, product.process, pl.process),
    imageAlt: product.imageAlt ? localeText(locale, product.imageAlt, pl.imageAlt) : product.imageAlt,
    metaTitle: localeText(locale, product.metaTitle, pl.metaTitle),
    metaDescription: localeText(locale, product.metaDescription, pl.metaDescription),
    currentGallery: gallery
      ? { ...gallery, name: localeText(locale, gallery.name, undefined) }
      : gallery,
  };
}

type PostPl = {
  title?: string;
  excerpt?: string;
  body?: string;
  coverImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
};

function postPl(post: JournalPostSummary | JournalPost): PostPl {
  const i18n = (post as JournalPostSummary & { i18n?: { pl?: PostPl } }).i18n;
  return i18n?.pl ?? {};
}

export function presentJournalPost<T extends JournalPostSummary>(post: T, locale: Locale): T {
  if (locale !== "pl") return post;
  const pl = postPl(post);
  const next = {
    ...post,
    title: localeText(locale, post.title, pl.title),
    excerpt: localeText(locale, post.excerpt, pl.excerpt),
    coverImageAlt: post.coverImageAlt
      ? localeText(locale, post.coverImageAlt, pl.coverImageAlt)
      : post.coverImageAlt,
    metaTitle: localeText(locale, post.metaTitle, pl.metaTitle),
    metaDescription: localeText(locale, post.metaDescription, pl.metaDescription),
  };
  if ("body" in post && typeof (post as JournalPost).body === "string") {
    (next as JournalPost).body = localeText(locale, (post as JournalPost).body, pl.body);
  }
  return next;
}

export function presentGallery<T extends Gallery>(gallery: T, locale: Locale): T {
  if (locale !== "pl") return gallery;
  const pl = gallery.i18n?.pl;
  return {
    ...gallery,
    name: localeText(locale, gallery.name, pl?.name),
    city: gallery.city ? localeText(locale, gallery.city, pl?.city) : gallery.city,
  };
}

const SETTING_KEYS = [
  "tagline",
  "description",
  "location",
  "contact_heading_1",
  "contact_heading_2",
  "contact_heading_3",
  "contact_sub",
  "contact_success",
  "contact_form_note",
  "datenschutz_body",
] as const;

export function presentSettings(settings: Record<string, string>, locale: Locale): Record<string, string> {
  if (locale !== "pl") return settings;
  const next = { ...settings };
  for (const key of SETTING_KEYS) {
    const en = settings[key] ?? "";
    if (!en && !settings[`${key}_pl`]) continue;
    next[key] = localeText(locale, en, settings[`${key}_pl`]);
  }
  return next;
}
