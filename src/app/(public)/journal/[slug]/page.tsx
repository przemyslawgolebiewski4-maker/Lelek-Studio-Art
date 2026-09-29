import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalPostContent } from "@/components/public/JournalPostContent";
import { JsonLd } from "@/lib/json-ld";
import { buildJournalPostJsonLd } from "@/lib/journal-json-ld";
import { getJournalPostBySlug } from "@/lib/site";
import { withCreatorName } from "@/lib/brand";
import { SITE_URL } from "@/lib/config";
import { withPageDescription } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return { title: t(await getLocale(), "meta.missingPost") };

  const title = post.metaTitle || post.title;
  const description = withCreatorName(post.metaDescription || post.excerpt || "");

  return withPageDescription(description, {
    title,
    openGraph: {
      title,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    alternates: { canonical: `${SITE_URL}/journal/${slug}` },
  });
}

export const revalidate = 60;

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={buildJournalPostJsonLd(post)} />
      <JournalPostContent post={post} />
    </>
  );
}
