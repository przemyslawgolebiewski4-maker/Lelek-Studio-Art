import Link from "next/link";
import type { FindSection } from "@/types/content";

export function HomeFindSection({ section }: { section: FindSection }) {
  const addressLines = section.studioAddress?.split("\n") ?? [];

  return (
    <section className="section-pad border-t border-sand bg-cream">
      <div className="container-wide grid gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Find us</p>
          {section.studioName ? (
            <h2 className="text-[var(--text-2xl)]">{section.studioName}</h2>
          ) : null}
          {addressLines.length > 0 ? (
            <address className="mt-4 not-italic text-sm leading-relaxed text-metal">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : null}
          {section.studioInstagram ? (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-metal">
              {section.studioInstagram}
            </p>
          ) : null}
        </div>

        <div className="border border-ink/10 bg-sand/10 p-8">
          <p className="eyebrow mb-3">Online</p>
          <p className="text-sm text-metal">
            Functional ceramics available for worldwide shipping. New pieces added after each firing.
          </p>
          {section.etsyUrl ? (
            <Link
              href={section.etsyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 inline-flex"
            >
              Visit Etsy shop ↗
            </Link>
          ) : null}
          {section.lelekMeaning ? (
            <p className="italic-serif mt-8 text-sm text-metal">{section.lelekMeaning}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
