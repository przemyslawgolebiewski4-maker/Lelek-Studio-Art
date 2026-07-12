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
    <section className="section-pad journal-sec">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            {section.eyebrow ? <div className="sec-tag">{section.eyebrow}</div> : null}
            <h2>
              {section.heading}{" "}
              {section.headingEm ? (
                <em className="text-terra not-italic">{section.headingEm}</em>
              ) : null}
            </h2>
            {section.sub ? <p className="sec-intro mt-4">{section.sub}</p> : null}
            <Link href="/journal" className="btn-line-terra mt-8 inline-flex">
              All journal entries →
            </Link>
          </div>

          <Link href={`/journal/${latest.slug}`} className="card">
            {latest.coverImage ? (
              <div className="card-thumb card-thumb-ratio-portrait relative min-h-[280px]">
                <Image
                  src={latest.coverImage}
                  alt={latest.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            ) : null}
            <div className="card-body">
              <div className="card-title">{latest.title}</div>
              {latest.excerpt ? <div className="card-meta">{latest.excerpt}</div> : null}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
