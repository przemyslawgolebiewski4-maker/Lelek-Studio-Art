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
  heading: "The process comes first,",
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
  eyebrow: "For architects & interior designers",
  headline: "A space is never just a space.",
  dek: "Ceramic objects that change how a space feels.",
  heroBody:
    "Some spaces need a focal point. Others need texture, contrast or something unexpected. A ceramic object can do more than fill a space - it can shift its atmosphere, create a connection between materials or bring a sense of presence to an otherwise quiet interior.",
  intro:
    "LELEK creates ceramic wall pieces, vessels, lamps and sculptural objects for residential, hospitality and commercial spaces. Raw, organic forms meet architectural structure, bringing material, texture and a different kind of expression into the spaces we inhabit.",
  heroCaption:
    "A studio arrangement - the object in relation to a wall, a surface, a light. Not a completed client project.",
  heroImageAlt: `Ceramic object by ${CREATOR_NAME} placed in an interior`,
  collabHeadline: "Made for the space.",
  collabHeadlineEm: "Shaped by hand.",
  collabBody1:
    "Some works are already made, each existing as a singular form, ready to find its place. Others begin with a conversation.",
  collabBody2:
    "Working directly with the artist behind LELEK, you can explore a piece conceived around your project's scale, materials, light and atmosphere. It might be a sculptural wall object, a series of vessels, a lighting element or something that doesn't yet have a name.",
  collabBody3:
    "The process is collaborative, but never mechanical. Rather than reproducing a fixed design or following a rigid specification, each commission develops through an exchange of ideas, material exploration and an intuitive approach to form.",
  collabBody4:
    "Every piece is designed and made by one artist, from the first gesture in clay to the finished object. This means a direct connection between the person shaping the work and the person imagining the space.",
  collabNote:
    "Not every idea can be made. A commission is taken only when it sits within the practice - the clay, the scale, and what one artist can shape by hand.",
  existingCaption: "An existing work, as it is.",
  existingImageAlt: "Existing ceramic work",
  processCaption: "In the studio - a form taking shape.",
  processImageAlt: "Ceramic piece taking shape in the studio",
  kindsEyebrow: "What can find its place",
  points: [
    {
      title: "Wall objects",
      body: "Handbuilt ceramic pieces that give walls a new dimension. Sculptural forms, textures and shadows that interact with natural and artificial light. Available as existing works or developed for a specific space.",
    },
    {
      title: "Vessels & sculptural objects",
      body: "Ceramic forms for shelves, tables, niches and architectural settings. Objects that can stand alone, complement a composition or introduce a contrast in shape and material.",
    },
    {
      title: "Functional ceramics",
      body: "Cups, bowls and tea objects for interiors where everyday rituals matter. Available as individual pieces or selected series for hospitality, restaurants and other projects.",
    },
    {
      title: "Lamps & commissioned works",
      body: "Lighting objects and custom ceramic pieces developed in dialogue with your project. From an initial idea to a finished form, each commission is approached as an individual creative process.",
    },
  ],
  inviteHeadline: "Let's give your space a different presence.",
  inviteBody1:
    "You don't need to have a finished concept or a precise idea of the object. Sometimes a material, a surface, a feeling or a detail in the architecture is enough to start a conversation.",
  inviteBody2:
    "Tell me about your project - the space, its scale, light, materials and what you feel is missing. We can explore whether an existing work is the right fit or develop something specifically for it.",
  inviteSignoff: `LELEK is an independent ceramic practice by ${CREATOR_NAME}, who designs and makes each commissioned piece by hand in Berlin.`,
  formEyebrow: "Project inquiry",
  formIntro:
    "Tell me about your space, your project and the kind of object you have in mind. Include reference images, approximate dimensions and your project timeline if available.",
  formCta: "Let's start a conversation.",
  formEmail: "lelekstudio@lelekstudio.com",
  formSuccessTitle: "Message received.",
  formSuccessBody: "Thank you. I will reply within a few business days.",
  ctaText: "Get in touch",
  formTitle: "Project inquiry",
};

const STALE_ARCHITECTS_SUB_MARKERS = ["We do not produce to specification"] as const;

const STALE_SIGNPOST_CARD_DESCRIPTIONS = [
  "Ceramic objects, vessels, prints and wearable pieces for everyday use.",
  "The studio story and one-of-a-kind Originals for collectors.",
  "Notes on material, making and life in the Berlin studio.",
  "Commissions for hospitality, offices and private spaces.",
] as const;

function pickCopy(cms: string | undefined, fallback: string | undefined): string {
  const text = cms?.trim() ?? "";
  if (!text || containsOffBrandCopy(text)) return fallback ?? "";
  return withCreatorName(text);
}

/** Older Trade documents have no collaboration / invitation fields. */
export function isLegacyArchitectsSection(cms: ArchitectsSection): boolean {
  return !cms.collabHeadline?.trim() && !cms.inviteHeadline?.trim() && !cms.dek?.trim();
}

/**
 * Prefer CMS `sub` when present and not retired / off-brand.
 * The public page now reads `heroBody`; this remains for older callers.
 */
export function resolveArchitectsSub(cmsSub?: string): string {
  const text = cmsSub?.trim() ?? "";
  if (
    !text ||
    containsOffBrandCopy(text) ||
    STALE_ARCHITECTS_SUB_MARKERS.some((m) => text.includes(m)) ||
    text.includes("shaped by intuition, not brief")
  ) {
    return DEFAULT_ARCHITECTS.heroBody!;
  }
  return withCreatorName(text);
}

function resolvePoints(cms: ArchitectsSection): { title: string; body: string }[] {
  const fallback = DEFAULT_ARCHITECTS.points!;
  const source = cms.points && cms.points.length > 0 ? cms.points : fallback;
  return source.map((point, i) => {
    const base = fallback[i];
    return {
      title: pickCopy(point.title, base?.title ?? point.title),
      body: pickCopy(point.body, base?.body ?? point.body),
    };
  });
}

/**
 * The previous Trade hero is a studio still, not an object in an interior.
 * Keep it as the "existing work" photograph and leave the hero open.
 */
function relocateStudioStill(content: Record<string, unknown>): {
  existingImage?: string;
  existingCaption?: string;
  existingImageAlt?: string;
} {
  const hero = typeof content.heroImage === "string" ? content.heroImage.trim() : "";
  const existing = typeof content.existingImage === "string" ? content.existingImage.trim() : "";
  const image = existing || hero;
  if (!image) return {};
  return {
    existingImage: image,
    existingCaption: "Existing works, photographed in the studio.",
    existingImageAlt: "Ceramic vessels photographed in the studio",
  };
}

/** Admin draft: show the new page model before the stored document has been migrated. */
export function architectsContentForEditor(
  content: Record<string, unknown>,
): Record<string, unknown> {
  if (!isLegacyArchitectsSection(content as ArchitectsSection)) return content;
  return {
    ...DEFAULT_ARCHITECTS,
    points: DEFAULT_ARCHITECTS.points?.map((point) => ({ ...point })),
    ...relocateStudioStill(content),
  };
}

export function resolveArchitectsSection(cms: ArchitectsSection): ArchitectsSection {
  const media = {
    heroImage: cms.heroImage,
    heroImageMobile: cms.heroImageMobile,
    heroVideo: cms.heroVideo,
    heroVideoMobile: cms.heroVideoMobile,
    existingImage: cms.existingImage,
    processImage: cms.processImage,
  };

  if (isLegacyArchitectsSection(cms)) {
    const points = DEFAULT_ARCHITECTS.points!;
    const still = relocateStudioStill(cms as unknown as Record<string, unknown>);
    return {
      ...DEFAULT_ARCHITECTS,
      ...still,
      heroImage: "",
      heroImageMobile: "",
      heroVideo: "",
      heroVideoMobile: "",
      points,
      sub: DEFAULT_ARCHITECTS.heroBody,
      point1Title: points[0]?.title,
      point1Body: points[0]?.body,
      point2Title: points[1]?.title,
      point2Body: points[1]?.body,
      point3Title: points[2]?.title,
      point3Body: points[2]?.body,
    };
  }

  const points = resolvePoints(cms);
  const heroBody = pickCopy(cms.heroBody, DEFAULT_ARCHITECTS.heroBody);
  return {
    ...DEFAULT_ARCHITECTS,
    ...cms,
    ...media,
    eyebrow: pickCopy(cms.eyebrow, DEFAULT_ARCHITECTS.eyebrow),
    headline: pickCopy(cms.headline, DEFAULT_ARCHITECTS.headline),
    dek: pickCopy(cms.dek, DEFAULT_ARCHITECTS.dek),
    heroBody,
    intro: pickCopy(cms.intro, DEFAULT_ARCHITECTS.intro),
    heroCaption: pickCopy(cms.heroCaption, DEFAULT_ARCHITECTS.heroCaption),
    heroImageAlt: pickCopy(cms.heroImageAlt, DEFAULT_ARCHITECTS.heroImageAlt),
    collabHeadline: pickCopy(cms.collabHeadline, DEFAULT_ARCHITECTS.collabHeadline),
    collabHeadlineEm: pickCopy(cms.collabHeadlineEm, DEFAULT_ARCHITECTS.collabHeadlineEm),
    collabBody1: pickCopy(cms.collabBody1, DEFAULT_ARCHITECTS.collabBody1),
    collabBody2: pickCopy(cms.collabBody2, DEFAULT_ARCHITECTS.collabBody2),
    collabBody3: pickCopy(cms.collabBody3, DEFAULT_ARCHITECTS.collabBody3),
    collabBody4: pickCopy(cms.collabBody4, DEFAULT_ARCHITECTS.collabBody4),
    collabNote: pickCopy(cms.collabNote, DEFAULT_ARCHITECTS.collabNote),
    existingCaption: pickCopy(cms.existingCaption, DEFAULT_ARCHITECTS.existingCaption),
    existingImageAlt: pickCopy(cms.existingImageAlt, DEFAULT_ARCHITECTS.existingImageAlt),
    processCaption: pickCopy(cms.processCaption, DEFAULT_ARCHITECTS.processCaption),
    processImageAlt: pickCopy(cms.processImageAlt, DEFAULT_ARCHITECTS.processImageAlt),
    kindsEyebrow: pickCopy(cms.kindsEyebrow, DEFAULT_ARCHITECTS.kindsEyebrow),
    inviteHeadline: pickCopy(cms.inviteHeadline, DEFAULT_ARCHITECTS.inviteHeadline),
    inviteBody1: pickCopy(cms.inviteBody1, DEFAULT_ARCHITECTS.inviteBody1),
    inviteBody2: pickCopy(cms.inviteBody2, DEFAULT_ARCHITECTS.inviteBody2),
    inviteSignoff: pickCopy(cms.inviteSignoff, DEFAULT_ARCHITECTS.inviteSignoff),
    formEyebrow: pickCopy(cms.formEyebrow, DEFAULT_ARCHITECTS.formEyebrow),
    formIntro: pickCopy(cms.formIntro, DEFAULT_ARCHITECTS.formIntro),
    formCta: pickCopy(cms.formCta, DEFAULT_ARCHITECTS.formCta),
    formEmail: pickCopy(cms.formEmail, DEFAULT_ARCHITECTS.formEmail),
    formSuccessTitle: pickCopy(cms.formSuccessTitle, DEFAULT_ARCHITECTS.formSuccessTitle),
    formSuccessBody: pickCopy(cms.formSuccessBody, DEFAULT_ARCHITECTS.formSuccessBody),
    points,
    sub: heroBody,
    point1Title: points[0]?.title,
    point1Body: points[0]?.body,
    point2Title: points[1]?.title,
    point2Body: points[1]?.body,
    point3Title: points[2]?.title,
    point3Body: points[2]?.body,
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

const DESIGN_THROUGH_MATERIAL = /^Design through material\.?$/i;

function resolveHeroLine(cms: string | undefined, fallback: string): string {
  const text = cms?.trim() ?? "";
  if (!text || DESIGN_THROUGH_MATERIAL.test(text)) return fallback;
  return withCreatorName(text);
}

export function resolveHeroContent(
  cms: Record<string, string>,
  shopUrl: string,
): Record<string, string> {
  const merged = { ...DEFAULT_HERO, ...cms };
  return {
    ...merged,
    eyebrow: resolveHeroLine(cms.eyebrow, DEFAULT_HERO.eyebrow),
    subheadline: cms.subheadline?.trim() || DEFAULT_HERO.subheadline,
    semanticCore: resolveHeroSemanticCore(cms.semanticCore),
    brandline: cms.brandline?.trim() || DEFAULT_HERO.brandline,
    kozodoj: resolveHeroLine(cms.kozodoj, DEFAULT_HERO.kozodoj),
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
