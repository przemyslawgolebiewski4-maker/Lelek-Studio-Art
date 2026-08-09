import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { HomeStorySection } from "@/components/public/HomeStorySection";
import { HomeElementsBar } from "@/components/public/HomeElementsBar";
import { HomeJournalTeaser } from "@/components/public/HomeJournalTeaser";
import { HomeFindSection } from "@/components/public/HomeFindSection";
import { Signpost } from "@/components/public/Signpost";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, SHOP_URL } from "@/lib/config";
import { DEFAULT_HERO, DEFAULT_SIGNPOST, getPublicHomeData } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Lelek Studio Berlin - Shaped by hand, guided by instinct" },
  description:
    "Handmade stoneware objects, vessels and wall pieces by ceramist Przemyslaw Golebiewski in Berlin.",
  alternates: { canonical: `${SITE_URL}/` },
};

export const revalidate = 60;

/** Canonical hero copy - overrides stale CMS headline/quote. */
const HERO_COPY = {
  eyebrow: "Design through material.",
  subheadline: "Ceramic objects, vessels, prints.",
  brandline: "LELEK — Berlin.",
  quote: "",
  headline: "",
  headlineEm: "",
} as const;

export default async function HomePage() {
  const {
    settings,
    hero,
    story,
    signpost,
    elements,
    elementsSection,
    journalSection,
    journalPosts,
    find,
  } = await getPublicHomeData();

  const elementItems = elements;
  const heroContent = {
    ...(Object.keys(hero).length > 0 ? hero : DEFAULT_HERO),
    ...HERO_COPY,
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LELEK",
    alternateName: "Lelek Studio Berlin",
    url: SITE_URL,
    logo: `${SITE_URL}/images/og-image.png`,
    sameAs: [
      settings.instagram || "https://www.instagram.com/lelek.studio.berlin/",
      SHOP_URL,
    ].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <Hero content={heroContent} elements={elementItems} />
      <Signpost section={signpost ?? DEFAULT_SIGNPOST} />
      <HomeStorySection story={story} />
      <HomeElementsBar
        items={elementItems}
        scopeNote={
          elementsSection.scopeNote ||
          "Ceramics process, below - Mire & Silt collections only"
        }
      />
      <HomeJournalTeaser section={journalSection} posts={journalPosts} />
      <HomeFindSection section={find} email={settings.email} shopUrl={SHOP_URL} />
    </>
  );
}
