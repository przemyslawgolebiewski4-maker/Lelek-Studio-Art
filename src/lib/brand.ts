/**
 * Brand core - single source of truth for how Google, answer engines,
 * and the public site should read the maker: Przemysław Gołębiewski.
 *
 * Core: a self-taught ceramist, working by intuition rather than plan.
 * The process comes first, always - the hand moves, the mind follows after.
 */

export const CREATOR_NAME = "Przemysław Gołębiewski";
export const CREATOR_NAME_ASCII = "Przemyslaw Golebiewski";
export const CREATOR_GIVEN_NAME = "Przemysław";
export const CREATOR_FAMILY_NAME = "Gołębiewski";
export const CREATOR_JOB_TITLE = "Ceramist";
export const CREATOR_SIGNATURE = "Przemysław Gołębiewski - ceramist";

/** Informal short name - keep for admin-only copy, not public entity markup. */
export const CREATOR_NICKNAME = "Przemek";

export const STUDIO_NAME = "LELEK";
export const STUDIO_NAME_LONG = "Lelek Studio Berlin";

export const CREATOR_SAME_AS = [
  "https://www.instagram.com/lelek.berlin/",
  "https://www.p-golebiewski.xyz",
] as const;

/**
 * Third-person entity sentence. Visible on the homepage (hero semantic core)
 * and used as Person.description / default meta so crawlers extract:
 * "Przemysław Gołębiewski is a self-taught ceramist…"
 */
export const CREATOR_ENTITY_DESCRIPTION =
  "Przemysław Gołębiewski is a self-taught ceramist, working by intuition rather than plan. The process comes first, always - the hand moves, the mind follows after.";

/** Homepage / default meta (~155-160 characters, third person). */
export const DEFAULT_DESCRIPTION =
  "Przemysław Gołębiewski is a self-taught ceramist in Berlin. Working by intuition rather than plan, he shapes vessels, cups and lamps by hand - never exactly the same.";

export const DEFAULT_TAGLINE = "The process comes first, always";

export const DEFAULT_OG_IMAGE_ALT =
  "Ceramics by Przemysław Gołębiewski - Lelek Studio Berlin. Organic and raw forms shaped by hand, never by mold.";

/** About / story body - first-person core, following the entity sentence. */
export const STORY_BODY_1 = CREATOR_ENTITY_DESCRIPTION;

export const STORY_BODY_2 =
  "I want to bring warmth and something of nature into the home through what I make - I'm drawn to organic shapes, the play of texture, and the feel of a piece under my hands as it takes form. What fascinates me most is how concrete and nature sometimes meet without asking permission - how an organic shape, a natural color, can sit inside something as raw as brutalism and somehow belong there. My own work moves between those two registers: some pieces stay raw, closer to brutalism itself; others lean fully organic. And sometimes the two don't sit side by side at all - they mix into something that only makes sense with itself.";

export const STORY_BODY_3 =
  "Materials with real, unrepeatable origins interest me most: a pigment found on a trip, a clay mix that may never come back the same way twice. The process leaves its own marks - a crack stabilized, not hidden; a drip left where water carried it. What the kiln and the material decide together, not just the maker alone. Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences, shaped by hand, not by mold.";

export const HERO_EYEBROW = "The process comes first.";
export const HERO_SUBHEADLINE =
  "Vessels, cups, lamps - organic and raw, shaped by hand, never exactly.";
export const HERO_BRANDLINE = "LELEK - Berlin.";
export const HERO_ELEMENTS_TAGLINE = "The hand moves, the mind follows after.";
export const HERO_IMAGE_ALT =
  "Handmade ceramics by ceramist Przemysław Gołębiewski - Lelek Studio Berlin";

export const SIGNPOST_INTRO =
  "LELEK is the ceramic practice of Przemysław Gołębiewski. Organic and brutalist forms, shaped by hand - vessels, cups, lamps and objects that never repeat exactly.";

export const ELEMENTS_SCOPE_NOTE =
  "Stoneware shaped by hand, not by mold - organic and raw, shown below in the studio's four elements: earth, water, fire, air.";

export const PRINT_REPRODUCTION_SENTENCE =
  "This poster reproduces a photograph of an original ceramic piece, hand-shaped by Przemysław Gołębiewski - not an illustration.";

export const SEO_KEYWORDS = [
  "Przemysław Gołębiewski",
  "Przemyslaw Golebiewski",
  "self-taught ceramist",
  "ceramist Berlin",
  "handmade ceramics",
  "intuitive ceramics",
  "organic ceramics",
  "brutalist ceramics",
  "handbuilt ceramics",
  "ceramic vessels",
  "ceramic lamps",
  "stoneware",
  "Lelek Studio",
  "LELEK Berlin",
  "process first ceramics",
];

export const ABOUT_PAGE_KEYWORDS = [
  ...SEO_KEYWORDS,
  "Przemysław Gołębiewski ceramist",
  "self-taught ceramist Berlin",
  "organic shape brutalism",
];

export const ARCHITECTS_PAGE_KEYWORDS = [
  ...SEO_KEYWORDS,
  "ceramics for architects",
  "ceramics for interior designers",
  "hospitality ceramics",
  "interior design ceramics",
  "ceramic wall objects",
  "commissioned ceramics",
];

export const TRADE_DESCRIPTION =
  "Ceramic wall pieces, vessels, lamps and sculptural objects by Przemysław Gołębiewski for residential, hospitality and commercial spaces. Existing works, or a piece shaped with the project.";

export const CREATOR_KNOWS_ABOUT = [
  "Ceramics",
  "Handbuilt ceramics",
  "Stoneware",
  "Organic form",
  "Brutalism",
  "Ceramic lighting",
  "Intuitive making",
];

/** Copy that frames him as a mixed-media artist, or as "ceramic artist" instead of ceramist. */
const OFF_BRAND_MARKERS = [
  "ceramic artist",
  "mixed media",
  "oil pastel",
  "annie besant",
  "i don't have one style",
  "i don't stay in one of them",
  "through ceramics, sculpture and painting",
  "as a small boy",
  "peatlands",
  "produced in series",
] as const;

export function containsOffBrandCopy(text: string | undefined | null): boolean {
  const hay = (text ?? "").toLowerCase();
  if (!hay.trim()) return false;
  return OFF_BRAND_MARKERS.some((marker) => hay.includes(marker));
}

/** ASCII spelling still used in older CMS / schema - always lift to diacritics in public copy. */
export function withCreatorName(text: string): string {
  return text
    .replace(/Przemyslaw Golebiewski/g, CREATOR_NAME)
    .replace(/Przemysław Golebiewski/g, CREATOR_NAME)
    .replace(/Przemyslaw Gołębiewski/g, CREATOR_NAME);
}

export function resolveCreatorSignature(cms?: string): string {
  const text = cms?.trim() ?? "";
  if (!text || containsOffBrandCopy(text) || /Przemyslaw Golebiewski/i.test(text)) {
    return CREATOR_SIGNATURE;
  }
  return withCreatorName(text);
}

export function resolveSiteDescription(cms?: string): string {
  const text = cms?.trim() ?? "";
  if (
    !text ||
    containsOffBrandCopy(text) ||
    !/^(Przemysław Gołębiewski|Przemyslaw Golebiewski) is a self-taught ceramist/i.test(text)
  ) {
    return DEFAULT_DESCRIPTION;
  }
  return withCreatorName(text);
}

export function resolveHeroSemanticCore(cms?: string): string {
  const text = cms?.trim() ?? "";
  if (!text || containsOffBrandCopy(text) || !/^(Przemysław Gołębiewski|Przemyslaw Golebiewski) is a self-taught ceramist/i.test(text)) {
    return CREATOR_ENTITY_DESCRIPTION;
  }
  return withCreatorName(text);
}

export function resolveSignpostIntro(cms?: string): string {
  const text = cms?.trim() ?? "";
  if (
    !text ||
    containsOffBrandCopy(text) ||
    /works across ceramics, sculpture and print/i.test(text)
  ) {
    return SIGNPOST_INTRO;
  }
  return withCreatorName(text);
}

export function resolveElementsScopeNote(cms?: string): string {
  const text = cms?.trim() ?? "";
  if (!text || containsOffBrandCopy(text) || /wheel-thrown and shaped by hand/i.test(text)) {
    return ELEMENTS_SCOPE_NOTE;
  }
  return text;
}

export function isOffBrandStory(story: {
  heading?: string;
  body1?: string;
  body2?: string;
  body3?: string;
}): boolean {
  return containsOffBrandCopy(
    `${story.heading ?? ""} ${story.body1 ?? ""} ${story.body2 ?? ""} ${story.body3 ?? ""}`,
  );
}
