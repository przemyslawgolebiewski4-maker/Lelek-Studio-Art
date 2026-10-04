import { HomeSection, Setting } from "../models";
import { triggerLayoutRevalidate } from "./revalidate";

const CREATOR_NAME = "Przemysław Gołębiewski";

const CREATOR_ENTITY =
  "Przemysław Gołębiewski is a self-taught ceramist, working by intuition rather than plan. The process comes first, always - the hand moves, the mind follows after.";

const SITE_DESCRIPTION =
  "Przemysław Gołębiewski is a self-taught ceramist in Berlin. Working by intuition rather than plan, he shapes vessels, cups and lamps by hand - never exactly the same.";

const STORY = {
  eyebrow: "The ceramist",
  heading: "The process comes first,",
  headingEm: "always",
  body1: CREATOR_ENTITY,
  body2:
    "I want to bring warmth and something of nature into the home through what I make - I'm drawn to organic shapes, the play of texture, and the feel of a piece under my hands as it takes form. What fascinates me most is how concrete and nature sometimes meet without asking permission - how an organic shape, a natural color, can sit inside something as raw as brutalism and somehow belong there. My own work moves between those two registers: some pieces stay raw, closer to brutalism itself; others lean fully organic. And sometimes the two don't sit side by side at all - they mix into something that only makes sense with itself.",
  body3:
    "Materials with real, unrepeatable origins interest me most: a pigment found on a trip, a clay mix that may never come back the same way twice. The process leaves its own marks - a crack stabilized, not hidden; a drip left where water carried it. What the kiln and the material decide together, not just the maker alone. Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences, shaped by hand, not by mold.",
  signature: "Przemysław Gołębiewski - ceramist",
  originalsHeading: "Shaped by hand, not by mold",
  originalsIntro:
    "Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences.",
};

const SIGNPOST_INTRO =
  "LELEK is the ceramic practice of Przemysław Gołębiewski. Organic and brutalist forms, shaped by hand - vessels, cups, lamps and objects that never repeat exactly.";

const SIGNPOST_CARDS: Record<string, string> = {
  Shop: "Vessels, cups, lamps and objects. Forms that repeat, never exactly.",
  About: `${CREATOR_NAME} - self-taught ceramist. Process first, always.`,
  Process: "Notes on clay, kiln, texture, and what the material decides.",
  Trade: "Works for spaces that can hold something raw, organic, or both.",
};

const STALE_SIGNPOST_CARD = new Set([
  "Ceramic objects, vessels, prints and wearable pieces for everyday use.",
  "The studio story and one-of-a-kind Originals for collectors.",
  "Notes on material, making and life in the Berlin studio.",
  "Commissions for hospitality, offices and private spaces.",
]);

const OFF_BRAND = [
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
];

function isOffBrand(text: unknown): boolean {
  const hay = String(text ?? "").toLowerCase();
  if (!hay.trim()) return false;
  return OFF_BRAND.some((m) => hay.includes(m));
}

function withCreatorName(text: string): string {
  return text
    .replace(/Przemyslaw Golebiewski/g, CREATOR_NAME)
    .replace(/Przemysław Golebiewski/g, CREATOR_NAME)
    .replace(/Przemyslaw Gołębiewski/g, CREATOR_NAME);
}

async function patchSetting(key: string, next: string, shouldReplace: (current: string) => boolean) {
  const row = await Setting.findOne({ key });
  const current = typeof row?.value === "string" ? row.value : "";
  if (!shouldReplace(current)) return false;
  await Setting.findOneAndUpdate({ key }, { key, value: next }, { upsert: true });
  return true;
}

/**
 * Idempotent: rewrite public brand copy that still frames the maker as a
 * mixed-media / ceramic artist, so Google reads Przemysław Gołębiewski
 * as a self-taught ceramist (core brand). Frontend resolvers are the
 * safety net if this has not run yet.
 */
export async function migrateBrandCoreCopy(): Promise<number> {
  let changed = 0;

    if (
      await patchSetting("description", SITE_DESCRIPTION, (current) => {
        if (!current.trim()) return true;
        if (isOffBrand(current)) return true;
        return !/^(Przemysław Gołębiewski|Przemyslaw Golebiewski) is a self-taught ceramist/i.test(
          current,
        );
      })
    ) {
    changed += 1;
  }

  const hero = await HomeSection.findOne({ sectionKey: "hero" });
  if (hero) {
    const content = { ...(hero.content as Record<string, unknown>) };
    let dirty = false;
    const semanticCore = String(content.semanticCore ?? "");
    if (!semanticCore.trim() || isOffBrand(semanticCore) || !/^(Przemysław Gołębiewski|Przemyslaw Golebiewski) is a self-taught ceramist/i.test(semanticCore)) {
      content.semanticCore = CREATOR_ENTITY;
      dirty = true;
    }
    const subheadline = String(content.subheadline ?? "");
    if (!subheadline.trim() || /Ceramic objects, vessels, prints/i.test(subheadline)) {
      content.subheadline =
        "Vessels, cups, lamps - organic and raw, shaped by hand, never exactly.";
      dirty = true;
    }
    const eyebrow = String(content.eyebrow ?? "");
    if (!eyebrow.trim() || /^Design through material\.?$/i.test(eyebrow)) {
      content.eyebrow = "The process comes first.";
      dirty = true;
    }
    const kozodoj = String(content.kozodoj ?? "");
    if (!kozodoj.trim() || /^Design through material\.?$/i.test(kozodoj)) {
      content.kozodoj = "The hand moves, the mind follows after.";
      dirty = true;
    }
    if (typeof content.imageAlt === "string" && /Przemyslaw Golebiewski/i.test(content.imageAlt)) {
      content.imageAlt = withCreatorName(content.imageAlt);
      dirty = true;
    }
    if (dirty) {
      hero.content = content;
      hero.markModified("content");
      await hero.save();
      changed += 1;
    }
  }

  const story = await HomeSection.findOne({ sectionKey: "story" });
  if (story) {
    const content = { ...(story.content as Record<string, unknown>) };
    const blob = `${content.heading ?? ""} ${content.body1 ?? ""} ${content.body2 ?? ""} ${content.body3 ?? ""}`;
    let dirty = false;
    if (isOffBrand(blob) || !String(content.body1 ?? "").trim()) {
      Object.assign(content, STORY);
      dirty = true;
    } else {
      for (const key of ["body1", "body2", "body3", "signature", "imageAlt"] as const) {
        if (typeof content[key] === "string" && /Przemyslaw Golebiewski/i.test(content[key] as string)) {
          content[key] = withCreatorName(content[key] as string);
          dirty = true;
        }
      }
    }
    if (dirty) {
      story.content = content;
      story.markModified("content");
      await story.save();
      changed += 1;
    }
  }

  const signpost = await HomeSection.findOne({ sectionKey: "signpost" });
  if (signpost) {
    const content = { ...(signpost.content as Record<string, unknown>) };
    let dirty = false;
    const intro = String(content.intro ?? "");
    if (
      !intro.trim() ||
      isOffBrand(intro) ||
      /works across ceramics, sculpture and print/i.test(intro)
    ) {
      content.intro = SIGNPOST_INTRO;
      dirty = true;
    }
    if (Array.isArray(content.cards)) {
      content.cards = (content.cards as { label?: string; description?: string }[]).map((card) => {
        const label = String(card.label ?? "");
        const description = String(card.description ?? "");
        if (
          !description.trim() ||
          isOffBrand(description) ||
          STALE_SIGNPOST_CARD.has(description)
        ) {
          dirty = true;
          return { ...card, description: SIGNPOST_CARDS[label] || description };
        }
        if (/Przemyslaw Golebiewski/i.test(description)) {
          dirty = true;
          return { ...card, description: withCreatorName(description) };
        }
        return card;
      });
    }
    if (dirty) {
      signpost.content = content;
      signpost.markModified("content");
      await signpost.save();
      changed += 1;
    }
  }

  const architects = await HomeSection.findOne({ sectionKey: "architects" });
  if (architects) {
    const content = { ...(architects.content as Record<string, unknown>) };
    const hasNewModel = ["collabHeadline", "inviteHeadline", "dek"].some((key) =>
      String(content[key] ?? "").trim(),
    );
    if (!hasNewModel) {
      const next: Record<string, unknown> = {
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
      const previousHero = typeof content.heroImage === "string" ? content.heroImage.trim() : "";
      if (previousHero) {
        next.existingImage = previousHero;
        next.existingCaption = "Existing works, photographed in the studio.";
        next.existingImageAlt = "Ceramic vessels photographed in the studio";
      }
      architects.content = next;
      architects.markModified("content");
      await architects.save();
      changed += 1;
    }
  }

  const elements = await HomeSection.findOne({ sectionKey: "elements" });
  if (elements) {
    const content = { ...(elements.content as Record<string, unknown>) };
    const scope = String(content.scopeNote ?? "");
    if (!scope.trim() || isOffBrand(scope) || /wheel-thrown and shaped by hand/i.test(scope)) {
      content.scopeNote =
        "Stoneware shaped by hand, not by mold - organic and raw, shown below in the studio's four elements: earth, water, fire, air.";
      elements.content = content;
      elements.markModified("content");
      await elements.save();
      changed += 1;
    }
  }

  const find = await HomeSection.findOne({ sectionKey: "find" });
  if (find) {
    const content = { ...(find.content as Record<string, unknown>) };
    const online = String(content.onlineDescription ?? "");
    const tagline = String(content.lelekMeaning ?? "");
    let dirty = false;
    if (
      !online.trim() ||
      /prints and wearable pieces/i.test(online)
    ) {
      content.onlineDescription =
        "Vessels, cups, lamps and objects - each one a little different from the last.";
      dirty = true;
    }
    if (/^Design through material\.?$/i.test(tagline)) {
      content.lelekMeaning = "The hand moves, the mind follows after.";
      dirty = true;
    }
    if (dirty) {
      find.content = content;
      find.markModified("content");
      await find.save();
      changed += 1;
    }
  }

  if (changed > 0) {
    try {
      await triggerLayoutRevalidate();
    } catch (err) {
      console.warn("[migrate-brand-core] revalidate failed:", err);
    }
  }

  return changed;
}
