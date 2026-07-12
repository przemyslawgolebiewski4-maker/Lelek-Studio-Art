import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { connectDB } from "./db";
import { HomeSection, Product, Setting, JournalPost } from "../models";

type HomeSectionKey =
  | "hero"
  | "story"
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
  const candidates = [
    join(process.cwd(), "data", "content.json"),
    join(process.cwd(), "..", "_legacy", "data", "content.json"),
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf-8")) as LegacyContent;
    }
  }

  throw new Error(`Seed content not found. Tried: ${candidates.join(", ")}`);
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

  const settings = [
    ["site_name", site.name],
    ["tagline", site.tagline],
    ["description", site.description],
    ["email", site.email],
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
        eyebrow: legacy.hero.eyebrow,
        headline: legacy.hero.headline,
        headlineEm: legacy.hero.headlineEm,
        quote: legacy.hero.quote,
        subheadline: legacy.hero.subheadline,
        image: legacy.hero.image,
        imageMobile: legacy.hero.imageMobile,
        imageAlt: legacy.hero.imageAlt,
        video: "",
        videoMobile: "",
        imageCaption: "Vessel — Clay Stories Berlin",
        cta1Text: "View works",
        cta1Url: "/collections",
        cta2Text: "My story",
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
      },
    },
    {
      sectionKey: "elements",
      order: 2,
      content: { items: legacy.elements },
    },
    {
      sectionKey: "featured",
      order: 3,
      content: {
        eyebrow: legacy.featured.eyebrow,
        heading: legacy.featured.heading,
        headingEm: legacy.featured.headingEm,
      },
    },
    {
      sectionKey: "architects",
      order: 4,
      content: {
        eyebrow: "For architects & designers",
        headline: "Looking for something made by hand, not manufactured?",
        sub: "Ceramics for residential, hospitality, and concept stores.",
        body: "Wall objects, vessels and functional pieces for contemporary interiors. Custom dimensions and glazes available on request.",
        ctaText: "Get in touch",
        ctaUrl: "/for-architects",
      },
    },
    {
      sectionKey: "journal",
      order: 5,
      content: {
        eyebrow: "Journal",
        heading: "Stories from",
        headingEm: "the studio",
        sub: "Notes on process, material and making in Berlin.",
      },
    },
    {
      sectionKey: "find",
      order: 6,
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
  const catalogs = ["001", "002", "003"];

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
        description: `Handmade ${item.meta.toLowerCase()} from Berlin.`,
        images: [item.image],
        metaTitle: `${item.title} | Lelek Studio`,
        metaDescription: item.alt,
        published: true,
        order: i,
        etsyUrl: site.etsy,
      },
      { upsert: true },
    );
  }

  const journalPosts = [
    {
      slug: "first-firing-notes",
      title: "First firing notes",
      excerpt: "What happens when you stop planning and let the kiln decide.",
      body: "## Slow process\n\nEach batch is small. The glaze never lands exactly where you expect — and that is the point.\n\nI work in short sessions at Clay Stories Berlin, trimming and glazing between other commitments. The pieces that survive the first firing often surprise me most.",
      coverImage: "/images/process/studio.jpg",
      metaTitle: "First firing notes | Lelek Studio Journal",
      metaDescription: "Notes from the first kiln opening at Clay Stories Berlin.",
      published: true,
      order: 0,
    },
    {
      slug: "on-handbuilding",
      title: "On handbuilding",
      excerpt: "Wall objects shaped without the wheel — form emerging from clay.",
      body: "## Intuitive handbuilding\n\nWall objects start differently from cups and bowls. No wheel — just hands, clay, and time.\n\nEach piece grows slowly. I rarely sketch first. The material suggests what it wants to become.",
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
