import type { Metadata } from "next";
import { ForArchitectsContent } from "@/components/public/ForArchitectsContent";
import { getArchitectsSection } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { localeText } from "@/lib/i18n/present";
import { ARCHITECTS_PAGE_KEYWORDS, TRADE_DESCRIPTION, withPageDescription } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return withPageDescription(localeText(locale, TRADE_DESCRIPTION), {
    title: t(locale, "meta.trade"),
    keywords: ARCHITECTS_PAGE_KEYWORDS,
    alternates: { canonical: `${SITE_URL}/for-architects` },
  });
}

export const revalidate = 60;

export default async function ForArchitectsPage() {
  const [section, locale] = await Promise.all([getArchitectsSection(), getLocale()]);

  const breadcrumbLd = {
    "@context": "https://schema.org",
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
        name: t(locale, "meta.trade"),
        item: `${SITE_URL}/for-architects`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ForArchitectsContent section={section} />
    </>
  );
}
