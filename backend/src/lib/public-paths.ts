import { connectDB } from "./db";
import { JournalPost, Product } from "../models";

/**
 * Static public routes that share src/app/(public)/layout.tsx (nav + footer).
 * Keep in sync with route segments under the public app group.
 */
export const ALL_PUBLIC_STATIC_PATHS = [
  "/",
  "/about",
  "/for-architects",
  "/contact",
  "/impressum",
  "/datenschutz",
  "/widerrufsrecht",
  "/journal",
  "/galleries",
  "/collections",
] as const;

/**
 * All layout-shared paths for on-demand ISR.
 * revalidatePath does not support wildcards; dynamic slugs are resolved from MongoDB.
 * New journal posts / products still revalidate their own URL on create/update.
 */
export async function resolveAllPublicPaths(): Promise<string[]> {
  await connectDB();
  const [products, posts] = await Promise.all([
    Product.find({ published: true }).select("slug").lean(),
    JournalPost.find({ published: true }).select("slug").lean(),
  ]);

  const dynamic = [
    ...products.map((p) => `/objects/${p.slug}`),
    ...posts.map((p) => `/journal/${p.slug}`),
  ];

  return [...ALL_PUBLIC_STATIC_PATHS, ...dynamic];
}

/** Home sections whose saves affect nav/footer via (public)/layout.tsx. */
export function sectionAffectsLayout(sectionKey: string): boolean {
  return sectionKey === "find";
}

/**
 * Narrow revalidation targets: only routes that render this section's content.
 * Verified against frontend usage (not "might link to").
 */
export function getSectionRevalidatePaths(sectionKey: string): string[] {
  switch (sectionKey) {
    case "hero":
    case "signpost":
    case "elements":
    case "featured":
      return ["/"];
    case "story":
      return ["/", "/about"];
    case "architects":
      return ["/for-architects"];
    case "journal":
      return ["/", "/journal"];
    default:
      return ["/"];
  }
}
