import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { HomeStorySection } from "@/components/public/HomeStorySection";
import { HomeElementsBar } from "@/components/public/HomeElementsBar";
import { HomeJournalTeaser } from "@/components/public/HomeJournalTeaser";
import { HomeFindSection } from "@/components/public/HomeFindSection";
import { Signpost } from "@/components/public/Signpost";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, resolveShopUrl, resolveInstagramUrl } from "@/lib/config";
import { DEFAULT_HERO, DEFAULT_SIGNPOST, getPublicHomeData } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Lelek Studio Berlin - Shaped by hand, guided by instinct" },
  description:
    "Handmade stoneware objects, vessels and wall pieces by ceramist Przemyslaw Golebiewski in Berlin.",
  alternates: { canonical: `${SITE_URL}/` },
};

export const revalidate = 60;

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
  const shopUrl = resolveShopUrl(settings);
  // CMS wins when set; DEFAULT_HERO fills empty fields (editable in /admin/home → Hero)
  const heroContent = {
    ...DEFAULT_HERO,
    ...hero,
    cta1Url: (hero.cta1Url as string | undefined)?.trim() || shopUrl,
  };

  const signpostSection = signpost ?? {
    ...DEFAULT_SIGNPOST,
    cards: DEFAULT_SIGNPOST.cards?.map((card, i) =>
      i === 0 ? { ...card, href: shopUrl } : card,
    ),
  };

  const extraSameAs = (settings.same_as_urls || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const logoPath = settings.organization_logo?.trim() || "/images/og-image.png";
  const logoUrl = logoPath.startsWith("http") ? logoPath : `${SITE_URL}${logoPath.startsWith("/") ? "" : "/"}${logoPath}`;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name || "LELEK",
    alternateName: "Lelek Studio Berlin",
    url: SITE_URL,
    logo: logoUrl,
    sameAs: [
      resolveInstagramUrl(settings.instagram),
      shopUrl,
      ...extraSameAs,
    ].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.location || "Berlin",
      addressCountry: "DE",
    },
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <Hero content={heroContent} elements={elementItems} />
      <Signpost section={signpostSection} shopUrl={shopUrl} />
      <HomeStorySection story={story} />
      <HomeElementsBar
        items={elementItems}
        scopeNote={
          elementsSection.scopeNote ||
          "Ceramics process, below - Mire & Silt collections only"
        }
      />
      <HomeJournalTeaser section={journalSection} posts={journalPosts} />
      <HomeFindSection section={find} email={settings.email} shopUrl={shopUrl} />
    </>
  );
}
