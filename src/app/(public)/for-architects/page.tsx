import type { Metadata } from "next";
import { ArchitectInquiryForm } from "@/components/public/ArchitectInquiryForm";
import { TradeHero } from "@/components/public/TradeHero";
import { DEFAULT_ARCHITECTS, getArchitectsSection, resolveArchitectsSub } from "@/lib/site";
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

  const rawPoints =
    section.points && section.points.length > 0
      ? section.points
      : [
          {
            title: section.point1Title || DEFAULT_ARCHITECTS.point1Title!,
            body: section.point1Body || DEFAULT_ARCHITECTS.point1Body!,
          },
          {
            title: section.point2Title || DEFAULT_ARCHITECTS.point2Title!,
            body: section.point2Body || DEFAULT_ARCHITECTS.point2Body!,
          },
          {
            title: section.point3Title || DEFAULT_ARCHITECTS.point3Title!,
            body: section.point3Body || DEFAULT_ARCHITECTS.point3Body!,
          },
        ];

  const defaultTitles = [
    DEFAULT_ARCHITECTS.point1Title!,
    DEFAULT_ARCHITECTS.point2Title!,
    DEFAULT_ARCHITECTS.point3Title!,
  ];
  const defaultBodies = [
    DEFAULT_ARCHITECTS.point1Body!,
    DEFAULT_ARCHITECTS.point2Body!,
    DEFAULT_ARCHITECTS.point3Body!,
  ];

  const points = rawPoints.map((p, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: p.title || localeText(locale, defaultTitles[i] || `Point ${i + 1}`),
    body: p.body || localeText(locale, defaultBodies[i] || ""),
  }));

  const closingNote = section.closingNote || localeText(locale, DEFAULT_ARCHITECTS.closingNote!);
  const sub = resolveArchitectsSub(section.sub);
  const formIntro =
    section.formIntro?.trim() ||
    localeText(
      locale,
      DEFAULT_ARCHITECTS.formIntro ||
        "Tell us about the space - scale, light, the works you're drawn to. We reply within a few business days.",
    );

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
      <TradeHero section={section} />

      <section className="arch trade-intro">
        <div>
          {section.eyebrow ? <div className="arch-eyebrow">{section.eyebrow}</div> : null}
          <h1 className="arch-h2">
            {section.headline}
            {section.headlineEm ? <> <em>{section.headlineEm}</em></> : null}
          </h1>
          {sub ? <p className="arch-body">{sub}</p> : null}

          <div className="arch-points">
            {points.map((p) => (
              <div key={p.num} className="arch-point">
                <div className="arch-point-num">{p.num}</div>
                <div className="arch-point-text">
                  <strong>{p.title}</strong>
                  {p.body}
                </div>
              </div>
            ))}
          </div>

          <p className="arch-closing">{closingNote}</p>
        </div>
      </section>

      <section className="page-shell">
        <div className="sec-eyebrow">{section.formEyebrow || t(locale, "trade.inquiry")}</div>
        <p className="page-intro">{formIntro}</p>
        <ArchitectInquiryForm />
      </section>
    </>
  );
}
