import Link from "next/link";
import type { ArchitectsSection } from "@/types/content";

export function HomeArchitectsCta({ section }: { section: ArchitectsSection }) {
  return (
    <section className="arch">
      <div>
        {section.eyebrow ? <div className="arch-eyebrow">{section.eyebrow}</div> : null}
        <h2 className="arch-h2">{section.headline}</h2>
        {section.sub ? <p className="arch-body">{section.sub}</p> : null}
        {section.body ? <p className="arch-body">{section.body}</p> : null}
      </div>
      <Link href={section.ctaUrl ?? "/for-architects"} className="arch-btn">
        {section.ctaText ?? "Get in touch"}
      </Link>
    </section>
  );
}
