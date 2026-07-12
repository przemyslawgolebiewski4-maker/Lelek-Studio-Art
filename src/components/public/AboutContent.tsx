import Image from "next/image";
import Link from "next/link";
import type { StorySection } from "@/types/content";

export function AboutContent({ story }: { story: StorySection }) {
  const image = story.image ?? "/images/process/studio.jpg";
  const imageMobile = story.imageMobile ?? image;

  return (
    <article>
      <div className="story">
        <div className="story-img">
          <div className="story-img-frame">
            <Image
              src={image}
              alt={story.imageAlt || "Lelek Studio"}
              fill
              className="hidden md:block"
              sizes="50vw"
              priority
            />
            <Image
              src={imageMobile}
              alt={story.imageAlt || "Lelek Studio"}
              fill
              className="md:hidden"
              sizes="100vw"
              priority
            />
          </div>
          {story.imageCaption ? (
            <div className="story-img-label">{story.imageCaption}</div>
          ) : null}
        </div>

        <div className="story-text">
          {story.eyebrow ? <div className="story-eyebrow">{story.eyebrow}</div> : null}
          <h1 className="story-h2">
            {story.heading}
            {story.headingEm ? <em>{story.headingEm}</em> : null}
          </h1>
          <div className="story-rule" />
          {story.body1 ? <p className="story-body">{story.body1}</p> : null}
          {story.body2 ? <p className="story-body">{story.body2}</p> : null}
          {story.body3 ? <p className="story-body">{story.body3}</p> : null}
          {story.signature ? <p className="story-sig">{story.signature}</p> : null}
          <Link href="/collections" className="story-link">
            View works
          </Link>
        </div>
      </div>
    </article>
  );
}
