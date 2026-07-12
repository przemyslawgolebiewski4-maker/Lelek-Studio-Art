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
    <section className="journal-sec">
      <div className="journal-teaser">
        <div className="journal-teaser-text">
          {section.eyebrow ? <div className="sec-eyebrow">{section.eyebrow}</div> : null}
          <h2 className="journal-h2">
            {section.heading}{" "}
            {section.headingEm ? <em>{section.headingEm}</em> : null}
          </h2>
          {section.sub ? <p className="journal-intro">{section.sub}</p> : null}
          <Link href="/journal" className="story-link">
            All journal entries
          </Link>
        </div>

        <Link href={`/journal/${latest.slug}`} className="journal-teaser-card">
          {latest.coverImage ? (
            <Image src={latest.coverImage} alt={latest.title} fill sizes="50vw" />
          ) : null}
          <div className="journal-teaser-card-body">
            <div className="journal-teaser-card-title">{latest.title}</div>
            {latest.excerpt ? (
              <div className="product-card-meta">{latest.excerpt}</div>
            ) : null}
          </div>
        </Link>
      </div>
    </section>
  );
}
