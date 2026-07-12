import Image from "next/image";
import Link from "next/link";
import type { StorySection } from "@/types/content";

export function HomeStorySection({ story }: { story: StorySection }) {
  const image = story.image ?? "/images/process/studio.jpg";
  const imageMobile = story.imageMobile ?? image;

  return (
    <section id="story" className="story">
      <div className="story-img">
        <div className="story-img-frame">
          <Image
            src={image}
            alt={story.imageAlt ?? "Lelek Studio"}
            fill
            className="hidden md:block"
            sizes="50vw"
          />
          <Image
            src={imageMobile}
            alt={story.imageAlt ?? "Lelek Studio"}
            fill
            className="md:hidden"
            sizes="100vw"
          />
        </div>
        {story.imageCaption ? (
          <div className="story-img-label">{story.imageCaption}</div>
        ) : null}
      </div>

      <div className="story-text">
        <div className="story-num">01</div>
        {story.eyebrow ? <div className="story-eyebrow">{story.eyebrow}</div> : null}
        <h2 className="story-h2">
          {story.heading}
          {story.headingEm ? <em>{story.headingEm}</em> : null}
        </h2>
        <div className="story-rule" />
        {story.body1 ? <p className="story-body">{story.body1}</p> : null}
        {story.body2 ? <p className="story-body">{story.body2}</p> : null}
        {story.body3 ? <p className="story-body">{story.body3}</p> : null}
        {story.signature ? <p className="story-sig">{story.signature}</p> : null}
        <Link href="/about" className="story-link">
          Read more
        </Link>
      </div>
    </section>
  );
}
