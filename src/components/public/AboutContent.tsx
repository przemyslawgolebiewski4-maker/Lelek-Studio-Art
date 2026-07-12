import Link from "next/link";
import type { StorySection } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";

export function AboutContent({ story }: { story: StorySection }) {
  const image = story.image ?? "/images/process/studio.jpg";
  const imageMobile = story.imageMobile ?? image;
  const alt = story.imageAlt || "Lelek Studio";

  return (
    <article>
      <div className="story">
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
