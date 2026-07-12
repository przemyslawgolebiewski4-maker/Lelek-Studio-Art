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
    <section className="section-pad page-top journal-sec">
      <div className="container">
        {section.eyebrow ? <div className="sec-tag">{section.eyebrow}</div> : null}
        <h1>
          {section.heading}{" "}
          {section.headingEm ? <em className="text-terra not-italic">{section.headingEm}</em> : null}
        </h1>
        {section.sub ? <p className="sec-intro mt-4">{section.sub}</p> : null}
        <JournalList posts={posts} />
      </div>
    </section>
  );
}
