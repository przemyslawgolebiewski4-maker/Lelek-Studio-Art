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
    <section className="section-pad page-top find-sec">
      <div className="container max-w-3xl">
        {section.eyebrow ? <div className="sec-tag">{section.eyebrow}</div> : null}
        <h1>{section.headline}</h1>
        {section.sub ? <p className="sec-intro mt-4">{section.sub}</p> : null}
        {section.body ? <p className="story-body">{section.body}</p> : null}

        <div className="form-panel">
          <div className="sec-tag">Project inquiry</div>
          <p className="sec-intro">
            Tell us about your project — wall objects, vessels, or custom dimensions. We reply
            within a few business days.
          </p>
          <ArchitectInquiryForm />
        </div>
      </div>
    </section>
  );
}
