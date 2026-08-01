import type { ProductCategory } from "@/types/product";

/** Display labels for product detail / Works separators */
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ceramics: "Functional ceramic",
  vessels: "Vessels",
  "wall-objects": "Wall objects and Objects",
  prints: "Prints",
};

/** Filter tab labels in Works */
export const CATEGORY_TAB_LABELS: Record<ProductCategory, string> = {
  ceramics: "Ceramics",
  vessels: "Vessels",
  "wall-objects": "Wall objects",
  prints: "Prints",
};

/** Works hierarchy order - Prints last, before Acquire on the public flow */
export const CATEGORY_ORDER: ProductCategory[] = [
  "ceramics",
  "vessels",
  "wall-objects",
  "prints",
];

export const CATEGORY_INDEX: Record<ProductCategory, string> = {
  ceramics: "01",
  vessels: "02",
  "wall-objects": "03",
  prints: "04",
};

/** Catalog number prefixes (Courier New uppercase: CE-001, PR-001, …) */
export const CATEGORY_CATALOG_PREFIX: Record<ProductCategory, string> = {
  ceramics: "CE",
  vessels: "VE",
  "wall-objects": "WO",
  prints: "PR",
};

/** Anchor ids for /collections#… (legacy #wall maps to wall-objects) */
export const CATEGORY_ANCHOR: Record<ProductCategory, string> = {
  ceramics: "ceramics",
  vessels: "vessels",
  "wall-objects": "wall-objects",
  prints: "prints",
};

export function parseCategoryAnchor(hash: string): ProductCategory | null {
  const raw = hash.replace(/^#/, "").trim().toLowerCase();
  if (!raw) return null;
  if (raw === "wall") return "wall-objects";
  if ((CATEGORY_ORDER as string[]).includes(raw)) return raw as ProductCategory;
  return null;
}

export function isProductCategory(value: string): value is ProductCategory {
  return (CATEGORY_ORDER as string[]).includes(value);
}
