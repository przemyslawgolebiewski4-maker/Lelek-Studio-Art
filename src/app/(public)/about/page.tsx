import type { Metadata } from "next";
import { AboutContent } from "@/components/public/AboutContent";
import { getStorySection } from "@/lib/site";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStorySection();
  const title = [story.heading, story.headingEm].filter(Boolean).join(" ");
  return {
    title: title || "About",
    description: story.body1?.slice(0, 160),
    alternates: { canonical: `${SITE_URL}/about` },
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const story = await getStorySection();
  return <AboutContent story={story} />;
}
