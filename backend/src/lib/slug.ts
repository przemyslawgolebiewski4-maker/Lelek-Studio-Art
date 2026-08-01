import { Product } from "../models";

/** URL-safe slug: lowercase, hyphens only, no leading/trailing dashes. */
export function normalizeSlug(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fix product slugs that contain characters outside [a-z0-9-]
 * (e.g. trailing "]" from a pasted value). Safe to run on every boot.
 */
export async function sanitizeProductSlugs(): Promise<number> {
  const products = await Product.find({ slug: { $regex: /[^a-z0-9-]/ } })
    .select("_id slug")
    .lean();

  let fixed = 0;
  for (const product of products) {
    const next = normalizeSlug(product.slug);
    if (!next || next === product.slug) continue;

    const clash = await Product.findOne({ slug: next, _id: { $ne: product._id } })
      .select("_id")
      .lean();
    if (clash) continue;

    await Product.updateOne({ _id: product._id }, { $set: { slug: next } });
    fixed += 1;
  }
  return fixed;
}
