import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { FeaturedWorks } from "@/components/public/FeaturedWorks";
import { HomeStorySection } from "@/components/public/HomeStorySection";
import { HomeElementsBar } from "@/components/public/HomeElementsBar";
import { HomeArchitectsCta } from "@/components/public/HomeArchitectsCta";
import { HomeJournalTeaser } from "@/components/public/HomeJournalTeaser";
import { HomeFindSection } from "@/components/public/HomeFindSection";
import { DEFAULT_HERO, getPublicHomeData } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lelek Studio Berlin - Shaped by hand, guided by instinct",
  description:
    "Handmade stoneware objects, vessels and wall pieces by ceramist Przemyslaw Golebiewski in Berlin.",
};

export const revalidate = 60;

export default async function HomePage() {
  const {
    settings,
    hero,
    featured,
    featuredSection,
    story,
    elements,
    architects,
    journalSection,
    journalPosts,
    find,
  } = await getPublicHomeData();

  return (
    <>
      <Hero content={Object.keys(hero).length > 0 ? hero : DEFAULT_HERO} />
      <HomeStorySection story={story} />
      <HomeElementsBar items={elements} />
      {featured.length > 0 ? (
        <FeaturedWorks products={featured.slice(0, 6)} section={featuredSection} />
      ) : null}
      <HomeArchitectsCta section={architects} />
      <HomeJournalTeaser section={journalSection} posts={journalPosts} />
      <HomeFindSection section={find} email={settings.email} />
    </>
  );
}
