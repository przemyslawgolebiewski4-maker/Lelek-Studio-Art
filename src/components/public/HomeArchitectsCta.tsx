import Link from "next/link";
import type { ArchitectsSection } from "@/types/content";

export function HomeArchitectsCta({ section }: { section: ArchitectsSection }) {
  return (
    <section className="section-pad bg-peat text-cream">
      <div className="container max-w-3xl">
        {section.eyebrow ? (
          <p className="eyebrow mb-3 text-sand">{section.eyebrow}</p>
        ) : null}
        <h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)]">{section.headline}</h2>
        {section.sub ? <p className="mt-4 max-w-xl text-sand">{section.sub}</p> : null}
        {section.body ? (
          <p className="mt-4 max-w-xl text-sm text-sand/80">{section.body}</p>
        ) : null}
        <Link
          href={section.ctaUrl ?? "/for-architects"}
          className="btn-primary mt-8 inline-flex border-cream bg-transparent text-cream hover:bg-cream hover:text-ink"
        >
          {section.ctaText ?? "Get in touch"} ↗
        </Link>
      </div>
    </section>
  );
}
