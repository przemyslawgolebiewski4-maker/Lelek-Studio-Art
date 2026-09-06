import type { JournalPost } from "@/types/content";
import { SITE_URL } from "@/lib/config";

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
    description: post.metaDescription?.trim() || post.excerpt?.trim() || undefined,
    image: post.coverImage || undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#person`,
      name: "Przemyslaw Golebiewski",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Lelek Studio Berlin",
      url: SITE_URL,
    },
  };
}
