import { connectDB } from "@/lib/mongodb";
import { HomeSection, Product, Setting } from "@/models";

export async function getSiteSettings() {
  await connectDB();
  const rows = await Setting.find().lean();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export type HomeSectionKey =
  | "hero"
  | "story"
  | "elements"
  | "featured"
  | "architects"
  | "journal"
  | "find";

export async function getHomeSection(slug: HomeSectionKey) {
  await connectDB();
  return HomeSection.findOne({ sectionKey: slug, visible: true }).lean();
}

export async function getFeaturedProducts(limit = 3) {
  await connectDB();
  return Product.find({ published: true }).sort({ order: 1 }).limit(limit).lean();
}

export async function getPublicHomeData() {
  await connectDB();
  const [settings, heroDoc, featured] = await Promise.all([
    getSiteSettings(),
    getHomeSection("hero"),
    getFeaturedProducts(3),
  ]);

  return {
    settings,
    hero: (heroDoc?.content ?? {}) as Record<string, string>,
    featured,
  };
}
