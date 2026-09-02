import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { HomeStorySection } from "@/components/public/HomeStorySection";
import { HomeElementsBar } from "@/components/public/HomeElementsBar";
import { HomeJournalTeaser } from "@/components/public/HomeJournalTeaser";
import { HomeFindSection } from "@/components/public/HomeFindSection";
import { Signpost } from "@/components/public/Signpost";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, resolveShopUrl, resolveInstagramUrl } from "@/lib/config";
import { DEFAULT_DESCRIPTION, DEFAULT_TAGLINE, SITE_NAME } from "@/lib/seo";
import { DEFAULT_HERO, DEFAULT_SIGNPOST, getPublicHomeData, getSiteSettings } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.site_name || SITE_NAME;
  const tagline = settings.tagline || DEFAULT_TAGLINE;
  const description = settings.description || DEFAULT_DESCRIPTION;

  return {
    title: { absolute: `${siteName} - ${tagline}` },
    description,
    alternates: { canonical: `${SITE_URL}/` },
  };
}

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

  const graphLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
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
        founder: { "@id": `${SITE_URL}/about#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/about#person`,
        name: "Przemyslaw Golebiewski",
        jobTitle: "Ceramist",
        url: `${SITE_URL}/about`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={graphLd} />
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
