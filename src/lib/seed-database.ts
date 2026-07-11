import { readFileSync } from "fs";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import { HomeSection, Product, Setting } from "@/models";
import type { HomeSectionKey } from "@/lib/site";

type LegacyContent = {
  site: Record<string, string>;
  hero: Record<string, string>;
  story: Record<string, string>;
  elements: { number: string; name: string }[];
  featured: { items: { title: string; meta: string; image: string; alt: string }[] };
};

function loadLegacyContent(): LegacyContent {
  const legacyPath = join(process.cwd(), "_legacy/data/content.json");
  return JSON.parse(readFileSync(legacyPath, "utf-8")) as LegacyContent;
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
        signature: legacy.story.signature,
        image: legacy.story.image,
        imageMobile: legacy.story.imageMobile,
        imageAlt: legacy.story.imageAlt,
      },
    },
    {
      sectionKey: "elements",
      order: 2,
      content: { items: legacy.elements },
    },
    {
      sectionKey: "architects",
      order: 4,
      content: {
        headline: "Looking for something made by hand, not manufactured?",
        sub: "Ceramics for residential, hospitality, and concept stores.",
        ctaText: "Get in touch",
        ctaUrl: "/for-architects",
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

  return {
    skipped: false,
    message: "Seed complete.",
    counts: {
      products: await Product.countDocuments(),
      settings: await Setting.countDocuments(),
      homeSections: await HomeSection.countDocuments(),
    },
  };
}
