import { suggestPl } from "@/lib/i18n/dictionary";

export type I18nPl = Record<string, string>;

function plBag(content: Record<string, unknown>): I18nPl | undefined {
  const i18n = content.i18n;
  if (!i18n || typeof i18n !== "object") return undefined;
  const pl = (i18n as { pl?: unknown }).pl;
  if (!pl || typeof pl !== "object") return undefined;
  return pl as I18nPl;
}

/** Stored Polish for a scalar field, or undefined when the admin has never saved it. */
export function readPl(content: Record<string, unknown> | undefined | null, key: string): string | undefined {
  if (!content) return undefined;
  const bag = plBag(content);
  if (!bag || !Object.prototype.hasOwnProperty.call(bag, key)) return undefined;
  const value = bag[key];
  return typeof value === "string" ? value : undefined;
}

export function writePl(
  content: Record<string, unknown>,
  key: string,
  value: string,
): Record<string, unknown> {
  const i18n = content.i18n && typeof content.i18n === "object" ? (content.i18n as Record<string, unknown>) : {};
  const prev = plBag(content) ?? {};
  return {
    ...content,
    i18n: {
      ...i18n,
      pl: { ...prev, [key]: value },
    },
  };
}

/** Value shown in the Polish admin field: saved text, otherwise the prepared translation. */
export function displayPl(
  content: Record<string, unknown> | undefined | null,
  key: string,
  english: string,
  fallbackEnglish?: string,
): string {
  const stored = content ? readPl(content, key) : undefined;
  if (stored !== undefined) return stored;
  return suggestPl(english) || suggestPl(fallbackEnglish) || "";
}

const SECTION_TEXT: Record<string, string[]> = {
  hero: [
    "eyebrow",
    "subheadline",
    "semanticCore",
    "brandline",
    "kozodoj",
    "imageAlt",
    "imageCaption",
    "cta1Text",
    "cta2Text",
  ],
  story: [
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
  ],
  signpost: ["intro", "tradeSignal"],
  elements: ["scopeNote"],
  featured: ["eyebrow", "heading", "headingEm", "videoAlt"],
  architects: [
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
  ],
  journal: ["eyebrow", "heading", "headingEm", "sub"],
  find: [
    "studioName",
    "openDaysNote",
    "onlineHeading",
    "onlineDescription",
    "onlineCtaLabel",
    "lelekMeaning",
  ],
  portfolio: [
    "name",
    "role",
    "bannerAlt",
    "intro",
    "navAbout",
    "navGalleries",
    "navContact",
    "aboutHeading",
    "aboutBody",
    "aboutImageAlt",
    "galleriesHeading",
    "galleriesIntro",
    "contactHeading",
    "contactBody",
    "seoTitle",
    "seoDescription",
    "seoKeywords",
    "aboutSeoTitle",
    "aboutSeoDescription",
    "galleriesSeoTitle",
    "galleriesSeoDescription",
    "contactSeoTitle",
    "contactSeoDescription",
    "geoSummary",
    "geoPlace",
    "aeoQuestion",
    "aeoAnswer",
  ],
};

function stampPair(
  item: Record<string, unknown>,
  enKey: string,
  plKey: string,
): Record<string, unknown> {
  const en = typeof item[enKey] === "string" ? (item[enKey] as string) : "";
  const existing = item[plKey];
  if (typeof existing === "string") return item;
  const pl = suggestPl(en);
  if (!pl) return item;
  return { ...item, [plKey]: pl };
}

/** Persist prepared Polish into the draft so Save stores both languages. */
export function stampSectionPl(
  sectionKey: string,
  content: Record<string, unknown>,
): Record<string, unknown> {
  let next = content;
  for (const key of SECTION_TEXT[sectionKey] ?? []) {
    if (readPl(next, key) !== undefined) continue;
    const en = typeof next[key] === "string" ? (next[key] as string) : "";
    const pl = suggestPl(en);
    if (pl) next = writePl(next, key, pl);
  }

  if (sectionKey === "signpost" && Array.isArray(next.cards)) {
    next = {
      ...next,
      cards: (next.cards as Record<string, unknown>[]).map((card) => {
        const withLabel = stampPair(card, "label", "labelPl");
        return stampPair(withLabel, "description", "descriptionPl");
      }),
    };
  }

  if (sectionKey === "elements" && Array.isArray(next.items)) {
    next = {
      ...next,
      items: (next.items as Record<string, unknown>[]).map((item) => {
        const withName = stampPair(item, "name", "namePl");
        return stampPair(withName, "description", "descriptionPl");
      }),
    };
  }

  if (sectionKey === "story" && Array.isArray(next.gallery)) {
    next = {
      ...next,
      gallery: (next.gallery as Record<string, unknown>[]).map((item) => stampPair(item, "alt", "altPl")),
    };
  }

  if (sectionKey === "architects" && Array.isArray(next.points)) {
    next = {
      ...next,
      points: (next.points as Record<string, unknown>[]).map((point) => {
        const withTitle = stampPair(point, "title", "titlePl");
        return stampPair(withTitle, "body", "bodyPl");
      }),
    };
  }

  if (sectionKey === "portfolio" && Array.isArray(next.aeoItems)) {
    next = {
      ...next,
      aeoItems: (next.aeoItems as Record<string, unknown>[]).map((item) => {
        const withQuestion = stampPair(item, "question", "questionPl");
        return stampPair(withQuestion, "answer", "answerPl");
      }),
    };
  }

  if (sectionKey === "portfolio" && Array.isArray(next.works)) {
    next = {
      ...next,
      works: (next.works as Record<string, unknown>[]).map((work) => {
        const withTitle = stampPair(work, "title", "titlePl");
        const withCaption = stampPair(withTitle, "caption", "captionPl");
        return stampPair(withCaption, "alt", "altPl");
      }),
    };
  }

  return next;
}
