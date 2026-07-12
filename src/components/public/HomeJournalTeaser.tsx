import Link from "next/link";
import Image from "next/image";
import type { JournalPostSummary, JournalSection } from "@/types/content";

export function HomeJournalTeaser({
  section,
  posts,
}: {
  section: JournalSection;
  posts: JournalPostSummary[];
}) {
  if (posts.length === 0) return null;

  const [latest] = posts;

  return (
    <section className="section-pad border-t border-sand">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            {section.eyebrow ? <p className="eyebrow mb-3">{section.eyebrow}</p> : null}
            <h2 className="text-[var(--text-3xl)]">
              {section.heading}{" "}
              {section.headingEm ? (
                <span className="italic-serif text-rust">{section.headingEm}</span>
              ) : null}
            </h2>
            {section.sub ? <p className="mt-4 max-w-md text-metal">{section.sub}</p> : null}
            <Link href="/journal" className="btn-text mt-8 inline-block">
              All journal entries ↗
            </Link>
          </div>

          <Link
            href={`/journal/${latest.slug}`}
            className="group grid gap-6 border border-ink/10 bg-sand/10 md:grid-cols-[1fr_1.1fr]"
          >
            {latest.coverImage ? (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={latest.coverImage}
                  alt={latest.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            ) : null}
            <div className="flex flex-col justify-center p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-metal">Latest</p>
              <h3 className="mt-2 font-serif text-2xl text-ink group-hover:text-rust">{latest.title}</h3>
              {latest.excerpt ? (
                <p className="mt-3 text-sm leading-relaxed text-metal">{latest.excerpt}</p>
              ) : null}
              <span className="btn-text mt-4 inline-block">Read more ↗</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
