import type { Metadata } from "next";
import { AboutContent } from "@/components/public/AboutContent";
import { getOriginalProducts, getSiteSettings, getStorySection } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, resolveShopUrl, resolveOrganizationSameAs } from "@/lib/config";
import { ABOUT_URL } from "@/lib/links";
import { normalizeSlug } from "@/lib/slug";
import { ABOUT_PAGE_KEYWORDS, withPageDescription } from "@/lib/seo";
import { CREATOR_FAMILY_NAME, CREATOR_GIVEN_NAME, CREATOR_NAME } from "@/lib/brand";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { localeText } from "@/lib/i18n/present";
import { truncateAtWord } from "@/lib/text";
import {
  PERSON_ID,
  buildAboutFaqJsonLd,
  buildCreatorRef,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  personSameAsFromSettings,
} from "@/lib/person-json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStorySection();
  const title = [story.heading, story.headingEm].filter(Boolean).join(" ");
  const description = truncateAtWord(story.body1 ?? "", 160);
  return withPageDescription(description, {
    title: title || CREATOR_NAME,
    keywords: ABOUT_PAGE_KEYWORDS,
    authors: [{ name: CREATOR_NAME, url: ABOUT_URL }],
    creator: CREATOR_NAME,
    alternates: { canonical: ABOUT_URL },
    openGraph: {
      type: "profile",
      url: ABOUT_URL,
      firstName: CREATOR_GIVEN_NAME,
      lastName: CREATOR_FAMILY_NAME,
      username: "lelek.berlin",
    },
  });
}

export const revalidate = 60;

export default async function AboutPage() {
  const [story, originals, settings, locale] = await Promise.all([
    getStorySection(),
    getOriginalProducts(50),
    getSiteSettings(),
    getLocale(),
  ]);
  const shopUrl = resolveShopUrl(settings);
  const sameAs = resolveOrganizationSameAs(settings);
  const personSameAs = personSameAsFromSettings(settings);
  const logoPath = settings.organization_logo?.trim() || "/images/og-image.png";
  const logoUrl = logoPath.startsWith("http")
    ? logoPath
    : `${SITE_URL}${logoPath.startsWith("/") ? "" : "/"}${logoPath}`;

  const personOrgLd = {
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
        description: story.body1,
      }),
      {
        "@type": "ProfilePage",
        "@id": `${ABOUT_URL}/#profile`,
        url: ABOUT_URL,
        name: localeText(locale, `${CREATOR_NAME} - ceramist`),
        mainEntity: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
      },
      buildAboutFaqJsonLd(locale),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t(locale, "home.crumb"),
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: CREATOR_NAME,
            item: ABOUT_URL,
          },
        ],
      },
      ...originals.map((product) => ({
        "@type": "VisualArtwork",
        name: product.title,
        url: `${SITE_URL}/objects/${normalizeSlug(product.slug) || product.slug}`,
        image: product.images[0] || undefined,
        artform: "Ceramics",
        creator: buildCreatorRef(),
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
