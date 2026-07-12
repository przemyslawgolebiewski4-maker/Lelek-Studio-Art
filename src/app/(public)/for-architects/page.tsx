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
    <section className="section-pad pt-28">
      <div className="container max-w-3xl">
        {section.eyebrow ? <p className="eyebrow mb-3">{section.eyebrow}</p> : null}
        <h1 className="text-[var(--text-3xl)]">{section.headline}</h1>
        {section.sub ? <p className="mt-4 text-lg text-metal">{section.sub}</p> : null}
        {section.body ? (
          <p className="mt-6 text-sm leading-relaxed text-metal md:text-base">{section.body}</p>
        ) : null}

        <div className="mt-10 border-t border-sand pt-10">
          <p className="eyebrow mb-2">Project inquiry</p>
          <p className="text-sm text-metal">
            Tell us about your project — wall objects, vessels, or custom dimensions. We reply within a few business days.
          </p>
          <ArchitectInquiryForm />
        </div>
      </div>
    </section>
  );
}
