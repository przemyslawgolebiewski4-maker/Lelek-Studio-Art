import type { Metadata } from "next";
import { ArchitectInquiryForm } from "@/components/public/ArchitectInquiryForm";
import { getArchitectsSection } from "@/lib/site";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const section = await getArchitectsSection();
  return {
    title: "For Architects",
    description: section.sub || section.body,
    alternates: { canonical: `${SITE_URL}/for-architects` },
  };
}

export const revalidate = 60;

export default async function ForArchitectsPage() {
  const section = await getArchitectsSection();

  return (
    <>
      <section className="arch" style={{ borderBottom: "none" }}>
        <div>
          {section.eyebrow ? <div className="arch-eyebrow">{section.eyebrow}</div> : null}
          <h1 className="arch-h2">{section.headline}</h1>
          {section.sub ? <p className="arch-body">{section.sub}</p> : null}
          {section.body ? <p className="arch-body">{section.body}</p> : null}
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
