import { SITE_URL, resolveInstagramUrl, resolveOrganizationSameAs } from "@/lib/config";
import type { Locale } from "@/lib/i18n/locale";
import { localeText } from "@/lib/i18n/present";
import {
  CREATOR_ENTITY_DESCRIPTION,
  CREATOR_FAMILY_NAME,
  CREATOR_GIVEN_NAME,
  CREATOR_JOB_TITLE,
  CREATOR_KNOWS_ABOUT,
  CREATOR_NAME,
  CREATOR_NAME_ASCII,
  CREATOR_NICKNAME,
  CREATOR_SAME_AS,
  STUDIO_NAME,
  STUDIO_NAME_LONG,
} from "@/lib/brand";

export const PERSON_ID = `${SITE_URL}/about#person`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personId(): string {
  return PERSON_ID;
}

export function buildPersonJsonLd(options?: {
  image?: string;
  sameAs?: string[];
  description?: string;
}): Record<string, unknown> {
  const sameAs = Array.from(
    new Set([...(options?.sameAs ?? []), ...CREATOR_SAME_AS].filter(Boolean)),
  );

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: CREATOR_NAME,
    alternateName: [CREATOR_NAME_ASCII, CREATOR_NICKNAME],
    givenName: CREATOR_GIVEN_NAME,
    familyName: CREATOR_FAMILY_NAME,
    jobTitle: CREATOR_JOB_TITLE,
    description: options?.description || CREATOR_ENTITY_DESCRIPTION,
    url: `${SITE_URL}/about`,
    image: options?.image || undefined,
    nationality: { "@type": "Country", name: "Poland" },
    homeLocation: {
      "@type": "City",
      name: "Berlin",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Berlin",
        addressCountry: "DE",
      },
    },
    knowsAbout: CREATOR_KNOWS_ABOUT,
    hasOccupation: {
      "@type": "Occupation",
      name: CREATOR_JOB_TITLE,
      occupationLocation: { "@type": "City", name: "Berlin" },
    },
    worksFor: { "@id": ORGANIZATION_ID },
    sameAs,
  };
}

export function buildCreatorRef(): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: CREATOR_NAME,
    alternateName: CREATOR_NAME_ASCII,
    url: `${SITE_URL}/about`,
    jobTitle: CREATOR_JOB_TITLE,
  };
}

export function buildOrganizationJsonLd(options?: {
  name?: string;
  logo?: string;
  sameAs?: string[];
}): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: options?.name || STUDIO_NAME,
    alternateName: STUDIO_NAME_LONG,
    url: SITE_URL,
    logo: options?.logo,
    sameAs: options?.sameAs,
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
  };
}

export function buildWebsiteJsonLd(description: string, locale: Locale = "en"): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: STUDIO_NAME,
    alternateName: STUDIO_NAME_LONG,
    description,
    inLanguage: locale === "pl" ? "pl" : "en",
    publisher: { "@id": ORGANIZATION_ID },
    author: { "@id": PERSON_ID },
  };
}

export function buildAboutFaqJsonLd(locale: Locale = "en"): Record<string, unknown> {
  const who = `Who is ${CREATOR_NAME}?`;
  const what = `What kind of ceramics does ${CREATOR_NAME} make?`;
  const whatAnswer = `${CREATOR_NAME} shapes vessels, cups and lamps by hand, not by mold. Some pieces stay raw, closer to brutalism; others lean fully organic. Forms may repeat, but never exactly.`;
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/about#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: localeText(locale, who),
        acceptedAnswer: {
          "@type": "Answer",
          text: localeText(locale, CREATOR_ENTITY_DESCRIPTION),
        },
      },
      {
        "@type": "Question",
        name: localeText(locale, what),
        acceptedAnswer: {
          "@type": "Answer",
          text: localeText(locale, whatAnswer),
        },
      },
    ],
  };
}

export function personSameAsFromSettings(
  settings?: Record<string, string> | null,
): string[] {
  const instagram = resolveInstagramUrl(settings?.instagram);
  const extras = resolveOrganizationSameAs(settings);
  return Array.from(new Set([instagram, ...CREATOR_SAME_AS, ...extras]));
}
