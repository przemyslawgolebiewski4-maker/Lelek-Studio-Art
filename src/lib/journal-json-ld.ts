import type { JournalPost } from "@/types/content";
import { SITE_URL } from "@/lib/config";
import { ORGANIZATION_ID, buildCreatorRef } from "@/lib/person-json-ld";
import { STUDIO_NAME_LONG, withCreatorName } from "@/lib/brand";

/**
 * BlogPosting JSON-LD for /journal/[slug].
 * datePublished ← createdAt; dateModified ← updatedAt (falls back to createdAt).
 */
export function buildJournalPostJsonLd(post: JournalPost): Record<string, unknown> {
  const url = `${SITE_URL}/journal/${post.slug}`;
  const datePublished = post.createdAt
    ? new Date(post.createdAt).toISOString()
    : undefined;
  const dateModified = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: withCreatorName(
      post.metaDescription?.trim() || post.excerpt?.trim() || "",
    ) || undefined,
    image: post.coverImage || undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified,
    author: buildCreatorRef(),
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: STUDIO_NAME_LONG,
      url: SITE_URL,
    },
  };
}
