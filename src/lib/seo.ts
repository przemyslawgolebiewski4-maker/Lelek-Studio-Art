import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import {
  ABOUT_PAGE_KEYWORDS,
  ARCHITECTS_PAGE_KEYWORDS,
  CREATOR_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TAGLINE,
  SEO_KEYWORDS,
  STUDIO_NAME_LONG,
  TRADE_DESCRIPTION,
} from "@/lib/brand";

export const SITE_NAME = STUDIO_NAME_LONG;

export {
  ABOUT_PAGE_KEYWORDS,
  ARCHITECTS_PAGE_KEYWORDS,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TAGLINE,
  SEO_KEYWORDS,
  TRADE_DESCRIPTION,
};

export { CREATOR_NAME };

/** Stable absolute OG/Twitter image URL (1200×630). Also served via app/opengraph-image.png. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.png`;

/** Next.js file-metadata OG image (same asset as app/opengraph-image.png). */
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/opengraph-image.png`;

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
