import Link from "next/link";
import type { ArchitectsSection } from "@/types/content";

export function HomeArchitectsCta({ section }: { section: ArchitectsSection }) {
  return (
    <section className="section-pad architects-sec">
      <div className="container max-w-3xl">
        {section.eyebrow ? <div className="sec-tag">{section.eyebrow}</div> : null}
        <h2>{section.headline}</h2>
        {section.sub ? <p className="mt-4">{section.sub}</p> : null}
        {section.body ? <p className="mt-4">{section.body}</p> : null}
        <Link href={section.ctaUrl ?? "/for-architects"} className="btn-line mt-8 inline-flex">
          {section.ctaText ?? "Get in touch"} →
        </Link>
      </div>
    </section>
  );
}
