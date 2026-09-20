import { SHOP_URL } from "@/lib/config";
import type { ArchitectsSection, SignpostSection, StorySection } from "@/types/content";
import {
  CREATOR_ENTITY_DESCRIPTION,
  CREATOR_NAME,
  CREATOR_SIGNATURE,
  ELEMENTS_SCOPE_NOTE,
  HERO_BRANDLINE,
  HERO_ELEMENTS_TAGLINE,
  HERO_EYEBROW,
  HERO_IMAGE_ALT,
  HERO_SUBHEADLINE,
  SIGNPOST_INTRO,
  STORY_BODY_1,
  STORY_BODY_2,
  STORY_BODY_3,
  containsOffBrandCopy,
  isOffBrandStory,
  resolveCreatorSignature,
  resolveElementsScopeNote,
  resolveHeroSemanticCore,
  resolveSignpostIntro,
  withCreatorName,
} from "@/lib/brand";

export const DEFAULT_HERO: Record<string, string> = {
  eyebrow: HERO_EYEBROW,
  headline: "",
  headlineEm: "",
  subheadline: HERO_SUBHEADLINE,
  semanticCore: CREATOR_ENTITY_DESCRIPTION,
  brandline: HERO_BRANDLINE,
  kozodoj: HERO_ELEMENTS_TAGLINE,
  quote: "",
  image: "",
  imageMobile: "",
  video: "",
  videoMobile: "",
  imageCaption: "",
  imageAlt: HERO_IMAGE_ALT,
  cta1Text: "Shop",
  cta1Url: SHOP_URL,
  cta2Text: "About",
  cta2Url: "/about",
};

export const DEFAULT_STORY: StorySection = {
  eyebrow: "The ceramist",
  heading: "The process comes first",
  headingEm: "always",
  body1: STORY_BODY_1,
  body2: STORY_BODY_2,
  body3: STORY_BODY_3,
  signature: CREATOR_SIGNATURE,
  image: "",
  imageMobile: "",
  imageAlt: `${CREATOR_NAME}, self-taught ceramist at work in Berlin`,
  imageCaption: "",
  gallery: [],
  ctaShopLabel: "Shop the collections",
  ctaTradeLabel: "Designing a space?",
  originalsEyebrow: "Originals",
  originalsHeading: "Shaped by hand, not by mold",
  originalsIntro:
    "Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences.",
};

export const DEFAULT_SIGNPOST: SignpostSection = {
  intro: SIGNPOST_INTRO,
  tradeSignal: "Designing a space? Let's talk",
  tradeHref: "/for-architects",
  cards: [
    {
      label: "Shop",
      description: "Vessels, cups, lamps and objects. Forms that repeat, never exactly.",
      href: SHOP_URL,
    },
    {
      label: "About",
      description: `${CREATOR_NAME} - self-taught ceramist. Process first, always.`,
      href: "/about",
    },
    {
      label: "Process",
      description: "Notes on clay, kiln, texture, and what the material decides.",
      href: "/journal",
    },
    {
      label: "Trade",
      description: "Works for spaces that can hold something raw, organic, or both.",
      href: "/for-architects",
    },
  ],
};

export const DEFAULT_ARCHITECTS: ArchitectsSection = {
  eyebrow: "For architects & designers",
  headline: "Objects for spaces",
  headlineEm: "that refuse the ordinary.",
  sub:
    "Each wall object, vessel and lamp exists as a singular form - shaped by intuition, not brief. Some pieces stay raw, closer to brutalism; others lean fully organic. Most works are placed as they are, into a space that can hold them. In select cases, a new piece takes shape around the scale and context of a room - but always through the same process: the hand moves, the mind follows after. Never to a fixed specification. Never by mold.",
  point1Title: "Wall objects",
  point1Body:
    "Handbuilt ceramic pieces for walls. Each exists once. Available for residential and hospitality projects.",
  point2Title: "Vessels and objects",
  point2Body: "Sculptural forms for shelves, tables and surfaces. Selected, not configured.",
  point3Title: "Functional ceramics",
  point3Body:
    "Cups, bowls and vessels - forms that repeat, never exactly. Shaped by hand, not by mold.",
  closingNote:
    "Not every collaboration fits a category. If you see a fit between LELEK and your project - a brand, a gallery, an idea - write to us.",
  ctaText: "Get in touch",
  formTitle: "Send an inquiry",
  formIntro:
    "Tell us about the space - scale, light, the works you're drawn to. We reply within a few business days.",
  formSuccessTitle: "Message received.",
  formSuccessBody: "We will get back to you within 1-2 working days.",
  heroCaption:
    "Ceramic vessels, lamps and wall objects by Przemysław Gołębiewski - for spaces that can hold something raw, organic, or both.",
  heroImageAlt: `Ceramic objects by ${CREATOR_NAME} for interiors`,
};

const STALE_ARCHITECTS_SUB_MARKERS = ["We do not produce to specification"] as const;

const STALE_SIGNPOST_CARD_DESCRIPTIONS = [
  "Ceramic objects, vessels, prints and wearable pieces for everyday use.",
  "The studio story and one-of-a-kind Originals for collectors.",
  "Notes on material, making and life in the Berlin studio.",
  "Commissions for hospitality, offices and private spaces.",
] as const;

/**
 * Prefer CMS `sub` when present and not retired / off-brand.
 * Falls back to DEFAULT so a deploy can retire stale Mongo text without an Admin save.
 */
export function resolveArchitectsSub(cmsSub?: string): string {
  const text = cmsSub?.trim() ?? "";
  if (
    !text ||
    containsOffBrandCopy(text) ||
    STALE_ARCHITECTS_SUB_MARKERS.some((m) => text.includes(m))
  ) {
    return DEFAULT_ARCHITECTS.sub!;
  }
  return withCreatorName(text);
}

export function resolveArchitectsSection(cms: ArchitectsSection): ArchitectsSection {
  const sub = resolveArchitectsSub(cms.sub);
  const point3Body =
    !cms.point3Body?.trim() || containsOffBrandCopy(cms.point3Body)
      ? DEFAULT_ARCHITECTS.point3Body
      : cms.point3Body;
  const points = cms.points?.map((p, i) => {
    if (i === 2 && containsOffBrandCopy(p.body)) {
      return { ...p, body: DEFAULT_ARCHITECTS.point3Body! };
    }
    return p;
  });
  const heroCaption =
    !cms.heroCaption?.trim() || containsOffBrandCopy(cms.heroCaption)
      ? DEFAULT_ARCHITECTS.heroCaption
      : withCreatorName(cms.heroCaption);
  const heroImageAlt =
    !cms.heroImageAlt?.trim() || containsOffBrandCopy(cms.heroImageAlt)
      ? DEFAULT_ARCHITECTS.heroImageAlt
      : withCreatorName(cms.heroImageAlt);

  return {
    ...DEFAULT_ARCHITECTS,
    ...cms,
    sub,
    point3Body,
    points,
    heroCaption,
    heroImageAlt,
  };
}

export function resolveStorySection(cms: StorySection): StorySection {
  if (isOffBrandStory(cms) || !cms.body1?.trim()) {
    return {
      ...cms,
      eyebrow: DEFAULT_STORY.eyebrow,
      heading: DEFAULT_STORY.heading,
      headingEm: DEFAULT_STORY.headingEm,
      body1: DEFAULT_STORY.body1,
      body2: DEFAULT_STORY.body2,
      body3: DEFAULT_STORY.body3,
      signature: DEFAULT_STORY.signature,
      imageAlt: cms.imageAlt?.trim()
        ? withCreatorName(cms.imageAlt)
        : DEFAULT_STORY.imageAlt,
      originalsEyebrow: cms.originalsEyebrow || DEFAULT_STORY.originalsEyebrow,
      originalsHeading:
        !cms.originalsHeading?.trim() || /one-of-a-kind/i.test(cms.originalsHeading)
          ? DEFAULT_STORY.originalsHeading
          : cms.originalsHeading,
      originalsIntro:
        !cms.originalsIntro?.trim() || /not sold through the shop/i.test(cms.originalsIntro)
          ? DEFAULT_STORY.originalsIntro
          : cms.originalsIntro,
    };
  }

  return {
    ...DEFAULT_STORY,
    ...cms,
    body1: withCreatorName(cms.body1),
    body2: cms.body2 ? withCreatorName(cms.body2) : DEFAULT_STORY.body2,
    body3: cms.body3 ? withCreatorName(cms.body3) : DEFAULT_STORY.body3,
    signature: resolveCreatorSignature(cms.signature),
    imageAlt: cms.imageAlt?.trim()
      ? withCreatorName(cms.imageAlt)
      : DEFAULT_STORY.imageAlt,
  };
}

export function resolveHeroContent(
  cms: Record<string, string>,
  shopUrl: string,
): Record<string, string> {
  const merged = { ...DEFAULT_HERO, ...cms };
  return {
    ...merged,
    eyebrow: cms.eyebrow?.trim() || DEFAULT_HERO.eyebrow,
    subheadline: cms.subheadline?.trim() || DEFAULT_HERO.subheadline,
    semanticCore: resolveHeroSemanticCore(cms.semanticCore),
    brandline: cms.brandline?.trim() || DEFAULT_HERO.brandline,
    kozodoj: cms.kozodoj?.trim() || DEFAULT_HERO.kozodoj,
    imageAlt: cms.imageAlt?.trim()
      ? withCreatorName(cms.imageAlt)
      : DEFAULT_HERO.imageAlt,
    cta1Url: cms.cta1Url?.trim() || shopUrl,
    cta2Url: cms.cta2Url?.trim() || DEFAULT_HERO.cta2Url,
  };
}

export function resolveSignpostSection(
  cms: SignpostSection | undefined,
  shopUrl: string,
): SignpostSection {
  const fallbackCards = DEFAULT_SIGNPOST.cards!.map((card, i) =>
    i === 0 ? { ...card, href: shopUrl } : card,
  );

  if (!cms) {
    return { ...DEFAULT_SIGNPOST, cards: fallbackCards };
  }

  const rawCards = cms.cards && cms.cards.length > 0 ? cms.cards.slice(0, 4) : [];
  const cards = rawCards.map((card, i) => {
    const fallback = fallbackCards[i] ?? card;
    const description =
      !card.description?.trim() ||
      containsOffBrandCopy(card.description) ||
      STALE_SIGNPOST_CARD_DESCRIPTIONS.includes(
        card.description as (typeof STALE_SIGNPOST_CARD_DESCRIPTIONS)[number],
      )
        ? fallback.description
        : withCreatorName(card.description);
    return {
      ...fallback,
      ...card,
      description,
      href: card.href?.trim() || fallback.href,
    };
  });
  while (cards.length < 4) {
    cards.push(fallbackCards[cards.length]!);
  }

  return {
    ...DEFAULT_SIGNPOST,
    ...cms,
    intro: resolveSignpostIntro(cms.intro),
    cards,
  };
}

export function resolveElementsScope(cms?: string): string {
  return resolveElementsScopeNote(cms) || ELEMENTS_SCOPE_NOTE;
}
