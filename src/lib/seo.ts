import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const SITE_NAME = "Lelek Studio Berlin";

export const DEFAULT_TAGLINE = "Shaped by hand, guided by instinct";

export const DEFAULT_DESCRIPTION =
  "LELEK Studio Berlin - ceramist Przemyslaw Golebiewski shapes functional ceramics, lighting, sculpture and vases from natural materials, guided by nature and intuition.";

/** Stable absolute OG/Twitter image URL (1200×630). Also served via app/opengraph-image.png. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.png`;

/** Next.js file-metadata OG image (same asset as app/opengraph-image.png). */
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/opengraph-image.png`;

export const DEFAULT_OG_IMAGE_ALT =
  "Lelek Studio Berlin - ceramics, lighting, sculpture and vases shaped by hand from natural materials.";

export const SEO_KEYWORDS = [
  "ceramics",
  "handmade ceramics",
  "Berlin ceramist",
  "stoneware",
  "Lelek Studio",
  "Przemyslaw Golebiewski",
  "functional ceramics",
  "wall objects",
  "prints",
  "ceramic prints",
  "natural materials",
  "nature-inspired ceramics",
  "ceramic lighting",
  "architectural ceramics",
  "ceramic sculpture",
  "ceramic vases",
  "intuitive ceramics",
];

export const ABOUT_PAGE_KEYWORDS = [
  ...SEO_KEYWORDS,
  "ceramist Berlin",
  "intuitive handbuilding",
  "mixed media artist",
  "self-taught ceramist",
];

export const ARCHITECTS_PAGE_KEYWORDS = [
  ...SEO_KEYWORDS,
  "ceramics for architects",
  "hospitality ceramics",
  "interior design ceramics",
  "commissioned ceramic pieces",
];

export function resolveSiteName(settings: Record<string, string>): string {
  return settings.site_name?.trim() || SITE_NAME;
}

/** Keep name=description, og:description, and twitter:description identical on a page. */
export function withPageDescription(description: string, metadata: Metadata = {}): Metadata {
  const desc = description.trim();
  const rawImages = metadata.openGraph?.images;
  const customImages = rawImages
    ? Array.isArray(rawImages)
      ? rawImages
      : [rawImages]
    : [];
  const ogImages =
    customImages.length > 0
      ? customImages
      : [{ url: DEFAULT_OG_IMAGE_URL, alt: DEFAULT_OG_IMAGE_ALT }];

  const twitterImages = ogImages
    .map((img) => {
      if (typeof img === "string") return img;
      if (img instanceof URL) return img.toString();
      return img.url instanceof URL ? img.url.toString() : img.url;
    })
    .filter((url): url is string => Boolean(url));

  return {
    ...metadata,
    description: desc,
    openGraph: {
      type: "website",
      ...metadata.openGraph,
      description: desc,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      ...metadata.twitter,
      description: desc,
      images: twitterImages.length > 0 ? twitterImages : undefined,
    },
  };
}
