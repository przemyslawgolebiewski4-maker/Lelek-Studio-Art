import Image from "next/image";
import Link from "next/link";
import type { StorySection } from "@/types/content";

export function AboutContent({ story }: { story: StorySection }) {
  return (
    <article className="section-pad pt-28">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            {story.eyebrow ? <p className="eyebrow mb-3">{story.eyebrow}</p> : null}
            <h1 className="text-[var(--text-3xl)]">
              {story.heading}{" "}
              {story.headingEm ? (
                <span className="italic-serif text-rust">{story.headingEm}</span>
              ) : null}
            </h1>

            <div className="mt-8 space-y-6 text-sm leading-relaxed text-metal md:text-base">
              {story.body1 ? <p>{story.body1}</p> : null}
              {story.body2 ? <p>{story.body2}</p> : null}
              {story.body3 ? <p>{story.body3}</p> : null}
            </div>

            {story.signature ? (
              <p className="italic-serif mt-10 text-lg text-ink">{story.signature}</p>
            ) : null}

            <Link href="/collections" className="btn-text mt-10 inline-block">
              View works ↗
            </Link>
          </div>

          {story.image ? (
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-ink">
                <Image
                  src={story.image}
                  alt={story.imageAlt || "Lelek Studio"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {story.imageCaption ? (
                <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-metal">
                  {story.imageCaption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </div>
    </article>
  );
}
