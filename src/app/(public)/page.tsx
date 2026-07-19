import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { FeaturedWorks } from "@/components/public/FeaturedWorks";
import { AcquireBar } from "@/components/public/AcquireBar";
import { HomeStorySection } from "@/components/public/HomeStorySection";
import { HomeElementsBar } from "@/components/public/HomeElementsBar";
import { HomeArchitectsCta } from "@/components/public/HomeArchitectsCta";
import { HomeJournalTeaser } from "@/components/public/HomeJournalTeaser";
import { HomeFindSection } from "@/components/public/HomeFindSection";
import { DEFAULT_HERO, getPublicHomeData } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lelek Studio Berlin — Shaped by hand, guided by instinct",
  description:
    "Handmade stoneware objects, vessels and wall pieces by ceramist Przemyslaw Golebiewski in Berlin.",
};

export const revalidate = 60;

export default async function HomePage() {
  const {
    settings,
    hero,
    featuredSection,
    homeProducts,
    story,
    elements,
    architects,
    journalSection,
    journalPosts,
    find,
  } = await getPublicHomeData();

  const elementItems = elements;

  return (
    <>
      <Hero
        content={Object.keys(hero).length > 0 ? hero : DEFAULT_HERO}
        elements={elementItems}
      />
      <HomeStorySection story={story} />
      <HomeElementsBar items={elementItems} />
      <FeaturedWorks section={featuredSection} homeProducts={homeProducts} />
      <AcquireBar etsyUrl={settings.etsy_url ?? find.etsyUrl} />
      <HomeArchitectsCta section={architects} />
      <HomeJournalTeaser section={journalSection} posts={journalPosts} />
      <HomeFindSection section={find} email={settings.email} />
    </>
  );
}
