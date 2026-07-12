import Link from "next/link";
import type { ElementItem, StorySection } from "@/types/content";

export function HomeStoryTeaser({
  story,
  elements,
}: {
  story: StorySection;
  elements?: ElementItem[];
}) {
  const teaser = story.body1?.slice(0, 160) ?? "";
  const elementsLine =
    elements && elements.length > 0
      ? elements.map((item) => `${item.number} ${item.name}`).join(" / ")
      : "I. Earth / II. Water / III. Fire / IV. Air";

  return (
    <section className="section-pad">
      <div className="container grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="cat-num mb-6">001</p>
          {story.eyebrow ? <p className="eyebrow mb-3">{story.eyebrow}</p> : null}
          <h2 className="text-[var(--text-3xl)]">
            {story.heading}{" "}
            {story.headingEm ? (
              <span className="italic-serif text-rust">{story.headingEm}</span>
            ) : null}
          </h2>
          {teaser ? (
            <p className="italic-serif mt-6 max-w-md text-metal">{teaser}…</p>
          ) : null}
          <Link href="/about" className="btn-text mt-8 inline-block">
            Read the full story ↗
          </Link>
        </div>
        <div className="border-[3px] border-ink bg-sand/30 p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">{elementsLine}</p>
        </div>
      </div>
    </section>
  );
}
