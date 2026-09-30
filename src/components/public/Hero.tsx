import Link from "next/link";
import type { ElementItem } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";
import { SHOP_URL } from "@/lib/config";
import { resolvePublicHref } from "@/lib/links";
import {
  CREATOR_ENTITY_DESCRIPTION,
  HERO_BRANDLINE,
  HERO_ELEMENTS_TAGLINE,
  HERO_EYEBROW,
  HERO_IMAGE_ALT,
  HERO_SUBHEADLINE,
} from "@/lib/brand";

export type HeroContent = {
  eyebrow?: string;
  /** @deprecated Not rendered - kept for CMS backward compatibility */
  headline?: string;
  /** @deprecated Not rendered - kept for CMS backward compatibility */
  headlineEm?: string;
  /** @deprecated Not rendered - kept for CMS backward compatibility */
  quote?: string;
  subheadline?: string;
  /** One-sentence semantic core under the hero subline (Admin-editable). */
  semanticCore?: string;
  brandline?: string;
  image?: string;
  imageMobile?: string;
  video?: string;
  videoMobile?: string;
  imageAlt?: string;
  imageCaption?: string;
  cta1Text?: string;
  cta1Url?: string;
  cta2Text?: string;
  cta2Url?: string;
  kozodoj?: string;
};

type HeroProps = {
  content: HeroContent;
  elements?: ElementItem[];
};

export function Hero({ content, elements = [] }: HeroProps) {
  // Only Admin-set media - no hardcoded /images/hero fallbacks under video
  const image = content.image?.trim() || "";
  const imageMobile = content.imageMobile?.trim() || "";
  const video = content.video?.trim() || "";
  const videoMobile = content.videoMobile?.trim() || "";
  const alt = content.imageAlt ?? HERO_IMAGE_ALT;
  const eyebrow = content.eyebrow || HERO_EYEBROW;
  const subline = content.subheadline || HERO_SUBHEADLINE;
  const brandline = content.brandline || HERO_BRANDLINE;
  const semanticCore = content.semanticCore?.trim() || CREATOR_ENTITY_DESCRIPTION;
  const cta1Href = resolvePublicHref(content.cta1Url ?? SHOP_URL);
  const cta2Href = resolvePublicHref(content.cta2Url ?? "/about");

  return (
    <section className="hero">
      <div className="hero-img">
        <MediaBlock
          image={image}
          imageMobile={imageMobile}
          video={video}
          videoMobile={videoMobile}
          alt={alt}
          variant="hero"
        />
        {content.imageCaption ? (
          <div className="hero-img-label">{content.imageCaption}</div>
        ) : null}
      </div>

      <div className="hero-text surface-wabi">
        <div className="hero-content-grid">
          <div className="hero-top">
            <div className="hero-eyebrow">{eyebrow}</div>
            <h1 className="hero-h1 hero-brand">
              {brandline.includes(" - ") ? (
                <>
                  {brandline.slice(0, brandline.lastIndexOf(" - ") + 3)}
                  <span className="accent-bold">
                    {brandline.slice(brandline.lastIndexOf(" - ") + 3)}
                  </span>
                </>
              ) : (
                brandline
              )}
            </h1>
            <div className="hero-rule" />
            <p className="hero-quote hero-subline">{subline}</p>
            <p className="hero-semantic-core">{semanticCore}</p>
            <div className="hero-btns">
              {content.cta1Text ? (
                /^https?:\/\//i.test(cta1Href) ? (
                  <a href={cta1Href} className="hero-btn filled">
                    {content.cta1Text}
                  </a>
                ) : (
                  <Link href={cta1Href} className="hero-btn filled">
                    {content.cta1Text}
                  </Link>
                )
              ) : null}
              {content.cta2Text ? (
                <Link href={cta2Href} className="hero-btn">
                  {content.cta2Text}
                </Link>
              ) : null}
            </div>
          </div>

          {elements.length > 0 ? (
            <div className="hero-bottom">
              <div className="hero-elements">
                {elements.map((item) => (
                  <div key={item.number} className="el">
                    <div className="el-n">{item.number}</div>
                    <div className="el-name">{item.name}</div>
                  </div>
                ))}
              </div>
              <div className="hero-kozodoj">
                {content.kozodoj ?? HERO_ELEMENTS_TAGLINE}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
