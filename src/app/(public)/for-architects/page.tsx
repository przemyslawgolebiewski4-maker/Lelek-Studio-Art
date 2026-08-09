import type { Metadata } from "next";
import { ArchitectInquiryForm } from "@/components/public/ArchitectInquiryForm";
import { TradeHero } from "@/components/public/TradeHero";
import { DEFAULT_ARCHITECTS, getArchitectsSection } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const section = await getArchitectsSection();
  return {
    title: "Trade",
    description: section.sub,
    alternates: { canonical: `${SITE_URL}/for-architects` },
  };
}

export const revalidate = 60;

export default async function ForArchitectsPage() {
  const section = await getArchitectsSection();

  const points = [
    {
      num: "01",
      title: section.point1Title || DEFAULT_ARCHITECTS.point1Title!,
      body: section.point1Body || DEFAULT_ARCHITECTS.point1Body!,
    },
    {
      num: "02",
      title: section.point2Title || DEFAULT_ARCHITECTS.point2Title!,
      body: section.point2Body || DEFAULT_ARCHITECTS.point2Body!,
    },
    {
      num: "03",
      title: section.point3Title || DEFAULT_ARCHITECTS.point3Title!,
      body: section.point3Body || DEFAULT_ARCHITECTS.point3Body!,
    },
  ];

  const closingNote = section.closingNote || DEFAULT_ARCHITECTS.closingNote!;

  const breadcrumbLd = {
    "@context": "https://schema.org",
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
        name: "Trade",
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
          {section.sub ? <p className="arch-body">{section.sub}</p> : null}

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
        <div className="sec-eyebrow">Project inquiry</div>
        <p className="page-intro">
          Tell us about your project - wall objects, vessels, or custom dimensions. We reply within
          a few business days.
        </p>
        <ArchitectInquiryForm />
      </section>
    </>
  );
}
