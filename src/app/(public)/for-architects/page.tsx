import type { Metadata } from "next";
import { ArchitectInquiryForm } from "@/components/public/ArchitectInquiryForm";
import { TradeHero } from "@/components/public/TradeHero";
import { getArchitectsSection } from "@/lib/site";
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

      <section className="arch" style={{ borderBottom: "none" }}>
        <div>
          {section.eyebrow ? <div className="arch-eyebrow">{section.eyebrow}</div> : null}
          <h1 className="arch-h2">
            {section.headline}
            {section.headlineEm ? <> <em>{section.headlineEm}</em></> : null}
          </h1>
          {section.sub ? <p className="arch-body">{section.sub}</p> : null}
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
