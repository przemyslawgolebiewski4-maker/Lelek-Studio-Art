import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { StorySection } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";
import { OriginalsGrid } from "@/components/public/OriginalsGrid";
import { SHOP_URL } from "@/lib/config";

type AboutContentProps = {
  story: StorySection;
  originals: Product[];
};

export function AboutContent({ story, originals }: AboutContentProps) {
  const image = story.image ?? "/images/process/studio.jpg";
  const imageMobile = story.imageMobile ?? image;
  const alt = story.imageAlt || "Lelek Studio";
  const gallery = (story.gallery ?? []).filter((g) => g.image);
  const shopLabel = story.ctaShopLabel || "Shop the collections";
  const tradeLabel = story.ctaTradeLabel || "Designing a space?";

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
            {story.headingEm ? (
              <>
                {" "}
                <em>{story.headingEm}</em>
              </>
            ) : null}
          </h1>
          <div className="story-rule" />
          {story.body1 ? <p className="story-body">{story.body1}</p> : null}
          {story.body2 ? <p className="story-body">{story.body2}</p> : null}
          {story.body3 ? <p className="story-body">{story.body3}</p> : null}
          {story.signature ? <p className="story-sig">{story.signature}</p> : null}

          <div className="cta-row">
            <a href={SHOP_URL} className="cta-btn filled">
              {shopLabel}
            </a>
            <Link href="/for-architects" className="cta-btn">
              {tradeLabel}
            </Link>
          </div>
        </div>
      </div>

      {gallery.length > 0 ? (
        <section className="about-gallery" aria-label="Studio gallery">
          <div className="gallery">
            {gallery.map((item, i) => (
              <div key={`${item.image}-${i}`} className="gallery-item">
                <Image
                  src={item.image}
                  alt={item.alt || "LELEK studio work"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="originals" className="originals-section">
        <div className="originals-header">
          <div className="sec-eyebrow">Originals</div>
          <h2 className="page-h1" style={{ fontSize: "var(--text-2xl)" }}>
            One-of-a-kind pieces
          </h2>
          <p className="page-intro">
            Sculptural and statement works available by inquiry - not sold through the shop.
          </p>
        </div>
        <OriginalsGrid products={originals} inquireHref="/contact" />
      </section>
    </article>
  );
}
