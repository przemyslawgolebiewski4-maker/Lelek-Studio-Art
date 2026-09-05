import Link from "next/link";
import type { ElementItem } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";
import { SHOP_URL } from "@/lib/config";

/** Fallback when Admin → Home → Hero → semanticCore is empty. */
export const DEFAULT_SEMANTIC_CORE =
  "LELEK is a Berlin-based ceramic artist and studio creating handbuilt ceramic sculptures, wall objects and collectible functional ceramics.";

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
  const alt = content.imageAlt ?? "Lelek Studio Berlin - handmade ceramics";
  const eyebrow = content.eyebrow || "Design through material.";
  const subline = content.subheadline || "Ceramic objects, vessels, prints.";
  const brandline = content.brandline || "LELEK - Berlin.";
  const semanticCore = content.semanticCore?.trim() || DEFAULT_SEMANTIC_CORE;

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
                /^https?:\/\//i.test(content.cta1Url ?? "") ? (
                  <a href={content.cta1Url ?? SHOP_URL} className="hero-btn filled">
                    {content.cta1Text}
                  </a>
                ) : (
                  <Link href={content.cta1Url ?? SHOP_URL} className="hero-btn filled">
                    {content.cta1Text}
                  </Link>
                )
              ) : null}
              {content.cta2Text ? (
                <Link href={content.cta2Url ?? "/about"} className="hero-btn">
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
                {content.kozodoj ?? "Design through material."}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
