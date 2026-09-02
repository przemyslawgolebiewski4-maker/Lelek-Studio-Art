import type { Metadata } from "next";
import { JournalList } from "@/components/public/JournalList";
import { getJournalPosts, getJournalSection } from "@/lib/site";
import { withPageDescription } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const section = await getJournalSection();
  const title = [section.heading, section.headingEm].filter(Boolean).join(" ");
  const description = section.sub ?? "";
  return withPageDescription(description, {
    title: title || "Journal",
    alternates: { canonical: `${SITE_URL}/journal` },
  });
}

export const revalidate = 60;

export default async function JournalPage() {
  const [section, posts] = await Promise.all([getJournalSection(), getJournalPosts()]);

  return (
    <section className="page-shell">
      {section.eyebrow ? <div className="sec-eyebrow">{section.eyebrow}</div> : null}
      <h1 className="page-h1">
        {section.heading} {section.headingEm ? <em>{section.headingEm}</em> : null}
      </h1>
      {section.sub ? <p className="page-intro">{section.sub}</p> : null}
      <JournalList posts={posts} />
    </section>
  );
}
