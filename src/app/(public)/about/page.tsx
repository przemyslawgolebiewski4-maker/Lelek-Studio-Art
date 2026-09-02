import type { Metadata } from "next";
import { AboutContent } from "@/components/public/AboutContent";
import { getOriginalProducts, getSiteSettings, getStorySection } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, resolveShopUrl } from "@/lib/config";
import { normalizeSlug } from "@/lib/slug";
import { ABOUT_PAGE_KEYWORDS } from "@/lib/seo";
import { truncateAtWord } from "@/lib/text";

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStorySection();
  const title = [story.heading, story.headingEm].filter(Boolean).join(" ");
  return {
    title: title || "About",
    description: truncateAtWord(story.body1 ?? "", 160),
    keywords: ABOUT_PAGE_KEYWORDS,
    alternates: { canonical: `${SITE_URL}/about` },
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const [story, originals, settings] = await Promise.all([
    getStorySection(),
    getOriginalProducts(50),
    getSiteSettings(),
  ]);
  const shopUrl = resolveShopUrl(settings);

  const personOrgLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "LELEK",
        alternateName: "Lelek Studio Berlin",
        url: SITE_URL,
        logo: `${SITE_URL}/images/og-image.png`,
        founder: { "@id": `${SITE_URL}/about#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/about#person`,
        name: "Przemyslaw Golebiewski",
        jobTitle: "Ceramist",
        url: `${SITE_URL}/about`,
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About",
            item: `${SITE_URL}/about`,
          },
        ],
      },
      ...originals.map((product) => ({
        "@type": "VisualArtwork",
        name: product.title,
        url: `${SITE_URL}/objects/${normalizeSlug(product.slug) || product.slug}`,
        image: product.images[0] || undefined,
        artform: "Ceramics",
        creator: { "@id": `${SITE_URL}/about#person` },
        description: product.metaDescription || product.description || undefined,
      })),
    ],
  };

  return (
    <>
      <JsonLd data={personOrgLd} />
      <AboutContent story={story} originals={originals} shopUrl={shopUrl} />
    </>
  );
}
