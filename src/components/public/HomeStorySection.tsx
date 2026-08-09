import Link from "next/link";
import type { StorySection } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";

/** Homepage teaser - only body1. Full story lives on /about. */
export function HomeStorySection({ story }: { story: StorySection }) {
  const image = story.image ?? "/images/process/studio.jpg";
  const imageMobile = story.imageMobile ?? image;
  const alt = story.imageAlt ?? "Lelek Studio";

  return (
    <section id="story" className="story">
      <div className="story-img">
        <MediaBlock
          image={image}
          imageMobile={imageMobile}
          video={story.video}
          videoMobile={story.videoMobile}
          alt={alt}
          variant="story"
        />
        {story.imageCaption ? (
          <div className="story-img-label">{story.imageCaption}</div>
        ) : null}
      </div>

      <div className="story-text surface-wabi">
        <div className="story-num">01</div>
        {story.eyebrow ? <div className="story-eyebrow">{story.eyebrow}</div> : null}
        <h2 className="story-h2">
          {story.heading}
          {story.headingEm ? (
            <>
              {" "}
              <em>{story.headingEm}</em>
            </>
          ) : null}
        </h2>
        <div className="story-rule" />
        {story.body1 ? <p className="story-body">{story.body1}</p> : null}
        <Link href="/about" className="story-link">
          Read more
        </Link>
      </div>
    </section>
  );
}
