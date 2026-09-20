import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { HomeStorySection } from "@/components/public/HomeStorySection";
import { HomeElementsBar } from "@/components/public/HomeElementsBar";
import { FeaturedWorks } from "@/components/public/FeaturedWorks";
import { HomeJournalTeaser } from "@/components/public/HomeJournalTeaser";
import { HomeFindSection } from "@/components/public/HomeFindSection";
import { Signpost } from "@/components/public/Signpost";
import { JsonLd } from "@/lib/json-ld";
import { CREATOR_NAME, ELEMENTS_SCOPE_NOTE, resolveSiteDescription } from "@/lib/brand";
import { resolveHeroContent, resolveSignpostSection } from "@/lib/brand-copy";
import { SITE_URL, resolveShopUrl, resolveOrganizationSameAs } from "@/lib/config";
import {
  DEFAULT_TAGLINE,
  resolveSiteName,
  withPageDescription,
} from "@/lib/seo";
import {
  DEFAULT_VISIT_STUDIO_NAME,
  parseStudioAddress,
} from "@/lib/address";
import {
  getPublicHomeData,
  getSiteSettings,
  resolveHomeFeaturedProducts,
} from "@/lib/site";
import {
  ORGANIZATION_ID,
  PERSON_ID,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  personSameAsFromSettings,
} from "@/lib/person-json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = resolveSiteName(settings);
  const tagline = settings.tagline?.trim() || DEFAULT_TAGLINE;
  const description = resolveSiteDescription(settings.description);

  return withPageDescription(description, {
    title: { absolute: `${siteName} - ${tagline}` },
    authors: [{ name: CREATOR_NAME, url: `${SITE_URL}/about` }],
    creator: CREATOR_NAME,
    alternates: { canonical: `${SITE_URL}/` },
  });
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
    featured,
    featuredSection,
    homeProducts,
    journalSection,
    journalPosts,
    find,
  } = await getPublicHomeData();

  const elementItems = elements;
  const shopUrl = resolveShopUrl(settings);
  const heroContent = resolveHeroContent(hero, shopUrl);
  const signpostSection = resolveSignpostSection(signpost, shopUrl);

  const featuredProducts = resolveHomeFeaturedProducts(homeProducts, featured, 3, 6);

  const logoPath = settings.organization_logo?.trim() || "/images/og-image.png";
  const logoUrl = logoPath.startsWith("http")
    ? logoPath
    : `${SITE_URL}${logoPath.startsWith("/") ? "" : "/"}${logoPath}`;
  const sameAs = resolveOrganizationSameAs(settings);
  const personSameAs = personSameAsFromSettings(settings);

  const visitName = find.studioName?.trim() || DEFAULT_VISIT_STUDIO_NAME;
  const visitAddress = parseStudioAddress(find.studioAddress);

  const graphLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd({
        name: settings.site_name || undefined,
        logo: logoUrl,
        sameAs,
      }),
      buildPersonJsonLd({
        sameAs: personSameAs,
        image: story.image?.trim() || undefined,
      }),
      buildWebsiteJsonLd(resolveSiteDescription(settings.description)),
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: visitName,
        address: {
          "@type": "PostalAddress",
          streetAddress: visitAddress.streetAddress,
          postalCode: visitAddress.postalCode,
          addressLocality: visitAddress.addressLocality,
          addressCountry: visitAddress.addressCountry,
        },
        parentOrganization: { "@id": ORGANIZATION_ID },
        founder: { "@id": PERSON_ID },
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
        scopeNote={elementsSection.scopeNote || ELEMENTS_SCOPE_NOTE}
      />
      <FeaturedWorks section={featuredSection} homeProducts={featuredProducts} />
      <HomeJournalTeaser section={journalSection} posts={journalPosts} />
      <HomeFindSection section={find} email={settings.email} shopUrl={shopUrl} />
    </>
  );
}
