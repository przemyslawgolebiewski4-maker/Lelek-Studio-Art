import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { serverFetch } from "@/lib/api-server";
import { normalizeSlug } from "@/lib/slug";
import type { Product } from "@/types/product";
import type { JournalPostSummary } from "@/types/content";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "weekly" },
  { path: "/galleries", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/for-architects", priority: 0.7, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.6, changeFrequency: "weekly" },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
  { path: "/widerrufsrecht", priority: 0.3, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, journalPosts] = await Promise.all([
    serverFetch<Product[]>("/products/public?limit=50", { fallback: [] }),
    serverFetch<JournalPostSummary[]>("/journal/public", { fallback: [] }),
  ]);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: path ? `${SITE_URL}${path}` : `${SITE_URL}/`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/objects/${normalizeSlug(product.slug) || product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const journalEntries: MetadataRoute.Sitemap = journalPosts.map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...journalEntries];
}
