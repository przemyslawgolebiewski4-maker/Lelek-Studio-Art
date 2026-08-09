import type { ArchitectsSection } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";

export function TradeHero({ section }: { section: ArchitectsSection }) {
  const image = section.heroImage;
  const video = section.heroVideo;
  const caption =
    section.heroCaption ??
    "Ceramic wall objects and vessels made for spaces - hospitality, offices, private commissions.";
  const alt = section.heroImageAlt || "LELEK Trade - ceramic objects for spaces";

  if (!image && !video) {
    return (
      <section className="trade-hero trade-hero--empty">
        <p className="trade-hero-caption">{caption}</p>
      </section>
    );
  }

  return (
    <section className="trade-hero">
      <div className="trade-hero-media">
        <MediaBlock
          image={image}
          imageMobile={section.heroImageMobile || image}
          video={video}
          videoMobile={section.heroVideoMobile}
          alt={alt}
          variant="story"
        />
      </div>
      {caption ? <p className="trade-hero-caption">{caption}</p> : null}
    </section>
  );
}
