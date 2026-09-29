import type { ArchitectsSection } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";
import { getLocale } from "@/lib/i18n/get-locale";
import { localeText } from "@/lib/i18n/present";

export async function TradeHero({ section }: { section: ArchitectsSection }) {
  const locale = await getLocale();
  const image = section.heroImage;
  const video = section.heroVideo;
  const caption = localeText(
    locale,
    section.heroCaption ||
      "Ceramic vessels, lamps and wall objects by Przemysław Gołębiewski - for spaces that can hold something raw, organic, or both.",
  );
  const alt = localeText(locale, section.heroImageAlt || "Ceramic objects by Przemysław Gołębiewski for interiors");

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
