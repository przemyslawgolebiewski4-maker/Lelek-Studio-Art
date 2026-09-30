import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { StorySection } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";
import { OriginalsGrid } from "@/components/public/OriginalsGrid";
import { SHOP_URL } from "@/lib/config";
import { studioHref } from "@/lib/links";
import { getLocale } from "@/lib/i18n/get-locale";
import { localeText } from "@/lib/i18n/present";

type AboutContentProps = {
  story: StorySection;
  originals: Product[];
  shopUrl?: string;
};

export async function AboutContent({
  story,
  originals,
  shopUrl = SHOP_URL,
}: AboutContentProps) {
  const image = story.image?.trim() || "";
  const imageMobile = story.imageMobile?.trim() || "";
  const video = story.video?.trim() || "";
  const videoMobile = story.videoMobile?.trim() || "";
  const locale = await getLocale();
  const alt = localeText(locale, story.imageAlt || "Przemysław Gołębiewski, ceramist");
  const gallery = (story.gallery ?? []).filter((g) => g.image);
  const shopLabel = localeText(locale, story.ctaShopLabel || "Shop the collections");
  const tradeLabel = localeText(locale, story.ctaTradeLabel || "Designing a space?");
  const hasMedia = Boolean(image || video);

  return (
    <article>
      <div className="story">
        {hasMedia ? (
          <div className="story-img">
            <MediaBlock
              image={image}
              imageMobile={imageMobile}
              video={video}
              videoMobile={videoMobile}
              alt={alt}
              variant="story"
            />
            {story.imageCaption ? (
              <div className="story-img-label">{story.imageCaption}</div>
            ) : null}
          </div>
        ) : null}

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
            <a
              href={shopUrl}
              className="cta-btn filled"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shopLabel}
            </a>
            <Link href={studioHref("/for-architects")} className="cta-btn">
              {tradeLabel}
            </Link>
          </div>
        </div>
      </div>

      {gallery.length > 0 ? (
        <section className="about-gallery" aria-label={localeText(locale, "Studio gallery")}>
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
          <div className="sec-eyebrow">
            {localeText(locale, story.originalsEyebrow || "Originals")}
          </div>
          <h2 className="page-h1" style={{ fontSize: "var(--text-2xl)" }}>
            {localeText(locale, story.originalsHeading || "Shaped by hand, not by mold")}
          </h2>
          <p className="page-intro">
            {localeText(
              locale,
              story.originalsIntro ||
                "Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences.",
            )}
          </p>
        </div>
        <OriginalsGrid products={originals} inquireHref={studioHref("/contact")} />
      </section>
    </article>
  );
}
