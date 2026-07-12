import Image from "next/image";
import Link from "next/link";
import type { StorySection } from "@/types/content";

export function HomeStorySection({ story }: { story: StorySection }) {
  const image = story.image ?? "/images/process/studio.jpg";
  const imageMobile = story.imageMobile ?? image;

  return (
    <section id="story" className="section-pad story-sec">
      <div className="container">
        <div className="story-grid">
          <div className="story-img">
            <Image
              src={image}
              alt={story.imageAlt ?? "Lelek Studio"}
              fill
              className="hidden object-cover object-top md:block"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <Image
              src={imageMobile}
              alt={story.imageAlt ?? "Lelek Studio"}
              fill
              className="object-cover object-top md:hidden"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            {story.imageCaption ? (
              <div className="story-img-caption">{story.imageCaption}</div>
            ) : null}
          </div>

          <div className="story-text">
            {story.eyebrow ? <div className="sec-tag">{story.eyebrow}</div> : null}
            <h2>
              {story.heading}{" "}
              {story.headingEm ? <em className="text-terra not-italic">{story.headingEm}</em> : null}
            </h2>
            {story.body1 ? <p className="story-body">{story.body1}</p> : null}
            {story.body2 ? <p className="story-body">{story.body2}</p> : null}
            {story.body3 ? <p className="story-body">{story.body3}</p> : null}
            {story.signature ? <p className="story-sig">{story.signature}</p> : null}
            <Link href="/about" className="btn-line-terra mt-8 inline-flex">
              Read more →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
