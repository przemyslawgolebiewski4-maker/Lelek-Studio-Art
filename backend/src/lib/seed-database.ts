import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { connectDB } from "./db";
import { HomeSection, Product, Setting, JournalPost } from "../models";

type HomeSectionKey =
  | "hero"
  | "story"
  | "signpost"
  | "elements"
  | "featured"
  | "architects"
  | "journal"
  | "find";

type LegacyContent = {
  site: Record<string, string>;
  hero: Record<string, string>;
  story: Record<string, string>;
  elements: { number: string; name: string }[];
  featured: {
    eyebrow: string;
    heading: string;
    headingEm: string;
    items: { title: string; meta: string; image: string; alt: string }[];
  };
};

function loadLegacyContent(): LegacyContent {
  // Seed source of truth: backend/data/content.json (cwd is backend/ when seeding)
  const path = join(process.cwd(), "data", "content.json");
  if (!existsSync(path)) {
    throw new Error(`Seed content not found at ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf-8")) as LegacyContent;
}

export async function seedDatabase(options?: { force?: boolean }) {
  await connectDB();

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0 && !options?.force) {
    return {
      skipped: true,
      message: "Database already has products. Pass force=true to re-seed.",
      counts: {
        products: existingProducts,
        settings: await Setting.countDocuments(),
        homeSections: await HomeSection.countDocuments(),
        journalPosts: await JournalPost.countDocuments(),
      },
    };
  }

  const legacy = loadLegacyContent();
  const site = legacy.site;

  const defaultShopUrl =
    (process.env.NEXT_PUBLIC_SHOP_URL || process.env.SHOP_URL || "https://shop.lelekstudio.com")
      .trim()
      .replace(/\/+$/, "") || "https://shop.lelekstudio.com";

  const settings = [
    ["site_name", site.name],
    ["tagline", site.tagline],
    ["description", site.description],
    ["email", site.email],
    ["shop_url", defaultShopUrl],
    ["etsy_url", site.etsy],
    ["instagram", site.instagram],
    ["instagram_handle", site.instagramHandle],
    ["artist_url", site.artistUrl],
    ["location", site.location],
  ];

  for (const [key, value] of settings) {
    await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true });
  }

  const sections: {
    sectionKey: HomeSectionKey;
    order: number;
    content: Record<string, unknown>;
  }[] = [
    {
      sectionKey: "hero",
      order: 0,
      content: {
        eyebrow: "The process comes first.",
        headline: "",
        headlineEm: "",
        quote: "",
        subheadline: "Vessels, cups, lamps - organic and raw, shaped by hand, never exactly.",
        semanticCore:
          "Przemysław Gołębiewski is a self-taught ceramist, working by intuition rather than plan. The process comes first, always - the hand moves, the mind follows after.",
        brandline: "LELEK - Berlin.",
        kozodoj: "The hand moves, the mind follows after.",
        image: legacy.hero.image,
        imageMobile: legacy.hero.imageMobile,
        imageAlt: legacy.hero.imageAlt,
        video: "",
        videoMobile: "",
        imageCaption: "Vessel - Clay Stories Berlin",
        cta1Text: "Shop",
        cta1Url: "/contact",
        cta2Text: "About",
        cta2Url: "/about",
      },
    },
    {
      sectionKey: "story",
      order: 1,
      content: {
        eyebrow: legacy.story.eyebrow,
        heading: legacy.story.heading,
        headingEm: legacy.story.headingEm,
        body1: legacy.story.body1,
        body2: legacy.story.body2,
        body3: legacy.story.body3,
        signature: legacy.story.signature,
        image: legacy.story.image,
        imageMobile: legacy.story.imageMobile,
        imageAlt: legacy.story.imageAlt,
        imageCaption: legacy.story.imageCaption,
        video: "",
        videoMobile: "",
        gallery: [],
        ctaShopLabel: "Shop the collections",
        ctaTradeLabel: "Designing a space?",
        originalsEyebrow: "Originals",
        originalsHeading: "Shaped by hand, not by mold",
        originalsIntro:
          "Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences.",
      },
    },
    {
      sectionKey: "signpost",
      order: 2,
      content: {
        intro:
          "LELEK is the ceramic practice of Przemysław Gołębiewski. Organic and brutalist forms, shaped by hand - vessels, cups, lamps and objects that never repeat exactly.",
        tradeSignal: "Designing a space? Let's talk",
        tradeHref: "/for-architects",
        cards: [
          {
            label: "Shop",
            description: "Vessels, cups, lamps and objects. Forms that repeat, never exactly.",
            href: "https://shop.lelekstudio.com",
          },
          {
            label: "About",
            description: "Przemysław Gołębiewski - self-taught ceramist. Process first, always.",
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
      },
    },
    {
      sectionKey: "elements",
      order: 3,
      content: {
        items: legacy.elements,
        scopeNote:
          "Stoneware shaped by hand, not by mold - organic and raw, shown below in the studio's four elements: earth, water, fire, air.",
      },
    },
    {
      sectionKey: "featured",
      order: 4,
      content: {
        eyebrow: legacy.featured.eyebrow,
        heading: legacy.featured.heading,
        headingEm: legacy.featured.headingEm,
      },
    },
    {
      sectionKey: "architects",
      order: 5,
      content: {
        eyebrow: "For architects & interior designers",
        headline: "A space is never just a space.",
        dek: "Ceramic objects that change how a space feels.",
        heroBody:
          "Some spaces need a focal point. Others need texture, contrast or something unexpected. A ceramic object can do more than fill a space - it can shift its atmosphere, create a connection between materials or bring a sense of presence to an otherwise quiet interior.",
        intro:
          "LELEK creates ceramic wall pieces, vessels, lamps and sculptural objects for residential, hospitality and commercial spaces. Raw, organic forms meet architectural structure, bringing material, texture and a different kind of expression into the spaces we inhabit.",
        heroImage: "",
        heroImageMobile: "",
        heroVideo: "",
        heroVideoMobile: "",
        heroImageAlt: "Ceramic object by Przemysław Gołębiewski placed in an interior",
        heroCaption:
          "A studio arrangement - the object in relation to a wall, a surface, a light. Not a completed client project.",
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
        existingImage: "",
        existingImageAlt: "Existing ceramic work",
        existingCaption: "An existing work, as it is.",
        processImage: "",
        processImageAlt: "Ceramic piece taking shape in the studio",
        processCaption: "In the studio - a form taking shape.",
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
        inviteSignoff:
          "LELEK is an independent ceramic practice by Przemysław Gołębiewski, who designs and makes each commissioned piece by hand in Berlin.",
        formEyebrow: "Project inquiry",
        formIntro:
          "Tell me about your space, your project and the kind of object you have in mind. Include reference images, approximate dimensions and your project timeline if available.",
        formCta: "Let's start a conversation.",
        formEmail: "lelekstudio@lelekstudio.com",
        formSuccessTitle: "Message received.",
        formSuccessBody: "Thank you. I will reply within a few business days.",
        ctaText: "Get in touch",
        ctaUrl: "/for-architects",
      },
    },
    {
      sectionKey: "journal",
      order: 6,
      content: {
        eyebrow: "Journal",
        heading: "Notes on process",
        headingEm: "and material",
        sub: "What the kiln and the material decide together.",
      },
    },
    {
      sectionKey: "find",
      order: 7,
      content: {
        studioName: site.studioName,
        studioAddress: site.studioAddress,
        studioInstagram: site.studioInstagramHandle,
        etsyUrl: site.etsy,
        lelekMeaning: site.lelekMeaning,
      },
    },
  ];

  for (const section of sections) {
    await HomeSection.findOneAndUpdate(
      { sectionKey: section.sectionKey },
      { $set: section },
      { upsert: true },
    );
  }

  const featured = legacy.featured.items.slice(0, 3);
  const categories = ["ceramics", "ceramics", "vessels"] as const;
  const catalogs = ["CE-001", "CE-002", "VE-001"];

  for (let i = 0; i < featured.length; i++) {
    const item = featured[i];
    const slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await Product.findOneAndUpdate(
      { slug },
      {
        slug,
        catalog: catalogs[i],
        title: item.title,
        category: categories[i],
        material: item.meta,
        description: `Shaped by hand in Berlin - ${item.meta.toLowerCase()}. Each piece a little different from the last.`,
        images: [item.image],
        metaTitle: `${item.title} | Lelek Studio`,
        metaDescription: item.alt,
        published: true,
        order: i,
        etsyUrl: site.etsy,
        isPhotoReproduction: false,
      },
      { upsert: true },
    );
  }

  await Product.findOneAndUpdate(
    { slug: "lelek-sentences-01" },
    {
      slug: "lelek-sentences-01",
      catalog: "PR-001",
      title: "LELEK Sentences 01",
      category: "prints",
      material: "Archival pigment print on paper",
      description:
        "This poster reproduces a photograph of an original ceramic piece, hand-shaped by Przemysław Gołębiewski - not an illustration. A quiet record of form and surface from the studio. Printed to order. Shipped from Europe.",
      process: "Photographed in natural light, printed on archival paper.",
      images: ["/images/featured/feat-1.jpg"],
      metaTitle: "LELEK Sentences 01 | Lelek Studio",
      metaDescription:
        "Archival print reproducing a photograph of an original ceramic piece by Przemysław Gołębiewski - Lelek Studio Berlin.",
      published: true,
      order: 10,
      etsyUrl: site.etsy,
      isPhotoReproduction: true,
    },
    { upsert: true },
  );

  const journalPosts = [
    {
      slug: "first-firing-notes",
      title: "First firing notes",
      excerpt: "What happens when you stop planning and let the kiln decide.",
      body: "## Slow process\n\nEach batch is small. The glaze never lands exactly where you expect - and that is the point.\n\nI work in short sessions at Clay Stories Berlin, trimming and glazing between other commitments. The pieces that survive the first firing often surprise me most.",
      coverImage: "/images/process/studio.jpg",
      metaTitle: "First firing notes | Lelek Studio Journal",
      metaDescription: "Notes from the first kiln opening at Clay Stories Berlin.",
      published: true,
      order: 0,
    },
    {
      slug: "on-handbuilding",
      title: "On handbuilding",
      excerpt: "Wall objects shaped without the wheel - form emerging from clay.",
      body: "## Intuitive handbuilding\n\nWall objects start differently from cups and bowls. No wheel - just hands, clay, and time.\n\nEach piece grows slowly. I rarely sketch first. The material suggests what it wants to become.",
      coverImage: "/images/wall/wall-1.jpg",
      metaTitle: "On handbuilding | Lelek Studio Journal",
      metaDescription: "How wall objects are built at Lelek Studio Berlin.",
      published: true,
      order: 1,
    },
  ];

  for (const post of journalPosts) {
    await JournalPost.findOneAndUpdate({ slug: post.slug }, { $set: post }, { upsert: true });
  }

  return {
    skipped: false,
    message: "Seed complete.",
    counts: {
      products: await Product.countDocuments(),
      settings: await Setting.countDocuments(),
      homeSections: await HomeSection.countDocuments(),
      journalPosts: await JournalPost.countDocuments(),
    },
  };
}
