import type { Metadata } from "next";
import { JournalList } from "@/components/public/JournalList";
import { getJournalPosts, getJournalSection } from "@/lib/site";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const section = await getJournalSection();
  const title = [section.heading, section.headingEm].filter(Boolean).join(" ");
  return {
    title: title || "Journal",
    description: section.sub,
    alternates: { canonical: `${SITE_URL}/journal` },
  };
}

export const revalidate = 60;

export default async function JournalPage() {
  const [section, posts] = await Promise.all([getJournalSection(), getJournalPosts()]);

  return (
    <section className="section-pad pt-28">
      <div className="container-wide">
        {section.eyebrow ? <p className="eyebrow mb-3">{section.eyebrow}</p> : null}
        <h1 className="text-[var(--text-3xl)]">
          {section.heading}{" "}
          {section.headingEm ? (
            <span className="italic-serif text-rust">{section.headingEm}</span>
          ) : null}
        </h1>
        {section.sub ? <p className="mt-4 max-w-xl text-metal">{section.sub}</p> : null}
        <JournalList posts={posts} />
      </div>
    </section>
  );
}
