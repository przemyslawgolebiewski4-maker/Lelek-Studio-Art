import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalPostContent } from "@/components/public/JournalPostContent";
import { getJournalPostBySlug } from "@/lib/site";
import { SITE_URL } from "@/lib/config";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    alternates: { canonical: `${SITE_URL}/journal/${slug}` },
  };
}

export const revalidate = 60;

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  return <JournalPostContent post={post} />;
}
